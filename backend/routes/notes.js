const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, content, tags, isFavorite } = req.body;

    // Create note
    const note = new Note({
      title,
      content,
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user._id
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating note' 
    });
  }
});

// @route   GET /api/notes
// @desc    Get all notes for the logged-in user (with optional search and tag filtering)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { q, tags } = req.query;
    
    // Build query
    let query = { user: req.user._id };

    // Add text search if query parameter exists
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }

    // Add tag filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching notes' 
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a single note by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Get note error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching note' 
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, content, tags, isFavorite } = req.body;

    // Find note
    let note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isFavorite !== undefined) note.isFavorite = isFavorite;

    await note.save();

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    console.error('Update note error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error updating note' 
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete note error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting note' 
    });
  }
});

module.exports = router;
