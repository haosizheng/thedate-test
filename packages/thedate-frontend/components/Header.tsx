import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div>
        <h1> 
          <Link href="/">
          <a className="">The Date</a>
          </Link>
        </h1>
      </div> 
    </header>
  );
}