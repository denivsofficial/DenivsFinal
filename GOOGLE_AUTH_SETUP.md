# Google Authentication Setup Guide

## Overview
Google authentication has been integrated into the DenivsFinal application. This guide will walk you through the setup process.

## What Was Implemented

### Frontend Components:
1. **Google OAuth Library**: Installed `@react-oauth/google` package
2. **Auth Store**: Added `loginWithGoogle()` function in `useAuthStore.js`
3. **Login Page**: Added Google Sign-In button with success/error handlers
4. **Signup Page**: Added Google Sign-Up button with success/error handlers
5. **Main App**: Wrapped with `GoogleOAuthProvider` for global Google auth context

### Backend Endpoint Expected:
The frontend expects the following backend endpoint:
- **POST** `/auth/google` - Accepts `{ token: googleCredential }` and returns user data

## Setup Instructions

### Step 1: Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for local development)
   - `https://yourdomain.com` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `https://yourdomain.com`
8. Copy your **Client ID**

### Step 2: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

### Step 3: Backend Implementation

Your backend needs to implement the `/auth/google` endpoint:

```javascript
// Example backend implementation (Node.js/Express)
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    // Check if user exists, if not create new user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        // ... other fields
      });
    }
    
    // Generate session/JWT token
    // Set cookies or return token
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid Google token',
    });
  }
});
```

### Step 4: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` or `/signup`
3. You should see the Google Sign-In button
4. Click the button and sign in with your Google account
5. You should be redirected to the homepage after successful authentication

## File Changes Summary

- ✅ `package.json` - Added `@react-oauth/google` dependency
- ✅ `src/main.jsx` - Added `GoogleOAuthProvider` wrapper
- ✅ `src/store/useAuthStore.js` - Added `loginWithGoogle()` function
- ✅ `src/pages/Login.jsx` - Added Google login button
- ✅ `src/pages/Signup.jsx` - Added Google signup button
- ✅ `.env` - Created environment variable file
- ✅ `.env.example` - Created example environment file

## Troubleshooting

### Common Issues:

1. **"Invalid Client ID" error**
   - Verify your Client ID in `.env` file
   - Make sure the Client ID matches the one from Google Cloud Console

2. **CORS errors**
   - Ensure your backend allows requests from your frontend domain
   - Check that authorized origins are configured in Google Cloud Console

3. **Button not showing**
   - Verify `GoogleOAuthProvider` is wrapping your app in `main.jsx`
   - Check that the Client ID is properly loaded from environment variables

4. **Authentication fails**
   - Check browser console for error messages
   - Verify backend `/auth/google` endpoint is working correctly
   - Ensure cookies/sessions are being set properly

## Security Notes

- Never commit `.env` file to version control
- Use different Client IDs for development and production
- Always verify Google tokens on the backend
- Implement proper session management
- Add CSRF protection for production

## Next Steps

1. Set up your Google Cloud Console project
2. Configure the Client ID in `.env`
3. Implement the backend `/auth/google` endpoint
4. Test the complete authentication flow
5. Deploy to production with proper configuration
