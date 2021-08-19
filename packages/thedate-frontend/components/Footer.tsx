import Link from 'next/link';
import Account from './Account';
import useEagerConnect from '../hooks/useEagerConnect';
import ETHBalance from './ETHBalance';

export default function Footer() {
  const triedToEagerConnect = useEagerConnect()

  return (
    <div className="hero ">
       <div className="text-sm text-center content-center py-28">
        <div className="py-10">
          <p className="link">
            <Account triedToEagerConnect={triedToEagerConnect} />
          </p>
          <p><ETHBalance /></p>
        </div>
        <ul className="">
          <li><Link href="/"><a className="link">Home</a></Link></li>
          <li><Link href="/whitepaper"><a className="link">Whitepaper</a></Link></li>
          <li><Link href="/gallery"><a className="link">Gallery</a></Link></li>
          <li><Link href="https://twitter.com/thedate-art"><a className="link">Twitter</a></Link></li>
          <li><Link href="https://discord.gg/thedate-art"><a className="link">Discord</a></Link></li>
        </ul>
      </div> 
    </div>
  );
}
