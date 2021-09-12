import ArtworkModelViewer from "@/components/ArtworkModelViewer";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import useTheDateArtwork from "@/hooks/useTheDateArtwork";

export default function ArtworkRenderingPage() {
  const router = useRouter();
  const { tokenId: tokenIdQuery } = router.query;
  const tokenId = typeof tokenIdQuery === "string" ? Number(tokenIdQuery) : undefined;
  const { exists, noteString } = useTheDateArtwork(tokenId || 0);

  return (
    (exists === undefined) ?
      <div className="static absolute inset-0 bg-neutral font-serif">Loading...</div> 
    : !exists ?
      <div className="static absolute inset-0 bg-neutral font-serif">Token &quot;{tokenIdQuery}&quot; does not exists</div>
    : <>
      <div className="static absolute inset-0 bg-neutral font-mono">
        <ArtworkModelViewer tokenId={ tokenId! } noteString={noteString} autoRotate={ true } fov={ 35 } />
      </div>
    </>
  );
}
