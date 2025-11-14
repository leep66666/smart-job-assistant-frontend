import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/resume-generator';

  const auth = useAppStore((state) => state.auth);
  const registerUser = useAppStore((state) => state.registerUser);
  const loginUser = useAppStore((state) => state.loginUser);
  const clearAuthError = useAppStore((state) => state.clearAuthError);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, from, navigate]);

  const handleToggleMode = (nextMode: 'login' | 'register') => {
    if (mode !== nextMode) {
      clearAuthError();
      setMode(nextMode);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'register') {
      await registerUser({ fullName, email, password });
    } else {
      await loginUser({ email, password });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => handleToggleMode('login')}
          className={`flex-1 py-2 text-center ${
            mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-gray-500'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => handleToggleMode('register')}
          className={`flex-1 py-2 text-center ${
            mode === 'register' ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-gray-500'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onInvalid={(event) => event.currentTarget.setCustomValidity('Please enter a valid email.')}
            onInput={(event) => event.currentTarget.setCustomValidity('')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onInvalid={(event) =>
              event.currentTarget.setCustomValidity('Password must be at least 6 characters.')
            }
            onInput={(event) => event.currentTarget.setCustomValidity('')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </div>

        {auth.error ? <p className="text-sm text-red-600">{auth.error}</p> : null}

        <button
          type="submit"
          disabled={auth.loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {auth.loading ? 'Please wait...' : mode === 'register' ? 'Sign Up and Continue' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        <button
          type="button"
          onClick={() => handleToggleMode(mode === 'login' ? 'register' : 'login')}
          className="ml-1 text-blue-600 hover:text-blue-800"
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
