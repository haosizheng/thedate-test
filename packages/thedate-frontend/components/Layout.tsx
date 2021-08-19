import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'

export interface LayoutProps  { 
  children: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Meta />
      <main className="min-h-screen bg-neutral text-neutral-content">
        <Header />
        {props.children}
        <Footer />
      </main>
    </>
  )
}
