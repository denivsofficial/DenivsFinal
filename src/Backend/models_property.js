const mongoose = require("mongoose");

// --- Sub-schemas for Different Property Types ---
const PlotDetailsSchema = new mongoose.Schema({
    plotArea: { type: Number },
    areaUnit: { type: String, enum: ['sqft', 'sqm', 'acres'], default: 'sqft' },
    facing: { type: String, enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] },
    gatedCommunity: { type: Boolean, default: false },
}, { _id: false });

const ResidentialDetailsSchema = new mongoose.Schema({
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    furnishingStatus: {
        type: String,
        enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        default: 'Unfurnished'
    },
    carpetArea: Number,
    areaUnit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' },
    floorNumber: Number,
    totalFloors: Number,
}, { _id: false });

const CommercialDetailsSchema = new mongoose.Schema({
    carpetArea: Number,
    areaUnit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' },
    washrooms: { type: Number, default: 0 },
    furnishingStatus: {
        type: String,
        enum: ['Furnished', 'Semi-Furnished', 'Unfurnished', 'Bare Shell'],
        default: 'Bare Shell'
    },
    floorNumber: Number,
    totalFloors: Number,
}, { _id: false });


// --- Main Property Schema ---
const propertySchema = new mongoose.Schema({

    // --- Form Completion & Lead Capture System ---
    formStep: { type: Number, default: 1 },
    formStatus: {
        type: String,
        enum: ['incomplete', 'submitted', 'published', 'rejected'],
        default: 'incomplete',
        index: true
    },
    incompleteFormContact: {
        name: String,
        phone: String,
        wasContacted: { type: Boolean, default: false }
    },

    // --- Basic Information (from Step 1) ---
    propertyType: {
        type: String,
        required: [true, "Property type is required."],
        enum: ['Apartment', 'House', 'Land', 'Office', 'Shop'],
        index: true
    },
    transactionType: {
        type: String,
        enum: ['Sale', 'Rent'],
        required: true,
        default: 'Sale'
    },

    // --- Type-Specific Property Details (from Step 2) ---
    residentialDetails: ResidentialDetailsSchema,
    plotDetails: PlotDetailsSchema,
    commercialDetails: CommercialDetailsSchema,

    // --- Location Details (from Step 3) ---
    location: {
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        coordinates: {
            type: { type: String, enum: ['Point'] },
            coordinates: { type: [Number] },
        },
    },

    // --- Media (from Step 3) ---
    images: [{ type: String }],

    // --- Final Details (from Step 4) ---
    title: { type: String, maxLength: 100, trim: true },
    description: { type: String, maxLength: 2000, trim: true },
    price: {
        value: { type: Number },
        currency: { type: String, default: 'INR' },
        isNegotiable: { type: Boolean, default: false },
        securityDeposit: { type: Number },
        maintenanceIncluded: { type: Boolean, default: false },
    },

    // --- Amenities ---
    amenities: {
        type: [String],
        default: [],
        validate: {
            validator: function (arr) {
                return arr.length <= 30;
            },
            message: "Too many amenities listed."
        }
    },

    // --- RERA & Resale Fields ---
    isResaleProperty: { type: Boolean },
    reraId: {
        type: String,
        trim: true,
        uppercase: true,
    },

    rejectionReason: {
        type: String,
        maxLength: 500,
        trim: true
    },
    verifiedAt: {
        type: Date
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // --- Management & Status ---
    listedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Under Offer'],
        default: 'Available',
    },
    isVerified: { type: Boolean, default: false },
    featuredRank: {
        type: Number,
        default: 0,
        index: true
    },
    viewCount: {
        type: Number,
        default: 0,
        min: 0
    },

}, {
    timestamps: true
});


// --- Mongoose Hooks ---

propertySchema.pre('validate', function (next) {
    if (this.formStatus === 'submitted' || this.formStatus === 'published') {

        if (this.transactionType === 'Sale' && this.isResaleProperty === false && !this.reraId) {
            this.invalidate('reraId', 'Project RERA ID is required for new properties.');
        }

        if (!this.title) this.invalidate('title', 'Property title is required for submission.');
        if (!this.price.value) this.invalidate('price.value', 'Price/Rent is required for submission.');
        if (!this.location.address) this.invalidate('location.address', 'Address is required for submission.');
    }
    next();
});

// Cascading Deletes - when a property is deleted, wipe its leads too
propertySchema.pre('findOneAndDelete', async function (next) {
    const propertyId = this.getQuery()["_id"];
    if (propertyId) {
        // Calling mongoose.model here prevents circular dependency issues between files
        await mongoose.model('Lead').deleteMany({ propertyId });
    }
    next();
});


// --- Indexes for Performance ---
propertySchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });
propertySchema.index({ 'location.city': 1, propertyType: 1, 'price.value': 1 });
propertySchema.index({ formStatus: 1, 'incompleteFormContact.wasContacted': 1 });


const Property = mongoose.model("Property", propertySchema);

module.exports = { Property };