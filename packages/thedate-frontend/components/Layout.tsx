import AppProviders from "@/components/AppProviders";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Meta from '@/components/Meta';

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
