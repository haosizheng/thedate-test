import Gallery from "../../components/Gallery";
import Layout from "../../components/Layout";
import { useRouter } from 'next/router'

export default function GalleryPage() {
  return (
      <Layout>
        <Gallery owner={undefined} />
      </Layout>
  );
}

