const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.getAllPosts();
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { author, text, media } = req.body;
    
    if (!author || !author.address) {
      return res.status(400).json({ error: 'Author address is required' });
    }
    
    if (!text && (!media || media.length === 0)) {
      return res.status(400).json({ error: 'Post must have text or media' });
    }
    
    const post = await Post.createPost({ author, text, media });
    res.status(201).json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Vote on a post
router.post('/:id/vote', async (req, res) => {
  try {
    const { userAddress, voteType } = req.body;
    
    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }
    
    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Vote type must be "up" or "down"' });
    }
    
    const post = await Post.votePost(req.params.id, userAddress, voteType);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ post });
  } catch (error) {
    console.error('Error voting on post:', error);
    res.status(500).json({ error: 'Failed to vote on post' });
  }
});

// Get posts by user
router.get('/user/:address', async (req, res) => {
  try {
    const posts = await Post.getPostsByUser(req.params.address);
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.getCommentsByPostId(req.params.id);
    res.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    
    if (!author || !author.address) {
      return res.status(400).json({ error: 'Author address is required' });
    }
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    const comment = await Comment.createComment({
      postId: req.params.id,
      author,
      text
    });
    
    res.status(201).json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

module.exports = router;
