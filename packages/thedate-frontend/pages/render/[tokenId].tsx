import ArtworkModelViewer from "@/components/ArtworkModelViewer";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Meta from "@/components/Meta";

export default function ArtworkRenderingPage() {
  const router = useRouter()
  const { tokenId: tokenIdQuery } = router.query
  const tokenId = typeof tokenIdQuery === "string" ? Number(tokenIdQuery) : undefined;

  if (!tokenId || !Number.isInteger(tokenId)) {
    return (
      <Layout>
        <div className="hero">Error - Wrong token ID</div>
      </Layout>
    );
  }

  return (
    <>
      <div className="static absolute inset-0	h-96 w-96 bg-neutral">
        <ArtworkModelViewer tokenId={ tokenId } autoRotate={ false } fov={ 40 } />
      </div>
    </>
  );
}
