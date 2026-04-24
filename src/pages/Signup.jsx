import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // 👈 IMPORTED LINK
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuthStore from '../store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';
import { fr } from 'zod/locales';

// --- Zod Schemas based on your Mongoose Model ---
const initiateSchema = z.object({
  type: z.enum(['email', 'phone']),
  value: z.string().min(1, "Value is required"),
}).refine(data => {
  if (data.type === 'email') return z.string().email().safeParse(data.value).success;
  if (data.type === 'phone') return /^[6-9]\d{9}$/.test(data.value);
  return false;
}, { message: "Invalid email or phone format", path: ["value"] });

const completeSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  password: z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [step, setStep] = useState(1); 
  const [authType, setAuthType] = useState('email');
  const [authValue, setAuthValue] = useState('');
  const [otp, setOtp] = useState('');

  const { initiateSignup, verifyOtp, completeSignup, loginWithGoogle, isLoading, error } = useAuthStore();

  const { register: regInit, handleSubmit: handleInitSubmit, formState: { errors: initErrors } } = useForm({
    resolver: zodResolver(initiateSchema),
    defaultValues: { type: 'email', value: '' }
  });

  const { register: regComp, handleSubmit: handleCompSubmit, formState: { errors: compErrors } } = useForm({
    resolver: zodResolver(completeSchema)
  });

  const onInitiate = async (data) => {
    setAuthType(data.type);
    setAuthValue(data.value);
    const res = await initiateSignup(data.type, data.value);
    if (res.success) setStep(2);
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    const res = await verifyOtp(authType, authValue, otp);
    if (res.success) setStep(3);
  };

  const onComplete = async (data) => {
    const res = await completeSignup(data.name, data.password, data.confirmPassword);
    if (res.success) navigate(from, { replace: true }); 
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const res = await loginWithGoogle(credentialResponse.credential);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleError = () => {
    console.error('Google Signup Failed');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Create an Account</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Join DENIVS to start your property journey</p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: Email/Phone Input */}
        {step === 1 && (
          <>
            <form onSubmit={handleInitSubmit(onInitiate)} className="space-y-4">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="email" {...regInit("type")} className="accent-[#001A33]" />
                  <span className="text-sm font-medium">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="phone" {...regInit("type")} className="accent-[#001A33]" />
                  <span className="text-sm font-medium">Phone</span>
                </label>
              </div>

              <div>
                <input 
                  {...regInit("value")} 
                  placeholder={authType === 'email' ? 'name@example.com' : '10-digit mobile number'}
                  className="flex h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#001A33] focus:outline-none transition-colors"
                />
                {initErrors.value && <p className="text-xs text-red-500 mt-1.5 font-medium">{initErrors.value.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full h-11 bg-[#001A33] text-white rounded-lg font-bold hover:bg-[#13304c] disabled:opacity-70 mt-4 shadow-md transition-all">
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or sign up with</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            {/* 👈 THE NEW LOGIN REDIRECT LINK */}
            <p className="text-center text-sm text-slate-600 mt-8 pt-4 border-t border-slate-100">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#001A33] hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={onVerifyOtp} className="space-y-4">
            <p className="text-sm text-center text-slate-600">Enter the OTP sent to <span className="font-bold">{authValue}</span></p>
            <div>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="flex h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-center tracking-widest focus:ring-2 focus:ring-[#001A33] focus:outline-none transition-colors"
                required
              />
            </div>
            <button type="submit" disabled={isLoading || otp.length < 4} className="w-full h-11 bg-[#001A33] text-white rounded-lg font-bold hover:bg-[#13304c] disabled:opacity-70 mt-2 shadow-md transition-all">
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-800 mt-2 transition-colors">
              Change {authType}
            </button>
          </form>
        )}

        {/* STEP 3: Complete Profile (Password) */}
        {step === 3 && (
          <form onSubmit={handleCompSubmit(onComplete)} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input 
                {...regComp("name")} 
                className="flex h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mt-1.5 focus:ring-2 focus:ring-[#001A33] focus:outline-none transition-colors"
              />
              {compErrors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{compErrors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Create Password</label>
              <input 
                type="password"
                {...regComp("password")} 
                className="flex h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mt-1.5 focus:ring-2 focus:ring-[#001A33] focus:outline-none transition-colors"
              />
              {compErrors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{compErrors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <input 
                type="password"
                {...regComp("confirmPassword")} 
                className="flex h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mt-1.5 focus:ring-2 focus:ring-[#001A33] focus:outline-none transition-colors"
              />
              {compErrors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 font-medium">{compErrors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full h-11 bg-[#001A33] text-white rounded-lg font-bold hover:bg-[#13304c] disabled:opacity-70 mt-6 shadow-md transition-all">
              {isLoading ? 'Creating Account...' : 'Complete Signup'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;