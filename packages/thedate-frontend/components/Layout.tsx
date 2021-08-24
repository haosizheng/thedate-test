import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'
import AppProviders from "./AppProviders";

export default function Layout({children}: {children: JSX.Element}) {
  return (
    <AppProviders>
      <main className="min-h-screen bg-neutral text-neutral-content">
        <Meta />
        <Header />
        {children}
        <Footer />
      </main>
    </AppProviders>
  );
}
