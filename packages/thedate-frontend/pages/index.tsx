import { verifyMessage } from "@ethersproject/wallet";
import { useWeb3React } from "@web3-react/core";
import Auction from "../components/Auction";
import Layout from "../components/Layout";

function Home() {
  return (
    <Layout>
      <Auction />
    </Layout>
  );
}

export default Home;