import Link from 'next/link';
import Wallet from "@/components/Wallet";
export default function Footer() {
  return (
    <footer className="hero py-20">
       <div className="hero-content text-sm text-center">
        <ul>
          <li className="mb-10"><Wallet/></li>
          <li><Link href="/about"><a className="link">About</a></Link></li>
          <li><Link href="/"><a className="link">Auction</a></Link></li>
          <li><Link href="/gallery"><a className="link">Gallery</a></Link></li>
          <li><Link href="https://twitter.com/thedate-art"><a className="link">Twitter</a></Link></li>
          <li><Link href="https://discord.gg/thedate-art"><a className="link">Discord</a></Link></li>
        </ul>
      </div> 
    </footer>
  );
}
