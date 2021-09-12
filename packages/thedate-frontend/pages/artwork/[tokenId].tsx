import Layout from "@/components/Layout";
import Link from "next/link";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import ArtworkSVGOnChain from "@/components/ArtworkSVGOnChain";
import { tokenIdToISODateString, jsDateToDate } from "@/utils/thedate";
import ArtworkModelViewer from "@/components/ArtworkModelViewer";
import { useState } from "react";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import ArtworkCatalogue from "@/components/ArtworkCatalogue";
import ArtworkHistory from "@/components/ArtworkHistory";
import useTheDateArtwork from "@/hooks/useTheDateArtwork";

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
            <ArtworkSVGOnChain tokenId={tokenId} />
          </figure>
          {/* <div className="content-item">
            <ArtworkCatalogue tokenId={tokenId} editable />
          </div>
          <div className="content-item">
            <ArtworkHistory tokenId={tokenId} />
          </div> */}
        </div>
      </Layout>
    );
  }
}
