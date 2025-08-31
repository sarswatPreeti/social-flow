// Create Post Transaction
import SocialContract from "../contracts/cadence/SocialContract.cdc"

transaction(content: String) {
    prepare(signer: &Account) {
        // No specific preparation needed
    }
    
    execute {
        let postId = SocialContract.createPost(author: signer.address, content: content)
        log("Created post with ID: ".concat(postId.toString()))
    }
}
