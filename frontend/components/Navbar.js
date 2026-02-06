import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { FiBookmark, FiFileText, FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 text-xl font-bold text-primary-600">
              NoteMark
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/notes"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  router.pathname === '/notes'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FiFileText className="mr-2" />
                Notes
              </Link>
              
              <Link
                href="/bookmarks"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  router.pathname === '/bookmarks'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FiBookmark className="mr-2" />
                Bookmarks
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <FiUser className="text-gray-600 mr-2" />
              <span className="text-sm text-gray-700">{user?.username}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/notes"
            className={`flex items-center px-3 py-2 text-base font-medium ${
              router.pathname === '/notes'
                ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            <FiFileText className="mr-3" />
            Notes
          </Link>
          
          <Link
            href="/bookmarks"
            className={`flex items-center px-3 py-2 text-base font-medium ${
              router.pathname === '/bookmarks'
                ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            <FiBookmark className="mr-3" />
            Bookmarks
          </Link>
        </div>
      </div>
    </nav>
  );
}
