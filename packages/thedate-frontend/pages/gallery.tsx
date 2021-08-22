import Web3 from "web3";
import Web3Modal from "web3modal";
import Sketch from "react-p5";
import p5Types from "p5";
import { useState } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import { ethers } from "ethers";
import { NftProvider, useNft, FetcherDeclaration } from "use-nft";
import Image from 'next/image';

export default function Gallery() {
    return (
        <div className="container">
          <Artwork tokenId="">
        </div>
    )
}