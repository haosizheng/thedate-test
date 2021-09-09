import Link from "next/link";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer__row">
        <Link href="/"><a>Home</a></Link>
        <Link href="/faq"><a>FAQ</a></Link>
        <Link href="/auction"><a>Auction</a></Link>
        <Link href="/artwork"><a>Artwork</a></Link>
        <Link href="/artwork"><a>Updates</a></Link>
      </div> 
      <div className="footer__row">
        <a href="https://discord.gg/thedate-art">Contract</a> 
        <a href="https://discord.gg/thedate-art">OpenSea</a> 
        <a href="https://discord.gg/thedate-art">Discord</a> 
        <a href="https://discord.gg/twitter">Twitter</a>
        <a href="https://discord.gg/thedate-art">DAO</a> 
      </div> 
    </div>
  );
}
