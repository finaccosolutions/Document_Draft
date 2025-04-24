import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RecoveryPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { recoverPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await recoverPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send recovery email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-6">Reset your password</h2>
      
      {!isSubmitted ? (
        <>
          <p className="text-gray-600 mb-6 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-error-50 text-error-500 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send recovery link'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="bg-success-50 text-success-500 p-4 rounded-md mb-6">
            Recovery email sent! Please check your inbox.
          </div>
          <p className="text-gray-600 mb-6">
            We've sent a password recovery link to {email}.<br />
            The link will expire in 24 hours.
          </p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RecoveryPage;