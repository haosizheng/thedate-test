import Layout from "../components/Layout";
import Link from "next/link";
import Wallet from "../components/Wallet";
import ArtworkBidHistory from "../components/ArtworkBidHistory";
import ArtworkHistory from "../components/ArtworkHistory";

export default function TestType() {
  return (
    <Layout>
      <ArtworkBidHistory />
      {/* <ArtworkHistory /> */}
      <div className="container mx-auto text-center">
        Ξ<input type="text"  className="bg-transparent focus:outline-none focus:border-none" />
        <Wallet/>
      </div>
    </Layout>
  );
}
