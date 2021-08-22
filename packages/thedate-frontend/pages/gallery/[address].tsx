import Gallery from "../../components/Gallery";
import { useRouter } from 'next/router'
import Layout from "../../components/Layout";

export default function GalleryPage() {
  const router = useRouter()
  const { address } = router.query

  return (
    <Layout>
      <Gallery owner={address} />
    </Layout>
  );
}
