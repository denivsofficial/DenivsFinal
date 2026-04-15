# Backend Google Authentication Implementation Guide

## Overview
This guide shows you how to add the `/auth/google` endpoint to your existing backend at `https://api.denivs.com`.

## Step 1: Install Required Package

In your backend project, install the Google Auth library:

```bash
npm install google-auth-library
```

## Step 2: Add the Google Auth Endpoint

Add this route to your backend (typically in your auth routes file):

```javascript
// routes/auth.js or routes/user.js
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Adjust path to your User model

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Authentication Endpoint
router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { 
      sub: googleId, 
      email, 
      name, 
      picture,
      email_verified 
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified with Google'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user from Google data
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        isVerified: true, // Google emails are already verified
        authProvider: 'google',
        // Add any other default fields your User model requires
      });
    } else {
      // Update existing user with Google info if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture;
        user.authProvider = user.authProvider || 'google';
        await user.save();
      }
    }

    // Set session or generate JWT token
    // This depends on how your existing auth works
    
    // OPTION 1: If using sessions (cookie-based)
    req.session.userId = user._id;
    
    // OPTION 2: If using JWT tokens
    // const jwtToken = generateJWTToken(user);
    // res.cookie('token', jwtToken, { httpOnly: true, secure: true });

    // Return user data (exclude sensitive fields)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      // Add other fields as needed
    };

    res.json({
      success: true,
      data: userData,
    });

  } catch (error) {
    console.error('Google auth error:', error);
    
    if (error.message.includes('Token used too late') || 
        error.message.includes('Invalid token')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Google token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
```

## Step 3: Add Google Client ID to Backend Environment

Add this to your backend's `.env` file:

```env
GOOGLE_CLIENT_ID=126364539599-v5498b91qaekp91i3noqb2g0b0cbsp61.apps.googleusercontent.com
```

## Step 4: Import and Use the Route

In your main server file (app.js or index.js):

```javascript
const authRoutes = require('./routes/auth'); // Adjust path

// Use the auth routes
app.use('/auth/google', authRoutes);
// OR if the route is defined in the file:
// app.use('/', authRoutes);
```

## Step 5: Test the Endpoint

You can test it with this curl command (replace TOKEN with a real Google token):

```bash
curl -X POST https://api.denivs.com/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_GOOGLE_TOKEN_HERE"}'
```

## Expected Response

**Success:**
```json
{
  "success": true,
  "data": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Invalid or expired Google token"
}
```

## Important Notes

1. **Session Management**: Make sure to integrate with your existing session/JWT system
2. **User Model**: Adjust the User model fields to match your schema
3. **CORS**: Ensure your backend allows requests from `http://localhost:5173`
4. **Cookies**: If using cookies, make sure `withCredentials: true` is set (already done in frontend)
5. **Error Handling**: Customize error messages to match your existing API response format

## Common Issues

### CORS Error
Add this to your Express app:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://denivs.com'],
  credentials: true
}));
```

### Session Not Persisting
Make sure you have:
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));
```

## After Implementation

Once you add this endpoint to your backend:
1. Restart your backend server
2. Test the Google login on `http://localhost:5173`
3. Check browser console for any errors
4. Verify the user is created/found in your database
