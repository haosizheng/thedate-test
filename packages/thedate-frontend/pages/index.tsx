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
              <ArtworkSVG dateString="2021-08-27" noteString="On the date, Loot was launched" />
            </a>
          </figure>
          <div className="flex flex-row justify-center gap-10 underline">
            <Link href="/claim"><a>Claim past</a></Link>
            <Link href="/auction"><a>Auction today</a></Link>
          </div> 

          <div className="mt-10 text-center">
            <p>
              Each fleeting day would be imprinted into a metadata-based NFT artwork on blockchain immutably.
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
