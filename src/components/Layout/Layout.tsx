import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAppStore((state) => state.auth);
  const logoutUser = useAppStore((state) => state.logoutUser);

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Smart Job Assistant
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`text-gray-600 hover:text-blue-600 ${
                  location.pathname === '/' ? 'text-blue-600 font-medium' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to="/resume-generator"
                className={`text-gray-600 hover:text-blue-600 ${
                  location.pathname === '/resume-generator' ? 'text-blue-600 font-medium' : ''
                }`}
              >
                Resume Generator
              </Link>
              <Link
                to="/interview-coach"
                className={`text-gray-600 hover:text-blue-600 ${
                  location.pathname === '/interview-coach' ? 'text-blue-600 font-medium' : ''
                }`}
              >
                Interview Coach
              </Link>
              <Link
                to="/ppt-generator"
                className={`text-gray-600 hover:text-blue-600 ${
                  location.pathname === '/ppt-generator' ? 'text-blue-600 font-medium' : ''
                }`}
              >
                PPT Generator
              </Link>
              {!auth.isAuthenticated ? (
                <Link
                  to="/auth"
                  className={`text-gray-600 hover:text-blue-600 ${
                    location.pathname === '/auth' ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  Log In / Sign Up
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {auth.user?.fullName || auth.user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
