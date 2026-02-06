const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch metadata (title) from a URL
 * @param {string} url - The URL to fetch metadata from
 * @returns {Promise<object>} - Object containing title and success status
 */
const fetchUrlMetadata = async (url) => {
  try {
    // Set a timeout and user agent
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Load HTML into cheerio
    const $ = cheerio.load(response.data);

    // Try to get title from various sources
    let title = $('title').text().trim();
    
    // Fallback to og:title meta tag
    if (!title) {
      title = $('meta[property="og:title"]').attr('content');
    }
    
    // Fallback to twitter:title meta tag
    if (!title) {
      title = $('meta[name="twitter:title"]').attr('content');
    }

    // Get description as well (bonus)
    let description = $('meta[name="description"]').attr('content');
    
    if (!description) {
      description = $('meta[property="og:description"]').attr('content');
    }

    return {
      success: true,
      title: title || 'Untitled',
      description: description || ''
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error.message);
    return {
      success: false,
      title: 'Untitled',
      description: '',
      error: error.message
    };
  }
};

module.exports = { fetchUrlMetadata };
