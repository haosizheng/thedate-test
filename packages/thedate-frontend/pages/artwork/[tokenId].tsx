import ArtworkProfile from "@/components/ArtworkProfile";
import Layout from "@/components/Layout";
import { useRouter } from 'next/router';

export default function ArtworkPage() {
  const router = useRouter()
  const { tokenId : tokenIdQuery } = router.query
  const tokenId = typeof tokenIdQuery === "string" ? Number(tokenIdQuery) : undefined;

  if (!tokenId || !Number.isInteger(tokenId)) {
    return (
      <Layout>
        <div className="hero">Error - Wrong Token ID</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ArtworkProfile tokenId={tokenId} />
    </Layout>
  );
}
