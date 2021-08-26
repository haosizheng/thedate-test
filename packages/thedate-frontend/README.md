# thedate-frontend

## Tech Stack

### Web Framework 
React 
Next.js

### Language
Typescript
Eslint
Preitter
Solidity

### Style
Tailwind CSS
Daisy UI 

### Web3
Web3-react
Ethers 
Typechain

## Rendering
Three.js
React-Three Fiber

## Serverless Rendering
chrome-aws-lambda
puppeteer

## Host 
Netify / Vercel 

## 

## Pages

1. index.tsx
  1.1 [blockNumber, blockTimestamp, TheDate, account, library] = useTheDateContext() 
  1.2 ArtworkModelViewer(tokenId, false) 
  1.3 AuctionPanel(tokenId)
  1.5 ArtworkBidHistory(tokenId, 'BidPlaced')
2. artwork/[slug].tsx
  1.1 [blockNumber, blockTimestamp, TheDate, account, library] = useTheDateContext() 
  1.2 ArtworkModelViewer(tokenId, true) 
  1.3 ArtworkCatague(tokenId)
  1.4 useArtworkHistory(tokenId, 'BidPlaced')
3. api/[slug].tsx
  1.1 animation_url	
  1.2 image
4. gallery/index.tsx
  1.1 ArtworkImageViewer(tokenId)
  1.2 ArtworkCatague(tokenId)
  1.3 useArtworkHistory(tokenId, 'BidPlaced')
5. gallery/user/[slug].tsx
  1.1 [blockNumber, blockTimestamp, TheDate, account, library] = useTheDateContext() 
  1.1 ArtworkImageViewer(tokenId)
  1.2 ArtworkCatague(tokenId)
6. gallery/user/[slug].tsx
  1.1 [blockNumber, blockTimestamp, TheDate, account, library] = useTheDateContext() 
  1.1 ArtworkImageViewer(tokenId)
  1.2 ArtworkCatague(tokenId)


# TODO:

# Contract 
- [x] Learn Solidity (5h)
- [x] Learn Hardhat (1h)
- [x] Contract Writing (5h)
- [x] Contract Testing (5h)
- [x] Typechain (1h)
- [x] Hardhat test and deploy to Rinkeby . (2h)
- [x] Hardhat test on localhost  (1h)
- [x] Hardhat deployment json (Read from thedate-frontend) (4h)
- [x] Hardhat-deploy usage. (4h)
- [x] env file setup (1h)
- [x] env gitignore setup. (0.5h)
- [x] Hardhat testnet config (0.5h)
- [x] hardhat forking mainnet test. (0.5h)
- [x] hardhat customized deploy command line. (1h)
- [x] Etherscan verify Rinkeby (0.1h)
- [ ] Organize env file. 

# Frontend 
- [ ] Learn Next.js (5h)
- [ ] Learn tailwind.css (3h)
- [ ] Learn Vercel (2h)
- [ ] Learn Netlify (2h)
- [ ] Learn Typescript (2h)
- [ ] Learn some edge case (2h)
- [ ] Learn IPFS Upload and Organize (2h)
- [ ] Learn Serverless Rendering (2h)
- [ ] Learn Three React (2h)
- [ ] 

# Programming 
- [x] IFPS 
- [x] 
- [] Auction Test. 
- [] Engraving module. 
- [] Rendeing & Metadata on opensea. 
- [] ipns
- [] Serverless Rendering
- [] Input Text Message Check.

# Account 
- [x] Vercel account
- [x] Netlify account
- [x] Twitter account
- [x] Discord account
- [x] Infura API.
- [x] Etherscan API.
- [x] Pinata.cloud API
