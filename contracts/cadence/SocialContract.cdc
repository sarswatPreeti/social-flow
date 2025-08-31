// SocialContract.cdc
// A basic social media contract for posts, votes, and comments on Flow

access(all) contract SocialContract {
    
    // Events
    access(all) event PostCreated(id: UInt64, author: Address, content: String)
    access(all) event PostVoted(id: UInt64, voter: Address, isUpvote: Bool)
    access(all) event CommentAdded(postId: UInt64, commentId: UInt64, author: Address, content: String)
    
    // Post structure
    access(all) struct Post {
        access(all) let id: UInt64
        access(all) let author: Address
        access(all) let content: String
        access(all) let timestamp: UFix64
        access(all) var upvotes: UInt64
        access(all) var downvotes: UInt64
        access(all) let comments: [Comment]
        
        init(id: UInt64, author: Address, content: String) {
            self.id = id
            self.author = author
            self.content = content
            self.timestamp = getCurrentBlock().timestamp
            self.upvotes = 0
            self.downvotes = 0
            self.comments = []
        }
    }
    
    // Comment structure
    access(all) struct Comment {
        access(all) let id: UInt64
        access(all) let author: Address
        access(all) let content: String
        access(all) let timestamp: UFix64
        
        init(id: UInt64, author: Address, content: String) {
            self.id = id
            self.author = author
            self.content = content
            self.timestamp = getCurrentBlock().timestamp
        }
    }
    
    // Storage for posts
    access(contract) var posts: {UInt64: Post}
    access(contract) var nextPostId: UInt64
    access(contract) var nextCommentId: UInt64
    
    // User votes tracking to prevent double voting
    access(contract) var userVotes: {Address: {UInt64: Bool}} // Address -> PostId -> isUpvote
    
    init() {
        self.posts = {}
        self.nextPostId = 1
        self.nextCommentId = 1
        self.userVotes = {}
    }
    
    // Create a new post
    access(all) fun createPost(author: Address, content: String): UInt64 {
        let post = Post(id: self.nextPostId, author: author, content: content)
        self.posts[self.nextPostId] = post
        
        emit PostCreated(id: self.nextPostId, author: author, content: content)
        
        let postId = self.nextPostId
        self.nextPostId = self.nextPostId + 1
        return postId
    }
    
    // Vote on a post
    access(all) fun voteOnPost(postId: UInt64, voter: Address, isUpvote: Bool) {
        pre {
            self.posts[postId] != nil: "Post does not exist"
        }
        
        // Initialize user votes if not exists
        if self.userVotes[voter] == nil {
            self.userVotes[voter] = {}
        }
        
        // Check if user already voted on this post
        if let existingVote = self.userVotes[voter]![postId] {
            // User already voted, don't allow revoting for now
            panic("User already voted on this post")
        }
        
        // Record the vote
        self.userVotes[voter]![postId] = isUpvote
        
        // Update post vote counts
        if isUpvote {
            self.posts[postId]!.upvotes = self.posts[postId]!.upvotes + 1
        } else {
            self.posts[postId]!.downvotes = self.posts[postId]!.downvotes + 1
        }
        
        emit PostVoted(id: postId, voter: voter, isUpvote: isUpvote)
    }
    
    // Add comment to a post
    access(all) fun addComment(postId: UInt64, author: Address, content: String): UInt64 {
        pre {
            self.posts[postId] != nil: "Post does not exist"
        }
        
        let comment = Comment(id: self.nextCommentId, author: author, content: content)
        self.posts[postId]!.comments.append(comment)
        
        emit CommentAdded(postId: postId, commentId: self.nextCommentId, author: author, content: content)
        
        let commentId = self.nextCommentId
        self.nextCommentId = self.nextCommentId + 1
        return commentId
    }
    
    // Get all posts
    access(all) fun getAllPosts(): [Post] {
        let postList: [Post] = []
        for postId in self.posts.keys {
            postList.append(self.posts[postId]!)
        }
        return postList
    }
    
    // Get a specific post
    access(all) fun getPost(id: UInt64): Post? {
        return self.posts[id]
    }
    
    // Get posts by author
    access(all) fun getPostsByAuthor(author: Address): [Post] {
        let userPosts: [Post] = []
        for postId in self.posts.keys {
            let post = self.posts[postId]!
            if post.author == author {
                userPosts.append(post)
            }
        }
        return userPosts
    }
    
    // Check if user voted on a post
    access(all) fun getUserVote(voter: Address, postId: UInt64): Bool? {
        if let userVoteMap = self.userVotes[voter] {
            return userVoteMap[postId]
        }
        return nil
    }
}
