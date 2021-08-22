import ArtworkProfile from "../../components/ArtworkProfile";
import { useRouter } from 'next/router'
import Layout from "../../components/Layout";

export default function ArtworkPage() {
  const router = useRouter()
  const { tokenId } = router.query

  return (
    <Layout>
      {typeof(tokenId) === 'string' && 
      <ArtworkProfile tokenId={Number.parseInt(tokenId)} />}
    </Layout>
  );
}
