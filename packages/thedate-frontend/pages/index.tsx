import { verifyMessage } from "@ethersproject/wallet";
import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import TheDateArtwork from "../components/TheDateArtwork";
import Auction from "../components/Auction";

function Home() {
  const { account, library } = useWeb3React();

  return (
    <div className="hero">        
        <Auction />
    </div>
  );
}

export default Home;