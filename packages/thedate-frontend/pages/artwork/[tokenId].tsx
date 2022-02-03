import Layout from "@/components/Layout";
import { formatOpenSeaLink } from "@/utils/ethers";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import ArtworkSVGOnChain from "@/components/ArtworkSVGOnChain";
import { useState } from "react";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import ArtworkCatalogue from "@/components/ArtworkCatalogue";
import { PROJECT_INFO } from "@/utils/constants";

export default function ArtworkPage() {
  const router = useRouter();
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();

  const { tokenId : tokenIdQuery } = router.query;
  const tokenId = typeof tokenIdQuery === "string" ? Number(tokenIdQuery) : undefined;
  const [ exists, setExists ] = useState<boolean | undefined>(undefined);

  useAsync(async () => {
    if (!TheDate || tokenId === undefined) {
      return; 
    }
    setExists((await TheDate?.exists(tokenId)));
  }, [TheDate, tokenId]);

  if (tokenId === undefined || exists === undefined ) {
    return (
      <Layout>
        <div className="content text-center">Loading...</div>
      </Layout>
    );
  } else if (!exists) {
    return (
      <Layout>
        <div className="content text-center">Error - Token ID does not exist.</div>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <div className="content">
          <figure>
            <a target="_blank" rel="noreferrer" href={formatOpenSeaLink("Asset", chainId, 
                        PROJECT_INFO.contract_address, tokenId)}>
              <ArtworkSVGOnChain tokenId={tokenId} />
            </a>
          </figure>
          <div className="content-item text-left max-w-md mx-auto">
            <ArtworkCatalogue tokenId={tokenId} editable />
          </div>
          {/* <div className="content-item">
            <ArtworkHistory tokenId={tokenId} />
          </div> */}
        </div>
      </Layout>
    );
  }
}
