
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useUser } from '../contexts/clerkHooks';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@hrms.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { signIn, isLoaded } = useSignIn();
  const { user, isSignedIn } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // If already signed in, redirect to correct dashboard
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      if (user.primaryEmailAddress.emailAddress === 'admin@hrms.com') {
        navigate('/dashboard');
      } else {
        navigate('/employee');
      }
      setLoading(false);
      return;
    }

    if (!isLoaded) {
      setError('Authentication service not loaded.');
      setLoading(false);
      return;
    }
    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      // Debug log: Attempting sign in
      // eslint-disable-next-line no-console
      console.log('Attempting sign in with', email);
      const result = await signIn.create({ identifier: email, password });
      // Debug log: Clerk result
      // eslint-disable-next-line no-console
      console.log('Clerk signIn result:', result);
      if (result.status === 'complete') {
        // Debug log: Sign in complete
        // eslint-disable-next-line no-console
        console.log('Sign in complete, checking role and navigating...');
        if (email === 'admin@hrms.com') {
          navigate('/dashboard');
        } else {
          navigate('/employee');
        }
        // Force reload to ensure Clerk session is recognized
        window.location.reload();
      } else {
        setError('Sign in not complete.');
        // eslint-disable-next-line no-console
        console.log('Sign in not complete:', result);
      }
    } catch (err: unknown) {
      let message = 'Login failed';
      // Debug log: Error object
      // eslint-disable-next-line no-console
      console.error('Sign in error:', err);
      if (
        err &&
        typeof err === 'object' &&
        'errors' in err &&
        Array.isArray((err as { errors?: { message?: string }[] }).errors)
      ) {
        const errorsArr = (err as { errors?: { message?: string }[] }).errors;
        if (errorsArr && errorsArr[0]?.message) {
          message = errorsArr[0].message;
        }
      }
      setError(message + ' (Check that the user exists in Clerk and the password is correct.)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <img
            src="https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=200&h=60&fit=crop"
            alt="NetLigent Technologies"
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your HRMS account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Demo credentials: <br />
          <strong>admin@hrms.com</strong> / <strong>password</strong> <br />
          <strong>employee@hrms.com</strong> / <strong>password</strong>
        </div>
        <div className="mt-4 text-center text-sm">
          Forgot your password? <a href="#" className="text-blue-600 hover:underline">Click here to reset it.</a>
        </div>
      </div>
    </div>
  );
}
