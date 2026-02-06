import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { bookmarksAPI } from '../utils/api';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiStar, FiX, FiExternalLink } from 'react-icons/fi';

export default function Bookmarks() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: '',
    isFavorite: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated, searchQuery, tagFilter]);

  const fetchBookmarks = async () => {
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (tagFilter) params.tags = tagFilter;
      
      const response = await bookmarksAPI.getAll(params);
      setBookmarks(response.data.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookmarkData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingBookmark) {
        await bookmarksAPI.update(editingBookmark._id, bookmarkData);
      } else {
        await bookmarksAPI.create(bookmarkData);
      }

      setShowModal(false);
      resetForm();
      fetchBookmarks();
    } catch (error) {
      console.error('Error saving bookmark:', error);
      alert(error.response?.data?.message || 'Error saving bookmark');
    }
  };

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description || '',
      tags: bookmark.tags.join(', '),
      isFavorite: bookmark.isFavorite
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;
    
    try {
      await bookmarksAPI.delete(id);
      fetchBookmarks();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const toggleFavorite = async (bookmark) => {
    try {
      await bookmarksAPI.update(bookmark._id, { isFavorite: !bookmark.isFavorite });
      fetchBookmarks();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const resetForm = () => {
    setFormData({ url: '', title: '', description: '', tags: '', isFavorite: false });
    setEditingBookmark(null);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          New Bookmark
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by tags (comma-separated)"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Bookmarks Grid */}
      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bookmarks found. Save your first bookmark!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="card relative">
              <button
                onClick={() => toggleFavorite(bookmark)}
                className="absolute top-4 right-4"
              >
                <FiStar
                  className={`text-xl ${
                    bookmark.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                  }`}
                />
              </button>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-8">
                {bookmark.title}
              </h3>
              
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm flex items-center mb-3"
              >
                <FiExternalLink className="mr-1" />
                {bookmark.url.length > 40 ? bookmark.url.substring(0, 40) + '...' : bookmark.url}
              </a>
              
              {bookmark.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{bookmark.description}</p>
              )}
              
              {bookmark.tags.length > 0 && (
                <div className="mb-4">
                  {bookmark.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(bookmark)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingBookmark ? 'Edit Bookmark' : 'Create New Bookmark'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave title blank to auto-fetch from URL
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Auto-fetched if left empty"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    placeholder="Optional description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input-field"
                    placeholder="tech, tutorial, design"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    checked={formData.isFavorite}
                    onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-900">
                    Mark as favorite
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingBookmark ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
