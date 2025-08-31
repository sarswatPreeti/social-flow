// Add Comment Transaction
import SocialContract from "../contracts/cadence/SocialContract.cdc"

transaction(postId: UInt64, content: String) {
    prepare(signer: &Account) {
        // No specific preparation needed
    }
    
    execute {
        let commentId = SocialContract.addComment(postId: postId, author: signer.address, content: content)
        log("Added comment with ID: ".concat(commentId.toString()).concat(" to post ").concat(postId.toString()))
    }
}
