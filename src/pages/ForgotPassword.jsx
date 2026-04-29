import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { apiClient } from '../store/useAuthStore';

// Schemas
const requestOtpSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
    otp: z.string()
        .min(6, "OTP must be 6 digits")
        .max(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must be numeric"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [emailForReset, setEmailForReset] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const {
        register: registerEmail,
        handleSubmit: handleSubmitEmail,
        formState: { errors: errorsEmail },
    } = useForm({ resolver: zodResolver(requestOtpSchema) });

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        formState: { errors: errorsReset },
    } = useForm({ resolver: zodResolver(resetPasswordSchema) });

    const onRequestOtp = async (data) => {
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const res = await apiClient.post('/forgot-password', { email: data.email });
            if (res.data.success) {
                setEmailForReset(data.email);
                setStep(2);
                setSuccessMsg("OTP has been sent to your email.");
            } else {
                setError(res.data.message || "No account found with this email address.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "No account found with this email address.");
        } finally {
            setIsLoading(false);
        }
    };

    const onResetPassword = async (data) => {
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const res = await apiClient.post('/reset-password', {
                email: emailForReset,
                otp: data.otp,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            if (res.data.success) {
                setSuccessMsg("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP or it has expired. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-200">

                <Link to="/login" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#001A33] transition-colors mb-6 w-fit">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    {step === 1
                        ? "Enter your registered email address and we'll send you an OTP."
                        : `Enter the 6-digit OTP sent to ${emailForReset} and set your new password.`}
                </p>

                {error && (
                    <div className="mb-4 p-3 flex gap-2 items-start text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 font-medium">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="mb-4 p-3 flex gap-2 items-start text-sm text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 font-medium">
                        <CheckCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSubmitEmail(onRequestOtp)} className="space-y-4" autoComplete="off">
                        {/* Honeypot — tricks browser autofill away from real fields */}
                        <input type="text" name="username_fake" style={{ display: 'none' }} tabIndex={-1} readOnly />
                        <div>
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                {...registerEmail("email")}
                                type="email"
                                autoComplete="email"
                                placeholder="name@example.com"
                                className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
                            />
                            {errorsEmail.email && (
                                <p className="text-xs text-red-500 mt-1">{errorsEmail.email.message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 bg-[#001A33] text-white rounded-md font-medium hover:bg-[#13304c] disabled:opacity-50 mt-6 flex justify-center items-center gap-2"
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    /* key="reset-form" forces full DOM remount — browser loses autofill context from step 1 */
                    <form key="reset-form" onSubmit={handleSubmitReset(onResetPassword)} className="space-y-4" autoComplete="off">
                        {/* Honeypot fields — browser fills these dummy fields instead of the real OTP box */}
                        <input type="text" name="fake_user" style={{ display: 'none' }} tabIndex={-1} readOnly />
                        <input type="password" name="fake_pass" style={{ display: 'none' }} tabIndex={-1} readOnly />

                        <div>
                            <label className="text-sm font-medium text-slate-700">OTP</label>
                            <input
                                {...registerReset("otp")}
                                type="text"
                                inputMode="numeric"
                                autoComplete="off"
                                data-lpignore="true"
                                data-form-type="other"
                                placeholder="123456"
                                maxLength={6}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }}
                                className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none text-center tracking-[0.5em] text-xl font-bold"
                            />
                            {errorsReset.otp && (
                                <p className="text-xs text-red-500 mt-1">{errorsReset.otp.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">New Password</label>
                            <input
                                type="password"
                                {...registerReset("password")}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
                            />
                            {errorsReset.password && (
                                <p className="text-xs text-red-500 mt-1">{errorsReset.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                            <input
                                type="password"
                                {...registerReset("confirmPassword")}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
                            />
                            {errorsReset.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errorsReset.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || successMsg?.includes('successfully')}
                            className="w-full h-10 bg-[#001A33] text-white rounded-md font-medium hover:bg-[#13304c] disabled:opacity-50 mt-6 flex justify-center items-center gap-2"
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <p className="text-center text-xs text-slate-500 pt-1">
                            Didn't receive OTP?{' '}
                            <button
                                type="button"
                                onClick={() => { setStep(1); setError(null); setSuccessMsg(null); }}
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                Go back and resend
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
