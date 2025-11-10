import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePoll } from '../context/PollContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const { setViewMode } = usePoll();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setViewMode('workspace');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage('');
    setError('');

    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    try {
      await resetPassword(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-designer-pattern px-4">
      <div className="max-w-md w-full bg-[#fafaff] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] p-8 border border-[#8f4eff]/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {resetMessage}
          </div>
        )}

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-900"
                placeholder="you@example.com"
                style={{ color: '#1a1a1a', fontSize: '16px' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-900"
                  placeholder="Enter your password"
                  style={{ color: '#1a1a1a', fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-purple-600 hover:text-purple-800 font-semibold"
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] text-white py-3 rounded-xl font-bold text-lg hover:from-[#a366ff] hover:to-[#2ef9d8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-gray-900"
                placeholder="you@example.com"
                style={{ color: '#1a1a1a', fontSize: '16px' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setResetMessage('');
                  setError('');
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#8f4eff] to-[#18e6c1] text-white py-3 rounded-xl font-bold hover:from-[#a366ff] hover:to-[#2ef9d8] transition-all shadow-lg"
              >
                Send Reset Email
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setViewMode('register')}
              className="text-[#8f4eff] hover:text-[#a366ff] font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

