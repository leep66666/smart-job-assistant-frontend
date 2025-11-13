import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

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