import Link from "next/link";

export default function Header() {
  return (
    <header className="hero py-20">
      <div className="hero-content text-center">
        <span className="font-mono text-xl text-gray-800">
          <Link href="/"><a className=""><b>THE DATE</b></a></Link>
        </span>
      </div> 
    </header>
  );
}