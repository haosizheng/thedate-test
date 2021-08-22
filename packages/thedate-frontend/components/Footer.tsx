import Link from 'next/link';
import Wallet from './Wallet';

export default function Footer() {
  return (
    <footer className="hero py-20">
       <div className="hero-content text-xs text-center">
        <ul>
          <li><Wallet/></li>
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
