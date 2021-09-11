import Layout from "@/components/Layout";
import ArtworkSVGOnChain from "@/components/ArtworkSVGOnChain";
import { PROJECT_INFO } from "@/utils/constants";
import useSuperpowerContract from "@/hooks/useSuperpowerContract";
import { useState } from "react";
import { useAsync } from "react-use";
import { BigNumber, ethers } from "ethers";

export default function HomePage() {
  const Superpower = useSuperpowerContract();
  const [claimingPrice, setClaimingPrice] = useState<BigNumber | undefined>(undefined);
  const [totalSupply, setTotalSupply] = useState<BigNumber | undefined>(undefined);

  useAsync(async () => {
    if (!Superpower) {
      return; 
    }
    setClaimingPrice(await Superpower?.getCurrentClaimingPrice());
    setTotalSupply(await Superpower?.totalSupply());
  }, [Superpower]);

  return (
    <Layout>
        <div className="content">
          <figure>
            <a href="">
              <ArtworkSVGOnChain tokenId={1} />
            </a>
          </figure>

          <div className="faq__item">
            <h3>What’s Superpower?</h3>
            <p>
                Surperpower is a metadata-based NFT art for metaverse, which contains 11111 unique sets of superpowers generated randomly. 
                Anyone can use the metadata from Superpower to create games, arts, and experiences for metaverse.
            </p>
          </div>

          <div className="faq__item">
            <h3>How can I get a set of Superpower? </h3>

            <p>
              There are only 11111 sets of Superpower. 
            </p>

            <p>
              The first 1111 claims are free. 
              Then the price will follow the stairstep rules, in which for every 1111 claims, 
              the price will raise up by Ξ0.01. The last claim will cost Ξ0.1.
            </p>

            <p>
              You could claim the Superpower via <a href={`${PROJECT_INFO.etherscan_url}#writeContract`}>the contract</a>.  
            </p>

            {claimingPrice !== undefined && totalSupply !== undefined && 
              <p> 
                Current price:  Ξ{ethers.utils.formatEther(claimingPrice)} (total of {totalSupply.toString()} Superpowers were claimed)
              </p>
            }
            
            <p>
              You can also trade claimed Superpower on <a href={`${PROJECT_INFO.opensea_url}`}>OpenSea</a>.
            </p>
          </div>
        </div>
    </Layout>
  );
}
