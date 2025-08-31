const { query, getRow, getRows } = require('../config/database');

class Post {
  // Get all posts with media
  static async getAllPosts() {
    try {
      const postsQuery = `
        SELECT 
          p.id,
          p.author_address,
          p.author_name,
          p.author_avatar_url,
          p.text,
          p.created_at,
          p.upvotes,
          p.downvotes,
          p.comments_count,
          p.following
        FROM posts p
        ORDER BY p.created_at DESC
      `;
      
      const posts = await getRows(postsQuery);
      
      // Get media for each post
      const postsWithMedia = await Promise.all(
        posts.map(async (post) => {
          const mediaQuery = `
            SELECT type, url
            FROM post_media
            WHERE post_id = $1
            ORDER BY created_at
          `;
          const media = await getRows(mediaQuery, [post.id]);
          
          return {
            id: post.id,
            author: {
              address: post.author_address,
              name: post.author_name,
              avatarUrl: post.author_avatar_url
            },
            createdAt: post.created_at,
            text: post.text,
            media: media.map(m => ({ type: m.type, url: m.url })),
            upvotes: parseInt(post.upvotes),
            downvotes: parseInt(post.downvotes),
            comments: parseInt(post.comments_count),
            following: post.following
          };
        })
      );
      
      return postsWithMedia;
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  }

  // Get a single post by ID
  static async getPostById(id) {
    try {
      const postQuery = `
        SELECT 
          p.id,
          p.author_address,
          p.author_name,
          p.author_avatar_url,
          p.text,
          p.created_at,
          p.upvotes,
          p.downvotes,
          p.comments_count,
          p.following
        FROM posts p
        WHERE p.id = $1
      `;
      
      const post = await getRow(postQuery, [id]);
      if (!post) return null;
      
      // Get media for the post
      const mediaQuery = `
        SELECT type, url
        FROM post_media
        WHERE post_id = $1
        ORDER BY created_at
      `;
      const media = await getRows(mediaQuery, [id]);
      
      return {
        id: post.id,
        author: {
          address: post.author_address,
          name: post.author_name,
          avatarUrl: post.author_avatar_url
        },
        createdAt: post.created_at,
        text: post.text,
        media: media.map(m => ({ type: m.type, url: m.url })),
        upvotes: parseInt(post.upvotes),
        downvotes: parseInt(post.downvotes),
        comments: parseInt(post.comments_count),
        following: post.following
      };
    } catch (error) {
      console.error('Error getting post by ID:', error);
      throw error;
    }
  }

  // Create a new post
  static async createPost(postData) {
    try {
      const { author, text, media = [] } = postData;
      
      // Insert post
      const postQuery = `
        INSERT INTO posts (author_address, author_name, author_avatar_url, text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const post = await getRow(postQuery, [
        author.address,
        author.name,
        author.avatarUrl,
        text
      ]);
      
      // Insert media if provided
      if (media.length > 0) {
        const mediaValues = media.map(m => `($1, $2, $3)`).join(', ');
        const mediaQuery = `
          INSERT INTO post_media (post_id, type, url)
          VALUES ${mediaValues}
        `;
        
        const mediaParams = media.flatMap(m => [post.id, m.type, m.url]);
        await query(mediaQuery, mediaParams);
      }
      
      return {
        id: post.id,
        author: {
          address: post.author_address,
          name: post.author_name,
          avatarUrl: post.author_avatar_url
        },
        createdAt: post.created_at,
        text: post.text,
        media: media,
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        following: false
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Vote on a post
  static async votePost(postId, userAddress, voteType) {
    try {
      // Check if user already voted
      const existingVoteQuery = `
        SELECT vote_type FROM votes 
        WHERE post_id = $1 AND user_address = $2
      `;
      const existingVote = await getRow(existingVoteQuery, [postId, userAddress]);
      
      if (existingVote) {
        // Update existing vote
        if (existingVote.vote_type === voteType) {
          // Remove vote if same type
          await query('DELETE FROM votes WHERE post_id = $1 AND user_address = $2', [postId, userAddress]);
          
          // Decrease vote count
          const updateQuery = `
            UPDATE posts 
            SET ${voteType}votes = ${voteType}votes - 1 
            WHERE id = $1
          `;
          await query(updateQuery, [postId]);
        } else {
          // Change vote type
          await query(
            'UPDATE votes SET vote_type = $1 WHERE post_id = $2 AND user_address = $3',
            [voteType, postId, userAddress]
          );
          
          // Update vote counts
          const decreaseOldQuery = `
            UPDATE posts 
            SET ${existingVote.vote_type}votes = ${existingVote.vote_type}votes - 1 
            WHERE id = $1
          `;
          const increaseNewQuery = `
            UPDATE posts 
            SET ${voteType}votes = ${voteType}votes + 1 
            WHERE id = $1
          `;
          await query(decreaseOldQuery, [postId]);
          await query(increaseNewQuery, [postId]);
        }
      } else {
        // Create new vote
        await query(
          'INSERT INTO votes (post_id, user_address, vote_type) VALUES ($1, $2, $3)',
          [postId, userAddress, voteType]
        );
        
        // Increase vote count
        const updateQuery = `
          UPDATE posts 
          SET ${voteType}votes = ${voteType}votes + 1 
          WHERE id = $1
        `;
        await query(updateQuery, [postId]);
      }
      
      // Return updated post
      return await this.getPostById(postId);
    } catch (error) {
      console.error('Error voting on post:', error);
      throw error;
    }
  }

  // Get posts by user address
  static async getPostsByUser(userAddress) {
    try {
      const postsQuery = `
        SELECT 
          p.id,
          p.author_address,
          p.author_name,
          p.author_avatar_url,
          p.text,
          p.created_at,
          p.upvotes,
          p.downvotes,
          p.comments_count,
          p.following
        FROM posts p
        WHERE p.author_address = $1
        ORDER BY p.created_at DESC
      `;
      
      const posts = await getRows(postsQuery, [userAddress]);
      
      // Get media for each post
      const postsWithMedia = await Promise.all(
        posts.map(async (post) => {
          const mediaQuery = `
            SELECT type, url
            FROM post_media
            WHERE post_id = $1
            ORDER BY created_at
          `;
          const media = await getRows(mediaQuery, [post.id]);
          
          return {
            id: post.id,
            author: {
              address: post.author_address,
              name: post.author_name,
              avatarUrl: post.author_avatar_url
            },
            createdAt: post.created_at,
            text: post.text,
            media: media.map(m => ({ type: m.type, url: m.url })),
            upvotes: parseInt(post.upvotes),
            downvotes: parseInt(post.downvotes),
            comments: parseInt(post.comments_count),
            following: post.following
          };
        })
      );
      
      return postsWithMedia;
    } catch (error) {
      console.error('Error getting posts by user:', error);
      throw error;
    }
  }
}

module.exports = Post;
