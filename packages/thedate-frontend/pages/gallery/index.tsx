import Gallery from "@/components/Gallery";
import Layout from "@/components/Layout";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";

export default function GalleryPage() {
  const { library, chainId, account, active } = useActiveWeb3React();

  return (
      <Layout>
       { account ? 
        <Gallery owner={account} /> 
        : 
        <div className="content text-center"><p>Connect your Metamask below to view your gallery.</p></div> }
      </Layout>
  );
}

