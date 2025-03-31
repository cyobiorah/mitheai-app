import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../store/hooks';
import AuthLayout from '../components/AuthLayout';

const Register: React.FC = () => {
  const { register, authLoading, authError, clearAuthError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'individual' as 'individual' | 'organization',
    organizationName: '',
  });
  const [localError, setLocalError] = useState('');

  // Use either local error or auth error from store
  const error = localError || authError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError(''); // Clear error when user types
    clearAuthError(); // Also clear any auth errors
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.userType === 'organization' && !formData.organizationName.trim()) {
      setLocalError('Organization name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLocalError('');
    clearAuthError();

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
        ...(formData.userType === 'organization' && {
          organizationName: formData.organizationName,
        }),
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setLocalError('An account with this email already exists');
            break;
          case 'auth/invalid-email':
            setLocalError('Invalid email address');
            break;
          case 'auth/operation-not-allowed':
            setLocalError('Email/password accounts are not enabled. Please contact support.');
            break;
          case 'auth/weak-password':
            setLocalError('Password is too weak');
            break;
          default:
            setLocalError('Failed to create account');
        }
      } else {
        setLocalError('An unexpected error occurred');
      }
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your content today"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
            Account Type
          </label>
          <div className="mt-1">
            <select
              id="userType"
              name="userType"
              required
              value={formData.userType}
              onChange={handleChange}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>
          </div>
        </div>

        {formData.userType === 'organization' && (
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
              Organization name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                required
                value={formData.organizationName}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Your organization name"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-gray-300">
            Confirm password
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={authLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
          >
            {authLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <div className="text-sm text-center">
          <span className="text-neutral-700 dark:text-gray-300">
            Already have an account?{' '}
          </span>
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Sign in here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
