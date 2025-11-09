import React, { useState } from 'react';
import { sendEmailVerification, User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface EmailVerificationBannerProps {
  user: User;
}

interface FeedbackState {
  message: string;
  type: 'success' | 'error' | 'warning' | '';
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ user }) => {
  const [feedback, setFeedback] = useState<FeedbackState>({ message: '', type: '' });
  const [loading, setLoading] = useState({ resend: false, verify: false });

  const handleResendEmail = async () => {
    setLoading({ ...loading, resend: true });
    setFeedback({ message: '', type: '' });

    try {
      await sendEmailVerification(user, {
        url: window.location.origin,
      });
      setFeedback({
        message: '✅ Verification email sent! Please check:\n• Your inbox\n• Spam/Junk folder\n• It may take 5-10 minutes to arrive\n• Look for emails from: noreply@poll-voting-app-80a35.firebaseapp.com',
        type: 'success',
      });
      // Clear feedback after 12 seconds (longer for detailed message)
      setTimeout(() => setFeedback({ message: '', type: '' }), 12000);
    } catch (error: any) {
      console.error('Resend error:', error);
      
      if (error.code === 'auth/too-many-requests') {
        setFeedback({
          message: '❌ Too many requests. Please wait a few minutes before trying again.',
          type: 'error',
        });
      } else if (error.code === 'auth/network-request-failed') {
        setFeedback({
          message: '❌ Network error. Please check your internet connection and try again.',
          type: 'error',
        });
      } else {
        setFeedback({
          message: `❌ Error: ${error.message || 'Failed to send email'}. Please try again later.`,
          type: 'error',
        });
      }
      // Clear feedback after 8 seconds
      setTimeout(() => setFeedback({ message: '', type: '' }), 8000);
    } finally {
      setLoading({ ...loading, resend: false });
    }
  };

  const handleRefreshStatus = async () => {
    setLoading({ ...loading, verify: true });
    setFeedback({ message: '', type: '' });

    try {
      await user.reload();

      if (user.emailVerified) {
        setFeedback({
          message: '✅ Email verified successfully! Refreshing page...',
          type: 'success',
        });

        // Wait 1.5 seconds then reload
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setFeedback({
          message: '❌ Email not verified yet. Please check your inbox and click the verification link.',
          type: 'warning',
        });
        // Clear feedback after 8 seconds
        setTimeout(() => setFeedback({ message: '', type: '' }), 8000);
      }
    } catch (error: any) {
      console.error('Verify check error:', error);
      setFeedback({
        message: `❌ Error checking verification status: ${error.message || 'Unknown error'}`,
        type: 'error',
      });
      // Clear feedback after 8 seconds
      setTimeout(() => setFeedback({ message: '', type: '' }), 8000);
    } finally {
      setLoading({ ...loading, verify: false });
    }
  };

  if (user.emailVerified) {
    return null; // Don't show banner if verified
  }

  return (
    <div className="verification-banner bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="banner-icon text-yellow-600 text-2xl flex-shrink-0">⚠️</div>
        <div className="banner-content flex-1">
          <p className="text-yellow-800 font-bold text-base mb-2">
            Please verify your email address to access all features
          </p>
          <p className="text-yellow-700 text-sm mb-3">
            We sent a verification email to <strong>{user.email}</strong>
          </p>

          {/* Spam Folder Warning */}
          <div className="spam-warning">
            ⚠️ <strong>Important:</strong> Verification emails often go to your <strong>Spam/Junk folder</strong>. Please check there if you don't see it in your inbox within 5 minutes.
          </div>

          {/* Feedback Message Display */}
          {feedback.message && (
            <div className={`feedback-message ${feedback.type} mt-3 mb-3`}>
              {feedback.message.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
        </div>
        <div className="banner-actions flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleResendEmail}
            disabled={loading.resend || loading.verify}
            className="btn-resend px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading.resend ? 'Sending...' : '📧 Resend Email'}
          </button>
          <button
            onClick={handleRefreshStatus}
            disabled={loading.verify || loading.resend}
            className="btn-verify px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading.verify ? 'Checking...' : "✅ I've Verified"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;

