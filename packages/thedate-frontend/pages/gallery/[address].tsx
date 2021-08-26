import Gallery from "@/components/Gallery";
import Layout from "@/components/Layout";
import { ethers } from "ethers";
import { useRouter } from 'next/router';

export default function GalleryPage() {
  const router = useRouter()
  const { address: addressQuery } = router.query
  const address = typeof(addressQuery) === "string" && ethers.utils.isAddress(addressQuery) ? addressQuery : undefined;

  if (!address) {
    return (
      <Layout>
        <div className="hero">Error - Wrong Address</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Gallery owner={address} />
    </Layout>
  );
}
