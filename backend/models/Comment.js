const { query, getRow, getRows } = require('../config/database');

class Comment {
  // Get all comments for a post
  static async getCommentsByPostId(postId) {
    try {
      const commentsQuery = `
        SELECT 
          id,
          post_id,
          author_address,
          author_name,
          author_avatar_url,
          text,
          created_at,
          likes
        FROM comments
        WHERE post_id = $1
        ORDER BY created_at ASC
      `;
      
      const comments = await getRows(commentsQuery, [postId]);
      
      return comments.map(comment => ({
        id: comment.id,
        postId: comment.post_id,
        author: {
          address: comment.author_address,
          name: comment.author_name,
          avatarUrl: comment.author_avatar_url
        },
        text: comment.text,
        createdAt: comment.created_at,
        likes: parseInt(comment.likes)
      }));
    } catch (error) {
      console.error('Error getting comments by post ID:', error);
      throw error;
    }
  }

  // Create a new comment
  static async createComment(commentData) {
    try {
      const { postId, author, text } = commentData;
      
      // Insert comment
      const commentQuery = `
        INSERT INTO comments (post_id, author_address, author_name, author_avatar_url, text)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const comment = await getRow(commentQuery, [
        postId,
        author.address,
        author.name,
        author.avatarUrl,
        text
      ]);
      
      // Update post comment count
      await query(
        'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
        [postId]
      );
      
      return {
        id: comment.id,
        postId: comment.post_id,
        author: {
          address: comment.author_address,
          name: comment.author_name,
          avatarUrl: comment.author_avatar_url
        },
        text: comment.text,
        createdAt: comment.created_at,
        likes: 0
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // Get a single comment by ID
  static async getCommentById(id) {
    try {
      const commentQuery = `
        SELECT 
          id,
          post_id,
          author_address,
          author_name,
          author_avatar_url,
          text,
          created_at,
          likes
        FROM comments
        WHERE id = $1
      `;
      
      const comment = await getRow(commentQuery, [id]);
      if (!comment) return null;
      
      return {
        id: comment.id,
        postId: comment.post_id,
        author: {
          address: comment.author_address,
          name: comment.author_name,
          avatarUrl: comment.author_avatar_url
        },
        text: comment.text,
        createdAt: comment.created_at,
        likes: parseInt(comment.likes)
      };
    } catch (error) {
      console.error('Error getting comment by ID:', error);
      throw error;
    }
  }

  // Delete a comment
  static async deleteComment(id, userAddress) {
    try {
      // Check if comment exists and user is the author
      const commentQuery = `
        SELECT post_id FROM comments 
        WHERE id = $1 AND author_address = $2
      `;
      const comment = await getRow(commentQuery, [id, userAddress]);
      
      if (!comment) {
        throw new Error('Comment not found or unauthorized');
      }
      
      // Delete the comment
      await query('DELETE FROM comments WHERE id = $1', [id]);
      
      // Update post comment count
      await query(
        'UPDATE posts SET comments_count = comments_count - 1 WHERE id = $1',
        [comment.post_id]
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

module.exports = Comment;
