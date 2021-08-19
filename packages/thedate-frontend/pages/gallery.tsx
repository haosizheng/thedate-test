import Web3 from "web3";
import Web3Modal from "web3modal";
import Sketch from "react-p5";
import p5Types from "p5";
import { useState } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import { ethers } from "ethers";
import { NftProvider, useNft, FetcherDeclaration } from "use-nft";
import Image from 'next/image';

// function TheDate( {tokenId} ) {
//     const n = new Date(tokenId * ethers.utils.parseUnits("1", "days"))
    
//     const setup = (p5: p5Types, canvasParentRef: Element) => {
// 		p5.createCanvas(500, 500).parent(canvasParentRef);
// 	};

//     const draw = (p5: p5Types) => {
// 		p5.background(0);
// 		p5.ellipse(100, 100, 70, 70);
//         p5.text
// 	};

//     n.toLocaleString("en-US", {dateStyle: 'medium'})
// }

function Nft({ tokenId: string} ) {
    const { loading, error, nft } = useNft(
      "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a",
      tokenId
    )
  
    // nft.loading is true during load.
    if (loading) return <>Loading…</>
  
    // nft.error is an Error instance in case of error.
    if (error || !nft) return <>Error.</>

    //      <Image src={nft.image} alt="" />


    // You can now display the NFT metadata.
    return (
      <Card>
        <Card.Img variant="top" src={nft.image} />
        <Card.Body>
          <Card.Title>{nft.name}</Card.Title>
          <Card.Text>{nft.description}</Card.Text>
          <Button>Buy</Button>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Owner: {nft.owner}</small>
        </Card.Footer>
      </Card>
    );
  }

  
function Gallery() {
    const nftFetcher: FetcherDeclaration = ["ethers", { ethers, provider: ethers.getDefaultProvider() }];

    return (
        <>
          <NftProvider fetcher={nftFetcher}>
              <CardGroup>
                  <Nft tokenId="0" />
                  <Nft tokenId="1" />
                  <Nft tokenId="2" />
                  <Nft tokenId="3" />
              </CardGroup>
          </NftProvider>
          <div className="btn-group">
            <button className="btn btn-sm">1</button> 
            <button className="btn btn-sm">2</button> 
            <button className="btn btn-sm">3</button> 
            <button className="btn btn-sm btn-disabled">...</button> 
            <button className="btn btn-sm">99</button> 
            <button className="btn btn-sm">100</button>
          </div>
        </>
    )
}
  
export default Gallery
