# Flow Social DApp

A decentralized social media application built on the Flow blockchain using Next.js and FCL (Flow Client Library).

## 🌟 Features

- **Flow Wallet Connection**: Connect with Flow Wallet extension on testnet
- **Blockchain Posts**: Create posts directly on Flow blockchain
- **On-Chain Voting**: Vote on posts with Flow transactions
- **Real-time Transaction Status**: Monitor transaction status in real-time
- **Modern UI**: Built with Next.js, Tailwind CSS, and Radix UI
- **TypeScript**: Full type safety throughout the application

## 🏗️ Project Structure

```
flow-social-dapp/
├── contracts/                 # Flow contracts and transactions
│   ├── cadence/              # Cadence smart contracts
│   ├── transactions/         # Transaction scripts
│   └── scripts/              # Query scripts
├── components/               # React components
│   ├── wallet/               # Wallet connection components
│   ├── feed/                 # Social feed components
│   └── providers/            # Context providers
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries
│   └── flow/                 # Flow blockchain utilities
└── app/                      # Next.js app directory
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Flow Wallet browser extension installed
- Flow CLI (optional, for contract deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd flow-social-dapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FLOW_NETWORK=testnet
   NEXT_PUBLIC_ACCESS_NODE_URL=https://rest-testnet.onflow.org
   NEXT_PUBLIC_DISCOVERY_WALLET=https://fcl-discovery.onflow.org/testnet/authn
   NEXT_PUBLIC_APP_TITLE=Flow Social DApp
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 Wallet Connection

The app uses FCL (Flow Client Library) to connect with Flow wallets:

1. **Install Flow Wallet Extension**: Get it from the Chrome Web Store
2. **Create or Import Account**: Set up your Flow testnet account
3. **Connect**: Click "Connect Wallet" in the app
4. **Select Flow Wallet**: Choose Flow Wallet from the discovery UI

## 📝 Smart Contracts

### SocialContract.cdc

Located in `contracts/cadence/SocialContract.cdc`, this contract handles:

- **Posts**: Create and store posts on-chain
- **Voting**: Upvote/downvote posts with Flow tokens
- **Comments**: Add comments to posts
- **User Management**: Track user interactions

### Key Functions

```cadence
// Create a new post
access(all) fun createPost(author: Address, content: String): UInt64

// Vote on a post
access(all) fun voteOnPost(postId: UInt64, voter: Address, isUpvote: Bool)

// Add comment to a post
access(all) fun addComment(postId: UInt64, author: Address, content: String): UInt64

// Get all posts
access(all) fun getAllPosts(): [Post]
```

## 🛠️ Development

### Key Components

1. **FlowProvider**: Initializes Flow configuration
2. **useFlowAuth**: Hook for wallet authentication
3. **useFlowTransaction**: Hook for executing transactions
4. **ConnectWalletButton**: Wallet connection UI
5. **CreatePost**: Post creation with blockchain integration
6. **PostActions**: Voting and interaction components

### Flow Configuration

The app is configured for Flow testnet with the following setup:

```typescript
fcl.config()
  .put("app.detail.title", "Flow Social DApp")
  .put("flow.network", "testnet")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
```

### Transaction Flow

1. **User Action**: Click post/vote button
2. **Wallet Prompt**: Flow Wallet requests user authorization
3. **Transaction Submit**: FCL sends transaction to Flow network
4. **Status Updates**: Real-time status monitoring
5. **UI Update**: Reflect changes when transaction is sealed

## 🧪 Testing

The app includes mock transactions for testing without deploying contracts:

```typescript
// Example mock transaction
const transactionId = await fcl.mutate({
  cadence: `
    transaction(content: String) {
      prepare(signer: &Account) {
        log("Creating post: ".concat(content))
      }
      execute {
        log("Post created successfully")
      }
    }
  `,
  args: (arg, t) => [arg(content, t.String)]
})
```

## 📦 Deployment

### Contract Deployment (Optional)

1. **Install Flow CLI:**
   ```bash
   sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
   ```

2. **Deploy to testnet:**
   ```bash
   flow project deploy --network testnet
   ```

### Frontend Deployment

Deploy to Vercel, Netlify, or your preferred platform:

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_FLOW_NETWORK` | Flow network | `testnet` |
| `NEXT_PUBLIC_ACCESS_NODE_URL` | Flow access node URL | `https://rest-testnet.onflow.org` |
| `NEXT_PUBLIC_DISCOVERY_WALLET` | Wallet discovery endpoint | `https://fcl-discovery.onflow.org/testnet/authn` |
| `NEXT_PUBLIC_APP_TITLE` | App title | `Flow Social DApp` |

### FCL Configuration

The app uses FCL for blockchain interactions:

- **Authentication**: Wallet connection and user management
- **Transactions**: Posting, voting, commenting
- **Queries**: Reading blockchain state
- **Status Monitoring**: Real-time transaction tracking

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Fails**:
   - Ensure Flow Wallet extension is installed
   - Check if you're on Flow testnet
   - Clear browser cache and cookies

2. **Transaction Fails**:
   - Verify you have sufficient Flow tokens for gas
   - Check transaction limits in FCL config
   - Monitor browser console for errors

3. **Contract Interaction Issues**:
   - Ensure contracts are deployed (or use mock mode)
   - Verify contract addresses in flow.json
   - Check network configuration

### Debug Mode

Enable debug logging by adding to your environment:

```env
NODE_ENV=development
```

## 📚 Resources

- [Flow Documentation](https://developers.flow.com)
- [FCL Documentation](https://developers.flow.com/build/tools/clients/fcl-js)
- [Cadence Language](https://cadence-lang.org)
- [Flow Wallet](https://wallet.flow.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

- [ ] Deploy contracts to Flow testnet
- [ ] Add comment functionality
- [ ] Implement user profiles
- [ ] Add media upload to IPFS
- [ ] Mobile responsive design
- [ ] Real-time notifications
- [ ] Integration with Flow NFT standards
