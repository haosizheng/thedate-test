import Layout from "../components/Layout";
import Link from "next/link";
import Wallet from "../components/Wallet";
import ArtworkBidHistory from "../components/ArtworkBidHistory";
import ArtworkHistory from "../components/ArtworkHistory";

export default function MyGallery() {
  const useArtworks()

  return (
    <Layout>
      <div className="container mx-auto text-center">
        <Wallet/>
      </div>
      <div className="hero">
        <Wallet/>
      </div>
      <div className="hero">
        <div className="hero-content">
          <div className="">
            <div>
              <img href={artworks} />
            </div> 
          </div>
        </div>
        <div className="hero-content">
        </div>
      </div>
    </Layout>
  );
}
