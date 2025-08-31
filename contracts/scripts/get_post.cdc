// Get Single Post Script
import SocialContract from "../contracts/cadence/SocialContract.cdc"

access(all) fun main(postId: UInt64): SocialContract.Post? {
    return SocialContract.getPost(id: postId)
}
