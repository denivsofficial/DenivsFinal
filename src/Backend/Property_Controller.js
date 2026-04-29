const { Property } = require("../models/property");
const { User } = require("../models/user");
const mongoose = require("mongoose");

// --- 1. START A NEW PROPERTY LISTING (LEAD CAPTURE & PROFILE ENHANCEMENT) ---
exports.createProperty = async (req, res) => {
    try {
        const { contactNumber, sellerType, agentReraId, propertyType, transactionType } = req.body;
        const user = await User.findById(req.user.id || req.user?._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.role === 'buyer') {
            user.role = 'seller';
        }

        user.contactNumber = user.contactNumber || contactNumber;
        user.sellerType = user.sellerType || sellerType;
        if (sellerType === 'Agent') {
            user.agentReraId = user.agentReraId || agentReraId;
        }
        await user.save({ validateBeforeSave: false });

        const newProperty = new Property({
            listedBy: req.user.id || req.user?._id,
            propertyType,
            transactionType,
            formStatus: 'incomplete',
            formStep: 1,
            incompleteFormContact: {
                phone: contactNumber,
                name: user.name || '',
            }
        });

        await newProperty.save();

        res.status(201).json({
            success: true,
            message: "Property draft created successfully. You can now proceed.",
            data: newProperty,
        });

    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to start property listing.", error: error.message });
    }
};


// --- 2. UPDATE/SAVE A PROPERTY DRAFT (SAVE-AS-DRAFT & FINAL SUBMIT) ---
exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property draft not found." });
        }

        const userId = req.user?.id || req.user?._id;
        if (property.listedBy.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Access denied. You can only edit your own listings." });
        }

        const updates = {};
        for (const key in req.body) {
            try {
                updates[key] = JSON.parse(req.body[key]);
            } catch (e) {
                updates[key] = req.body[key];
            }
        }

        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => file.path);
            updates.images = [...new Set([...(property.images || []), ...imageUrls])];
        }

        if (updates.location?.coordinates) {
            const coords = updates.location.coordinates.coordinates;

            if (Array.isArray(coords) && coords.length === 2) {
                const lng = parseFloat(coords[0]);
                const lat = parseFloat(coords[1]);

                if (isFinite(lng) && isFinite(lat)) {
                    if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                        updates.location.coordinates = {
                            type: 'Point',
                            coordinates: [lng, lat]
                        };
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: "Invalid coordinates: longitude must be between -180 and 180, latitude between -90 and 90."
                        });
                    }
                } else {
                    delete updates.location.coordinates;
                }
            } else {
                delete updates.location.coordinates;
            }
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        const message = updatedProperty.formStatus === 'submitted'
            ? "Property submitted successfully for review!"
            : `Step ${updatedProperty.formStep} saved successfully.`;

        res.status(200).json({ success: true, message, data: updatedProperty });

    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to update property draft.", error: error.message });
    }
};


