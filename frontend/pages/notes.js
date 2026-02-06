import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../utils/api';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiStar, FiX } from 'react-icons/fi';

export default function Notes() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
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
      fetchNotes();
    }
  }, [isAuthenticated, searchQuery, tagFilter]);

  const fetchNotes = async () => {
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (tagFilter) params.tags = tagFilter;
      
      const response = await notesAPI.getAll(params);
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const noteData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingNote) {
        await notesAPI.update(editingNote._id, noteData);
      } else {
        await notesAPI.create(noteData);
      }

      setShowModal(false);
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      alert(error.response?.data?.message || 'Error saving note');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      isFavorite: note.isFavorite
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await notesAPI.delete(id);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const toggleFavorite = async (note) => {
    try {
      await notesAPI.update(note._id, { isFavorite: !note.isFavorite });
      fetchNotes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', tags: '', isFavorite: false });
    setEditingNote(null);
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
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          New Note
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
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

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="card relative">
              <button
                onClick={() => toggleFavorite(note)}
                className="absolute top-4 right-4"
              >
                <FiStar
                  className={`text-xl ${
                    note.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                  }`}
                />
              </button>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-8">{note.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
              
              {note.tags.length > 0 && (
                <div className="mb-4">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
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
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter note title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="input-field"
                    placeholder="Enter note content"
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
                    placeholder="work, personal, ideas"
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
                  {editingNote ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
