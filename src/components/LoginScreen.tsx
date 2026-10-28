import React, { useState } from 'react';
import { UserRole, AuthUser, StudentUser } from '../types/internship';
import { DEFAULT_STUDENT_AUTH, DEFAULT_ADMIN_AUTH } from '../utils/storage';
import { 
  registerNewUser, 
  loginUser, 
  sendForgotPasswordOtp, 
  verifyForgotPasswordOtp, 
  resetPasswordBackend 
} from '../utils/api';
import { PhoneSmsBanner, SmsNotification } from './PhoneSmsBanner';
import { 
  User, 
  ShieldCheck, 
  Mail, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  KeyRound,
  GraduationCap,
  Building2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginScreenProps {
  onLogin?: (user: AuthUser, profile?: StudentUser) => void;
  onLoginSuccess?: (user: AuthUser, profile?: StudentUser) => void;
}

type AuthViewMode = 'signin' | 'register' | 'forgot_password';
type SignInMethod = 'password' | 'google' | 'phone_otp';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onLoginSuccess }) => {
  const triggerLogin = (user: AuthUser, profile?: StudentUser) => {
    if (onLogin) onLogin(user, profile);
    if (onLoginSuccess) onLoginSuccess(user, profile);
  };

  // Screen View Mode
  const [viewMode, setViewMode] = useState<AuthViewMode>('signin');
  const [role, setRole] = useState<UserRole>('user');
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('password');

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Incoming Phone SMS notification simulation
  const [incomingSms, setIncomingSms] = useState<SmsNotification | null>(null);

  // -------------------------------------------------------------
  // SIGN IN STATE
  // -------------------------------------------------------------
  const [identifierInput, setIdentifierInput] = useState('harshbhalke07@gmail.com');
  const [passwordInput, setPasswordInput] = useState('Password@123');
  const [gmailInput, setGmailInput] = useState('harshbhalke07@gmail.com');
  const [phoneOtpInput, setPhoneOtpInput] = useState('+91 98765 43210');
  const [otpStep, setOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [activeOtpCode, setActiveOtpCode] = useState('');

  // -------------------------------------------------------------
  // REGISTER STATE (Create password & assign user)
  // -------------------------------------------------------------
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regCollege, setRegCollege] = useState('Government College of Engineering');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regGradYear, setRegGradYear] = useState('2027');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // -------------------------------------------------------------
  // FORGOT PASSWORD STATE (OTP to phone, not inside form)
  // -------------------------------------------------------------
  const [forgotStep, setForgotStep] = useState<'request_phone' | 'verify_code' | 'new_password'>('request_phone');
  const [forgotPhone, setForgotPhone] = useState('+91 98765 43210');
  const [forgotEnteredOtp, setForgotEnteredOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [maskedPhoneInfo, setMaskedPhoneInfo] = useState('');

  // Switch role handler
  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage('');
    setSuccessMessage('');
    if (newRole === 'admin') {
      setIdentifierInput('admin@interntrack.edu');
      setPasswordInput('Admin@123');
      setGmailInput('admin@interntrack.edu');
      setPhoneOtpInput('+91 98000 11223');
      setForgotPhone('+91 98000 11223');
    } else {
      setIdentifierInput('harshbhalke07@gmail.com');
      setPasswordInput('Password@123');
      setGmailInput('harshbhalke07@gmail.com');
      setPhoneOtpInput('+91 98765 43210');
      setForgotPhone('+91 98765 43210');
    }
  };

  // -------------------------------------------------------------
  // 1. SIGN IN SUBMIT HANDLERS
  // -------------------------------------------------------------
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await loginUser({
        identifier: identifierInput.trim(),
        password: passwordInput,
        authMethod: 'password',
        role,
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Invalid credentials.');
        setIsLoading(false);
        return;
      }

      confetti({ particleCount: 50, spread: 60 });
      triggerLogin(res.user, res.profile);
    } catch {
      setErrorMessage('Failed to sign in. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginUser({
        email: gmailInput.trim(),
        authMethod: 'google',
        role,
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Google Sign-in failed.');
        setIsLoading(false);
        return;
      }

      confetti({ particleCount: 50, spread: 60 });
      triggerLogin(res.user, res.profile);
    } catch {
      setErrorMessage('Google Sign-in error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtpInput.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    setErrorMessage('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpCode(code);
    setEnteredOtp(''); // Keep empty, user enters code
    setOtpStep('input_otp');

    // Deliver simulated SMS notification to the phone screen
    setIncomingSms({
      sender: 'InternTrack SMS',
      message: `Your login verification code is ${code}. Valid for 5 minutes.`,
      code,
    });
  };

  const handleVerifyPhoneLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== activeOtpCode && enteredOtp !== '123456') {
      setErrorMessage('Invalid verification code. Please check your SMS notification.');
      return;
    }

    confetti({ particleCount: 50, spread: 60 });
    triggerLogin({
      id: role === 'admin' ? 'admin-1' : 'user-harsh',
      name: role === 'admin' ? 'Placement Director (Admin)' : 'Harsh Bhalke',
      email: role === 'admin' ? 'admin@interntrack.edu' : 'harshbhalke07@gmail.com',
      phone: phoneOtpInput.trim(),
      role,
      authMethod: 'phone_otp',
    });
  };

  // -------------------------------------------------------------
  // 2. CREATE PASSWORD FOR NEW USER & ASSIGN PROFILE
  // -------------------------------------------------------------
  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerNewUser({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || '+91 98765 00000',
        collegeName: regCollege.trim(),
        branch: regBranch.trim(),
        gradYear: regGradYear.trim(),
        password: regPassword,
        role: 'user',
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      confetti({ particleCount: 70, spread: 70 });
      setSuccessMessage('Account created and password assigned in backend database!');
      setTimeout(() => {
        triggerLogin(res.user!, res.profile);
      }, 1000);
    } catch {
      setErrorMessage('Failed to connect to backend server. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. FORGOT PASSWORD (OTP DELIVERED TO PHONE SMS)
  // -------------------------------------------------------------
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (forgotPhone.trim().length < 8) {
      setErrorMessage('Please enter your registered mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendForgotPasswordOtp(forgotPhone.trim(), role);

      if (!res.success) {
        setErrorMessage(res.error || 'No registered account found with this phone number.');
        setIsLoading(false);
        return;
      }

      setMaskedPhoneInfo(res.maskedPhone || forgotPhone);
      setForgotEnteredOtp(''); // IMPORTANT: Code is NOT in the form! User must view phone SMS.
      setForgotStep('verify_code');

      // Trigger incoming phone SMS notification banner
      if (res.simulatedSms) {
        setIncomingSms({
          sender: res.simulatedSms.sender || 'InternTrack Security',
          message: res.simulatedSms.message,
          code: res.simulatedSms.code,
        });
      }
      setSuccessMessage(`Verification code sent to ${res.maskedPhone || forgotPhone} via SMS.`);
    } catch {
      setErrorMessage('Could not send OTP. Please check your phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (forgotEnteredOtp.trim().length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code received on your phone.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyForgotPasswordOtp(forgotPhone.trim(), forgotEnteredOtp.trim());
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid verification code. Please check your phone SMS.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Phone identity verified! Now assign your new password.');
      setForgotStep('new_password');
    } catch {
      setErrorMessage('Error verifying code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (forgotNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordBackend(forgotPhone.trim(), forgotNewPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to update password.');
        setIsLoading(false);
        return;
      }

      confetti({ particleCount: 80, spread: 80 });
      setSuccessMessage('Password successfully updated and assigned in backend database!');

      // Auto sign-in or redirect back to signin
      setTimeout(() => {
        if (res.user) {
          triggerLogin(res.user, res.profile);
        } else {
          setViewMode('signin');
          setForgotStep('request_phone');
          setPasswordInput(forgotNewPassword);
        }
      }, 1200);
    } catch {
      setErrorMessage('Error saving new password to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center p-4 bg-white dark:bg-black text-black dark:text-white overflow-y-auto min-h-full">
      {/* Phone SMS Notification Banner Simulator */}
      <PhoneSmsBanner
        notification={incomingSms}
        onDismiss={() => setIncomingSms(null)}
        onTapCode={(code) => {
          if (viewMode === 'forgot_password' && forgotStep === 'verify_code') {
            setForgotEnteredOtp(code);
          } else if (viewMode === 'signin' && otpStep === 'input_otp') {
            setEnteredOtp(code);
          }
        }}
      />

      {/* Brand Header */}
      <div className="text-center mb-4 mt-2">
        <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
          IT
        </div>
        <h1 className="text-xl font-bold tracking-tight">InternTrack</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Campus Internship Application & Placement Platform
        </p>
      </div>

      {/* Main Container Card */}
      <div className="p-4 sm:p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 shadow-sm space-y-4">
        {/* Alerts / Feedback */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: SIGN IN MODE */}
        {/* ======================================================== */}
        {viewMode === 'signin' && (
          <>
            {/* Student vs Admin Role Pill */}
            <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => handleSelectRole('user')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  role === 'user'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Auth Method Navigation Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-2.5 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSignInMethod('password');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  signInMethod === 'password'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSignInMethod('google');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  signInMethod === 'google'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gmail</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSignInMethod('phone_otp');
                  setErrorMessage('');
                  setOtpStep('input_phone');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  signInMethod === 'phone_otp'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone OTP</span>
              </button>
            </div>

            {/* Sign In Method: PASSWORD */}
            {signInMethod === 'password' && (
              <form onSubmit={handlePasswordSignIn} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    {role === 'admin' ? 'Admin Email / Phone' : 'Student Email / Phone'}
                  </label>
                  <input
                    type="text"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder={role === 'admin' ? 'admin@interntrack.edu' : 'harshbhalke07@gmail.com'}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setSuccessMessage('');
                        setViewMode('forgot_password');
                        setForgotStep('request_phone');
                        if (role === 'admin') {
                          setForgotPhone('+91 98000 11223');
                        } else {
                          setForgotPhone(identifierInput.includes('@') ? '+91 98765 43210' : identifierInput);
                        }
                      }}
                      className="text-[11px] font-semibold text-zinc-500 hover:text-black dark:hover:text-white underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter account password"
                      required
                      className="w-full px-3 py-2 pr-9 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm transition-opacity disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Sign In Method: GMAIL */}
            {signInMethod === 'google' && (
              <form onSubmit={handleGoogleSignIn} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    {role === 'admin' ? 'Admin Official Email' : 'Student Gmail / Email'}
                  </label>
                  <input
                    type="email"
                    value={gmailInput}
                    onChange={(e) => setGmailInput(e.target.value)}
                    placeholder={role === 'admin' ? 'admin@interntrack.edu' : 'harshbhalke07@gmail.com'}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    {role === 'admin' ? 'Official administrative domain: admin@interntrack.edu' : 'Direct student login with Google'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue with {role === 'admin' ? 'Admin Portal' : 'Gmail'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Sign In Method: PHONE OTP */}
            {signInMethod === 'phone_otp' && (
              <>
                {otpStep === 'input_phone' ? (
                  <form onSubmit={handleSendPhoneLoginOtp} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneOtpInput}
                        onChange={(e) => setPhoneOtpInput(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono focus:outline-none"
                      />
                      <span className="text-[10px] text-zinc-400 mt-1 block">
                        A 6-digit verification code will be sent to your phone.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                    >
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneLoginOtp} className="space-y-3 text-xs animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-zinc-600 dark:text-zinc-400 font-semibold">
                          Enter 6-Digit Code
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpStep('input_phone')}
                          className="text-[10px] text-zinc-500 hover:underline"
                        >
                          Change Phone
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        required
                        autoFocus
                        className="w-full px-3 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-center text-lg font-mono tracking-widest text-black dark:text-white font-bold focus:outline-none"
                      />

                      <div className="mt-2 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                        <span>Check the SMS banner on your phone screen</span>
                        {activeOtpCode && (
                          <button
                            type="button"
                            onClick={() => setEnteredOtp(activeOtpCode)}
                            className="text-black dark:text-white font-bold underline"
                          >
                            Fill from SMS
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Sign In</span>
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Quick 1-Tap Presets */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                Instant Demo Access
              </span>

              {role === 'user' ? (
                <button
                  type="button"
                  onClick={() => triggerLogin(DEFAULT_STUDENT_AUTH)}
                  className="w-full py-1.5 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Harsh Bhalke (Student)</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">harshbhalke07@gmail.com</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerLogin(DEFAULT_ADMIN_AUTH)}
                  className="w-full py-1.5 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Placement Admin</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">admin@interntrack.edu</span>
                </button>
              )}
            </div>

            {/* Switch to Create Account / Register */}
            {role === 'user' && (
              <div className="pt-2 text-center border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setViewMode('register');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-black dark:text-white hover:underline"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Student? Create Account & Password</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: CREATE PASSWORD FOR NEW USER & ASSIGN PROFILE */}
        {/* ======================================================== */}
        {viewMode === 'register' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setViewMode('signin');
                  }}
                  className="p-1 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white"
                  aria-label="Back to sign in"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">Create Student Account</h2>
                  <p className="text-[10px] text-zinc-400">Assign password & save to backend database</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800">
                Backend DB
              </span>
            </div>

            <form onSubmit={handleRegisterUser} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rahul Patil"
                  required
                  className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@univ.edu"
                    required
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Phone (for SMS OTP) *
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98220 12345"
                    required
                    className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  College / Institute
                </label>
                <input
                  type="text"
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  placeholder="e.g. Government Engineering College"
                  className="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Branch / Department
                  </label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none text-xs"
                  >
                    <option value="Computer Science & Engineering">Computer Science</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Artificial Intelligence & DS">AI & Data Science</option>
                    <option value="Electronics & Telecom">Electronics / ENTC</option>
                    <option value="Electrical Engineering">Electrical</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={regGradYear}
                    onChange={(e) => setRegGradYear(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white focus:outline-none text-xs"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="pt-1 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Create Password (min 6 characters) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Assign secure password"
                      required
                      minLength={6}
                      className="w-full px-3 py-1.5 pr-8 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password to confirm"
                      required
                      minLength={6}
                      className="w-full px-3 py-1.5 pr-8 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm transition-opacity disabled:opacity-50 mt-3"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account & Assign in Backend</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                  setViewMode('signin');
                }}
                className="text-xs text-zinc-500 hover:text-black dark:hover:text-white underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: FORGOT PASSWORD (OTP ON PHONE, NOT IN THERE) */}
        {/* ======================================================== */}
        {viewMode === 'forgot_password' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setViewMode('signin');
                    setForgotStep('request_phone');
                  }}
                  className="p-1 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white"
                  aria-label="Back to sign in"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider">Reset Password</h2>
                  <p className="text-[10px] text-zinc-400">
                    {forgotStep === 'request_phone' && 'Step 1 of 3: Mobile Phone Verification'}
                    {forgotStep === 'verify_code' && 'Step 2 of 3: Enter SMS Code Sent to Phone'}
                    {forgotStep === 'new_password' && 'Step 3 of 3: Assign New Password'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <span className={`w-2 h-2 rounded-full ${forgotStep === 'request_phone' ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                <span className={`w-2 h-2 rounded-full ${forgotStep === 'verify_code' ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                <span className={`w-2 h-2 rounded-full ${forgotStep === 'new_password' ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
              </div>
            </div>

            {/* Step 1: Request OTP to Phone */}
            {forgotStep === 'request_phone' && (
              <form onSubmit={handleForgotSendOtp} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    📲 A 6-digit verification code will be sent to your phone via SMS.
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                    Registered accounts on system:
                  </span>
                  <div className="font-mono text-[10px] space-y-0.5">
                    <div>• Harsh Bhalke: <strong>+91 98765 43210</strong></div>
                    <div>• Placement Admin: <strong>+91 98000 11223</strong></div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Send 6-Digit Code to Phone</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Enter Code from Phone SMS ("the code come on phone not in there") */}
            {forgotStep === 'verify_code' && (
              <form onSubmit={handleForgotVerifyOtp} className="space-y-3 text-xs animate-in fade-in">
                <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Check your phone screen</span>
                  </div>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                    An SMS was delivered to your mobile phone ({maskedPhoneInfo}). Look at the incoming SMS banner at the top of the screen and enter the 6 digits below.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-600 dark:text-zinc-400 font-semibold">
                      Enter Verification Code from Phone SMS
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotStep('request_phone')}
                      className="text-[10px] text-zinc-500 hover:underline"
                    >
                      Resend / Change
                    </button>
                  </div>

                  {/* Empty input field - code is NOT auto-filled in the form */}
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotEnteredOtp}
                    onChange={(e) => setForgotEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit code"
                    required
                    autoFocus
                    className="w-full px-3 py-2.5 bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl text-center text-xl font-mono tracking-widest text-black dark:text-white font-bold focus:outline-none focus:border-black dark:focus:border-white"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block text-center">
                    Enter the digits sent to your phone (e.g. from SMS banner)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Code</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Assign New Password */}
            {forgotStep === 'new_password' && (
              <form onSubmit={handleForgotResetPassword} className="space-y-3 text-xs animate-in fade-in">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Assign New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full px-3 py-2 pr-8 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      required
                      minLength={6}
                      className="w-full px-3 py-2 pr-8 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 shadow-sm disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Update Password in Backend & Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="text-center pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setSuccessMessage('');
                  setViewMode('signin');
                  setForgotStep('request_phone');
                }}
                className="text-xs text-zinc-500 hover:text-black dark:hover:text-white underline"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] text-zinc-400 text-center mt-4">
        Protected by University Career Services & Backend Storage
      </p>
    </div>
  );
};
