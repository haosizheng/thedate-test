import Link from "next/link";
import { PROJECT_INFO } from "@/utils/constants";

export default function Header() {
  return (
    <header className="header">
      <div>
        <h1> 
          <Link href="/">
          <a className="">{PROJECT_INFO.name}</a>
          </Link>
        </h1>
      </div> 
    </header>
  );
}