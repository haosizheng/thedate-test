import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Meta from '@/components/Meta';

export default function Layout({children}: {children: JSX.Element}) {
  return (
    <main className="min-h-screen">
      <Meta />
      <Header />
      {children}
      <Footer />
    </main>
  );
}
