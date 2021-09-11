import Link from "next/link";
import { PROJECT_INFO } from "@/utils/constants";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer__row">
        <a href={PROJECT_INFO.etherscan_url}>Contract</a> 
        <a href={PROJECT_INFO.opensea_url}>OpenSea</a> 
        <a href={PROJECT_INFO.discord_url}>Discord</a> 
        <a href={PROJECT_INFO.twitter_url}>Twitter</a>
      </div> 
    </div>
  );
}
