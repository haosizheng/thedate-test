import Link from "next/link";
import { PROJECT_INFO } from "@/utils/constants";
import Wallet from "@/components/Wallet";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer__row">
        <Wallet/>
      </div>    
      <div className="footer__row">
        <Link href="/faq"><a>FAQ</a></Link>
        <Link href="/claim"><a>Claim</a></Link>
        <Link href="/auction"><a>Auction</a></Link>
        <Link href="/updates"><a>Updates</a></Link>
      </div> 
      <div className="footer__row">
        <a href={PROJECT_INFO.etherscan_url}>Contract</a> 
        <a href={PROJECT_INFO.opensea_url}>OpenSea</a> 
        <a href={PROJECT_INFO.discord_url}>Discord</a> 
        <a href={PROJECT_INFO.twitter_url}>Twitter</a>
        <a href={PROJECT_INFO.snapshot_url}>DAO</a> 
      </div> 
    </div>
  );
}
