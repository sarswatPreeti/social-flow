// Get User Posts Script
import SocialContract from "../contracts/cadence/SocialContract.cdc"

access(all) fun main(author: Address): [SocialContract.Post] {
    return SocialContract.getPostsByAuthor(author: author)
}
