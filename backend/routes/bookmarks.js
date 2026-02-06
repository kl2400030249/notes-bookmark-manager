const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');
const { fetchUrlMetadata } = require('../utils/urlMetadata');

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   POST /api/bookmarks
// @desc    Create a new bookmark (auto-fetch title if not provided)
// @access  Private
router.post('/', [
  body('url').trim().notEmpty().withMessage('URL is required')
    .isURL({ protocols: ['http', 'https'] }).withMessage('Please provide a valid URL'),
  body('title').optional().trim(),
  body('description').optional().trim(),
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

    let { url, title, description, tags, isFavorite } = req.body;

    // Auto-fetch title if not provided (bonus feature)
    if (!title || title.trim() === '') {
      console.log('Fetching metadata for URL:', url);
      const metadata = await fetchUrlMetadata(url);
      title = metadata.title;
      
      // Also use fetched description if not provided
      if (!description && metadata.description) {
        description = metadata.description;
      }
    }

    // Create bookmark
    const bookmark = new Bookmark({
      url,
      title,
      description: description || '',
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user._id
    });

    await bookmark.save();

    res.status(201).json({
      success: true,
      message: 'Bookmark created successfully',
      data: bookmark
    });
  } catch (error) {
    console.error('Create bookmark error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating bookmark' 
    });
  }
});

// @route   GET /api/bookmarks
// @desc    Get all bookmarks for the logged-in user (with optional search and tag filtering)
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
        { description: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } }
      ];
    }

    // Add tag filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching bookmarks' 
    });
  }
});

// @route   GET /api/bookmarks/:id
// @desc    Get a single bookmark by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!bookmark) {
      return res.status(404).json({ 
        success: false,
        message: 'Bookmark not found' 
      });
    }

    res.json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    console.error('Get bookmark error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Bookmark not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching bookmark' 
    });
  }
});

// @route   PUT /api/bookmarks/:id
// @desc    Update a bookmark
// @access  Private
router.put('/:id', [
  body('url').optional().trim().isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid URL'),
  body('title').optional().trim(),
  body('description').optional().trim(),
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

    const { url, title, description, tags, isFavorite } = req.body;

    // Find bookmark
    let bookmark = await Bookmark.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!bookmark) {
      return res.status(404).json({ 
        success: false,
        message: 'Bookmark not found' 
      });
    }

    // Update fields
    if (url !== undefined) bookmark.url = url;
    if (title !== undefined) bookmark.title = title;
    if (description !== undefined) bookmark.description = description;
    if (tags !== undefined) bookmark.tags = tags;
    if (isFavorite !== undefined) bookmark.isFavorite = isFavorite;

    await bookmark.save();

    res.json({
      success: true,
      message: 'Bookmark updated successfully',
      data: bookmark
    });
  } catch (error) {
    console.error('Update bookmark error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Bookmark not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error updating bookmark' 
    });
  }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Delete a bookmark
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!bookmark) {
      return res.status(404).json({ 
        success: false,
        message: 'Bookmark not found' 
      });
    }

    res.json({
      success: true,
      message: 'Bookmark deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Bookmark not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting bookmark' 
    });
  }
});

module.exports = router;
