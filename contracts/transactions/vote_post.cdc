// Vote on Post Transaction
import SocialContract from "../contracts/cadence/SocialContract.cdc"

transaction(postId: UInt64, isUpvote: Bool) {
    prepare(signer: &Account) {
        // No specific preparation needed
    }
    
    execute {
        SocialContract.voteOnPost(postId: postId, voter: signer.address, isUpvote: isUpvote)
        let voteType = isUpvote ? "upvoted" : "downvoted"
        log("User ".concat(signer.address.toString()).concat(" ").concat(voteType).concat(" post ").concat(postId.toString()))
    }
}
