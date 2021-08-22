import Link from "next/link";

export default function Header() {
  return (
    <header className="hero py-20">
      <div className="hero-content text-center">
        <span className="text-sm">
          <Link href="/"><a className=""><b>The Date</b></a></Link>
        </span>
      </div> 
    </header>
  );
}