const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            maxLength: 50,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            sparse: true,
            validate: [validator.isEmail, "Please provide a valid email address."],
        },

        password: {
            type: String,
            minlength: 8,
            select: false,
        },

        contactNumber: {
            type: String,
            unique: true,
            sparse: true,
            validate: [
                (val) => !val || validator.isMobilePhone(val, "en-IN"),
                "Please provide a valid Indian mobile number.",
            ],
        },

        registrationType: {
            type: String,
            enum: ["email", "phone"],
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: String,
        emailVerificationExpires: Date,

        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        phoneVerificationToken: String,
        phoneVerificationExpires: Date,

        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,

        // Google auth
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        avatar: {
            type: String,
        },

        role: {
            type: String,
            enum: ["buyer", "seller", "admin"],
            default: "buyer",
        },
        sellerType: {
            type: String,
            enum: ["Owner", "Agent", "Builder"],
            required: [
                function () {
                    return this.role === "seller";
                },
                "Seller type is required for sellers.",
            ],
        },
        agentReraId: {
            type: String,
            trim: true,
            uppercase: true,
            required: [
                function () {
                    return this.sellerType === "Agent";
                },
                "RERA ID is required for agents.",
            ],
        },

        subscription: {
            plan: {
                type: String,
                enum: ["free", "premium"],
                default: "free",
            },
            activatedOn: {
                type: Date,
                default: null,
            },
            expiry: {
                type: Date,
                default: null,
            },
            isActive: {
                type: Boolean,
                default: false,
            },
        },

        registrationCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual confirmPassword 
userSchema
    .virtual("confirmPassword")
    .get(function () {
        return this._confirmPassword;
    })
    .set(function (value) {
        this._confirmPassword = value;
    });

// Password hashing 
userSchema.pre("save", async function (next) {
    // Skip password validation for Google auth users or if password is not modified
    if (!this.isModified("password") || !this.password) return next();

    // Only validate password if it's being set (not for Google-only auth)
    if (this.password) {
        if (!validator.isStrongPassword(this.password)) {
            throw new Error(
                "Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)."
            );
        }

        if (this.password !== this.confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        this.password = await bcrypt.hash(this.password, 12);

        if (!this.isNew) {
            this.passwordChangedAt = Date.now() - 1000;
        }
    }

    next();
});

// Auto-deactivate expired subscription 
userSchema.pre("save", function (next) {
    if (this.subscription?.expiry && new Date() > this.subscription.expiry) {
        this.subscription.plan = "free";
        this.subscription.isActive = false;
    }
    next();
});

// toJSON sanitize 
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    delete obj.confirmPassword;
    delete obj._confirmPassword;
    delete obj.emailVerificationToken;
    delete obj.emailVerificationExpires;
    delete obj.phoneVerificationToken;
    delete obj.phoneVerificationExpires;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    delete obj.passwordChangedAt;
    return obj;
};

// JWT
userSchema.methods.generateAuthToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined.");
    }

    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Password compare
userSchema.methods.validatePassword = function (passwordInput) {
    return bcrypt.compare(passwordInput, this.password);
};

// OTP generators
userSchema.methods.generateEmailVerificationToken = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.emailVerificationToken = otp;
    this.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    return otp;
};

userSchema.methods.generatePhoneVerificationToken = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.phoneVerificationToken = otp;
    this.phoneVerificationExpires = Date.now() + 10 * 60 * 1000;
    return otp;
};

userSchema.methods.generatePasswordResetOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.passwordResetToken = otp;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return otp;
};

// Subscription helpers
userSchema.methods.isPremium = function () {
    return (
        this.subscription.plan === "premium" &&
        this.subscription.isActive === true &&
        this.subscription.expiry &&
        new Date() < this.subscription.expiry
    );
};

userSchema.methods.upgradeSubscription = function (durationInMonths) {
    const now = new Date();
    const startDate =
        this.subscription.isActive && this.subscription.expiry > now
            ? this.subscription.expiry
            : now;
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + durationInMonths);

    this.subscription = {
        plan: "premium",
        isActive: true,
        activatedOn: this.subscription.activatedOn || now,
        expiry: expiryDate,
    };
};

userSchema.methods.downgradeSubscription = function () {
    this.subscription = {
        plan: "free",
        isActive: false,
        activatedOn: null,
        expiry: null,
    };
};

const User = mongoose.model("User", userSchema);
module.exports = { User };