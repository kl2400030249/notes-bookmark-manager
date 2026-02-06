import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { FiBookmark, FiFileText } from 'react-icons/fi';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/notes');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-4">
            Welcome to NoteMark
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal notes and bookmark manager. Organize your thoughts and save your favorite links in one beautiful place.
          </p>
          
          <div className="flex justify-center space-x-4 mb-16">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                <FiFileText className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rich Notes</h3>
              <p className="text-gray-600">
                Create and organize notes with tags. Search through your notes effortlessly and mark favorites.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                <FiBookmark className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Bookmarks</h3>
              <p className="text-gray-600">
                Save your favorite URLs with automatic title fetching. Organize with tags and descriptions.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Features</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li>✓ Secure authentication</li>
              <li>✓ Tag-based organization</li>
              <li>✓ Full-text search</li>
              <li>✓ Mark items as favorites</li>
              <li>✓ Automatic bookmark metadata fetching</li>
              <li>✓ Responsive design for all devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
