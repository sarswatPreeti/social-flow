// Get All Posts Script
import SocialContract from "../contracts/cadence/SocialContract.cdc"

access(all) fun main(): [SocialContract.Post] {
    return SocialContract.getAllPosts()
}
