import Layout from "../components/Layout";
import Link from "next/link";
import { formatEtherscanLink } from "../utils/ethers";

export default function About() {
  const etherScanLinkOfToken = formatEtherscanLink("Token", [1, "0xf9c2874a88ed6c5a8115cb5693996c8fe22b3ce2"]);

  return (
    <Layout>
      <div className="container mx-auto">
        <article className="text-xs max-w-prose mx-auto leading-8 px-5 md:px-3">
          <p className="mb-8">
            <b>The Date</b> is a crypto-native conceptual art experiment, in which, 
            each fleeting day would be imprinted into an artwork on blockchain timelessly.
          </p>

          <p className="mb-8">
            Given the immutable nature of blockchain, every <b>The Date</b> artwork will last forever, 
            exceeding one&apos;s lifetime, and perhaps beyond existence of human race.
          </p>
          
          <p className="mb-8">
            Each day, one and only one <b>The Date</b> artwork will be available to be minted 
            as <a className="link" href={etherScanLinkOfToken}>a non-fungible token</a>, 
            through <Link href="/"><a className="link">an auction</a></Link> opening from 00:00:00 UTC to 23:59:59 UTC.
            The highest bidder will mint and own the artwork of that day. 
            If no bid is placed on that day, the artwork of that day would be never minted and absent forever.
          </p>

          <p className="mb-8">
            Additionally, the owner could optionally engrave a note (100 ASCII characters including spaces) 
            onto the artwork at no cost. 
            However, the owner has to pay 1 ether to erase the existing engraved note before a new one can be engraved.
          </p>

          <p className="mb-8">
            The values of every artworks of <b>The Date</b> would be determined by 
            <a href="http://opensea.io">free market</a>, unfolding over time. <br/>
          </p>

          <p className="mb-8 text-right"> 
            --- created by @abr and @sai
          </p>
        </article>
      </div>
    </Layout>
  );
}