// --- GET ALL PROPERTIES (FEED API - Premium First) ---
exports.getPropertyFeed = async (req, res) => {
    try {
        const {
            search, city, propertyType, transactionType, minPrice, maxPrice, bedrooms,
            status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc',
            lat, lng, radius
        } = req.query;

        // Validate pagination
        const validatedPage = Math.max(1, Number(page) || 1);
        const validatedLimit = Math.min(100, Math.max(1, Number(limit) || 10));

        // Validate sortBy field (whitelist approach)
        const allowedSortFields = ['createdAt', 'updatedAt', 'price.value', 'title'];
        const validatedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

        // Validate order
        const validatedOrder = order === 'asc' ? 'asc' : 'desc';

        // Validate price range
        if (minPrice && maxPrice) {
            const minPriceNum = Number(minPrice);
            const maxPriceNum = Number(maxPrice);

            if (minPriceNum < 0 || maxPriceNum < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Price values cannot be negative."
                });
            }

            if (minPriceNum > maxPriceNum) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum price cannot be greater than maximum price."
                });
            }
        }

        // Validate bedrooms
        if (bedrooms && Number(bedrooms) < 0) {
            return res.status(400).json({
                success: false,
                message: "Bedrooms cannot be negative."
            });
        }

        // Validate geo coordinates
        if (lat || lng || radius) {
            // All three must be provided together
            if (!lat || !lng || !radius) {
                return res.status(400).json({
                    success: false,
                    message: "lat, lng, and radius must all be provided for location-based search."
                });
            }

            const latNum = parseFloat(lat);
            const lngNum = parseFloat(lng);
            const radNum = parseFloat(radius);

            if (isNaN(latNum) || isNaN(lngNum) || isNaN(radNum)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid latitude, longitude, or radius values."
                });
            }

            if (latNum < -90 || latNum > 90) {
                return res.status(400).json({
                    success: false,
                    message: "Latitude must be between -90 and 90."
                });
            }

            if (lngNum < -180 || lngNum > 180) {
                return res.status(400).json({
                    success: false,
                    message: "Longitude must be between -180 and 180."
                });
            }

            if (radNum <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Radius must be greater than 0."
                });
            }
        }

        let matchStage = {
            // Only show published/submitted properties (align with Property schema)
            formStatus: { $in: ['published', 'submitted'] }
        };

        if (transactionType && ['Sale', 'Rent'].includes(transactionType)) {
            matchStage.transactionType = transactionType;
        }

        if (req.query.featured === "true") {
            matchStage.featuredRank = { $gt: 0 };
        }

        // Status filter - align with Property schema enum: ['Available', 'Sold', 'Under Offer']
        if (status && status.trim()) {
            const validStatuses = ['Available', 'Sold', 'Under Offer'];
            if (validStatuses.includes(status)) {
                matchStage.status = status;
            }
        } else {
            matchStage.status = 'Available'; // Default
        }

        // Search filter with regex escape to prevent ReDoS
        if (search && search.trim()) {
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapeRegex(search.trim()), "i");
            matchStage.$or = [
                { title: regex },
                { description: regex },
                { "location.city": regex },
                { "location.address": regex }
            ];
        }

        // City filter - align with Property schema (location.city)
        if (city && city.trim()) {
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            matchStage["location.city"] = new RegExp(`^${escapeRegex(city.trim())}$`, "i");
        }

        if (propertyType && propertyType.trim()) {
            const validTypes = ['Apartment', 'House', 'Land', 'Office', 'Shop'];

            // support multiple types like "Office,Shop"
            const types = propertyType.split(",")
                .map(t => t.trim())
                .filter(t => validTypes.includes(t));

            if (types.length === 1) {
                matchStage.propertyType = types[0];
            } else if (types.length > 1) {
                matchStage.propertyType = { $in: types };
            }
        }

        // Bedrooms filter - only for properties with residentialDetails
        if (bedrooms) {
            matchStage["residentialDetails.bedrooms"] = { $gte: Number(bedrooms) };
        }

        // Price range filter - align with Property schema (price.value)
        if (minPrice || maxPrice) {
            matchStage["price.value"] = {};
            if (minPrice) matchStage["price.value"].$gte = Number(minPrice);
            if (maxPrice) matchStage["price.value"].$lte = Number(maxPrice);
        }

        // Geo query - Property schema uses location.coordinates (GeoJSON format)
        if (lat && lng && radius) {
            matchStage["location.coordinates.coordinates"] = {
                $geoWithin: {
                    $centerSphere: [
                        [parseFloat(lng), parseFloat(lat)], // [longitude, latitude]
                        parseFloat(radius) / 6378.1 // Convert km to radians
                    ]
                }
            };
        }

        const sortStage = {
            featuredRank: 1,
            isPremiumUser: -1 // Premium users first
        };

        // Always add secondary sort (even if sortBy is isPremiumUser)
        sortStage[validatedSortBy] = validatedOrder === "asc" ? 1 : -1;

        const pipeline = [
            { $match: matchStage },

            // Join with Users collection - align with User schema
            {
                $lookup: {
                    from: "users", // MongoDB collection name
                    localField: "listedBy",
                    foreignField: "_id",
                    as: "uploader"
                }
            },

            // Unwind with safety for orphaned properties
            {
                $unwind: {
                    path: "$uploader",
                    preserveNullAndEmptyArrays: true
                }
            },

            // Premium user detection - align with User schema
            // User.subscription: { plan, activatedOn, expiry, isActive }
            {
                $addFields: {
                    isPremiumUser: {
                        $cond: [
                            {
                                $and: [
                                    { $ne: ["$uploader", null] }, // User exists
                                    { $ne: ["$uploader.subscription", null] }, // Subscription exists
                                    { $eq: [{ $ifNull: ["$uploader.subscription.plan", "free"] }, "premium"] },
                                    { $eq: [{ $ifNull: ["$uploader.subscription.isActive", false] }, true] },
                                    { $gt: [{ $ifNull: ["$uploader.subscription.expiry", new Date(0)] }, new Date()] }
                                ]
                            },
                            1, // Premium
                            0  // Not premium
                        ]
                    }
                }
            },

            { $sort: sortStage },

            // Pagination with facet
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: (validatedPage - 1) * validatedLimit },
                        { $limit: validatedLimit },
                        {
                            $project: {
                                // Remove temporary and sensitive fields
                                isPremiumUser: 0,
                                "uploader.password": 0,
                                "uploader.emailVerificationToken": 0,
                                "uploader.emailVerificationExpires": 0,
                                "uploader.passwordResetToken": 0,
                                "uploader.passwordResetExpires": 0,
                                "uploader.passwordChangedAt": 0,
                                "uploader._confirmPassword": 0,
                                "uploader.confirmPassword": 0,
                                "__v": 0,
                                "uploader.__v": 0
                            }
                        }
                    ]
                }
            }
        ];

        const result = await Property.aggregate(pipeline);

        const rawData = result?.[0]?.data || [];
        const total = result?.[0]?.metadata?.[0]?.total || 0;

        // Convert uploader → listedBy and remove duplicate field
        const properties = rawData.map(({ uploader, ...rest }) => ({
            ...rest,
            listedBy: uploader || null // Handle orphaned properties gracefully
        }));

        res.status(200).json({
            success: true,
            data: {
                properties,
                totalPages: Math.ceil(total / validatedLimit),
                currentPage: validatedPage,
                totalProperties: total,
                // Optional: Return applied filters for debugging
                appliedFilters: {
                    status: matchStage.status,
                    propertyType: matchStage.propertyType || null,
                    city: city || null,
                    priceRange: minPrice || maxPrice ? { min: minPrice, max: maxPrice } : null,
                    bedrooms: bedrooms || null,
                    hasGeoFilter: !!(lat && lng && radius)
                }
            }
        });

    } catch (error) {
        console.error("Feed Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching properties.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




// --- GET SELLER'S OWN LISTINGS ---
exports.getMyListings = async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user._id || req.user.id);

        const properties = await Property.aggregate([
            { $match: { listedBy: sellerId } },
            {
                $lookup: {
                    from: "leads",
                    localField: "_id",
                    foreignField: "propertyId",
                    as: "propertyLeads"
                }
            },
            {
                $addFields: {
                    leadsCount: { $size: "$propertyLeads" }
                }
            },
            { $project: { propertyLeads: 0 } },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not fetch your listings.", error: error.message });
    }
};


// --- GET A SINGLE PROPERTY BY ID ---
exports.getSingleProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id)
            .populate("listedBy", "name contactNumber avatar sellerType");

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        const userId = req.user?.id || req.user?._id;

        const isOwner = userId && property.listedBy?._id &&
            userId.toString() === property.listedBy._id.toString();

        if (!isOwner) {
            await Property.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
            property.viewCount = (property.viewCount || 0) + 1;
        }

        res.status(200).json({ success: true, data: property });
    } catch (error) {
        res.status(404).json({ success: false, message: "Property not found or invalid ID.", error: error.message });
    }
};


// --- DELETE A PROPERTY ---
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        const userId = req.user?.id || req.user?._id;

        if (property.listedBy.toString() !== userId.toString() && req.user?.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        await Property.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Property and its associated leads deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete property.", error: error.message });
    }
};

// --- GET PROPERTY OG DATA (for WhatsApp/Social previews - NO auth, NO view count) ---
exports.getPropertyOGData = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .select("title description images location propertyType price");

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        // Only expose what's needed for OG tags
        res.status(200).json({
            success: true,
            data: {
                title: property.title,
                description: property.description,
                image: property.images?.[0] || null,
                city: property.location?.city || null,
                propertyType: property.propertyType,
                price: property.price?.value || null,
                currency: property.price?.currency || 'INR',
            }
        });

    } catch (error) {
        res.status(404).json({ success: false, message: "Property not found.", error: error.message });
    }
};