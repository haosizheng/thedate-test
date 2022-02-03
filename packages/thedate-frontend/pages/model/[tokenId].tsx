import ArtworkModelViewer from "@/components/ArtworkModelViewer";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { useState } from "react";
import { useAsync } from "react-use";

export default function ArtworkRenderingPage() {
  const router = useRouter();
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();

  const { tokenId : tokenIdQuery } = router.query;
  const tokenId = typeof tokenIdQuery === "string" ? Number(tokenIdQuery) : undefined;
  const [ exists, setExists ] = useState<boolean | undefined>(undefined);
  const [ noteString, setNoteString ] = useState<string | undefined>(undefined);

  useAsync(async () => {
    if (!TheDate || tokenId === undefined) {
      return; 
    }
    setExists((await TheDate?.exists(tokenId)));
    setNoteString((await TheDate?.getNote(tokenId)));
  }, [TheDate, tokenId]);

  if (tokenId === undefined || exists === undefined ) {
    return (
      <Layout>
        <div className="static absolute inset-0 bg-neutral font-mono text-center">Loading...</div>
      </Layout>
    );
  } else if (!exists) {
    return (
      <Layout>
        <div className="static absolute inset-0 bg-neutral font-mono text-center">Error - Token ID does not exist.</div>
      </Layout>
    )
  } else {
    return (
      <>
        <div className="static absolute inset-0 bg-neutral font-mono">
          <ArtworkModelViewer tokenId={ tokenId! } noteString={noteString} autoRotate={ true } fov={ 35 } />
        </div>
      </>
    );
  }
}
