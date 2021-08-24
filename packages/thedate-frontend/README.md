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


TODO:
1. thedate-contracts only not thefoundation. 
