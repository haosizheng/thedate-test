import Auction from "@/components/Auction";
import Layout from "@/components/Layout";
import ArtworkSVG from "@/components/ArtworkSVG";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
        <div className="content">
          <figure>
            <a href="">
              <ArtworkSVG tokenId="1" />
            </a>
          </figure>
          <div className="mt-10 text-center">
            <p>
              Superpower is 
            </p>
            <p>            
              Optionally, the owner can engrave or erase a note on The Date artwork as an additional metadata.
            </p>

            <p>            
              Community can use The Date in anyway they want. 
              For more detail, see <Link href="/faq"><a>FAQ</a></Link>
            </p>
          </div>
        </div>
    </Layout>
  );
}
