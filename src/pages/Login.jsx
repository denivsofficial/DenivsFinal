import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuthStore from '../store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';

// --- Zod Validation Schema ---
const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Phone number is required"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // Calls the login function from our Zustand store
    const res = await login(data.identifier, data.password);
    
    if (res.success) {
      navigate('/'); // Redirect to the homepage on successful login
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await loginWithGoogle(credentialResponse.credential);
    if (res.success) {
      navigate('/');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Log in to your DENIVS account</p>

        {/* Global Error Message from Backend (e.g., "Invalid credentials") */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email / Phone Input */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email or Mobile Number</label>
            <input 
              {...register("identifier")} 
              placeholder="name@example.com or 9876543210"
              className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
            />
            {errors.identifier && (
              <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mt-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </button>
            </div>
            <input 
              type="password"
              {...register("password")} 
              placeholder="••••••••"
              className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-10 bg-[#001A33] text-white rounded-md font-medium hover:bg-[#13304c] disabled:opacity-50 mt-6"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>

        {/* Link to Signup */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#001A33] hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;