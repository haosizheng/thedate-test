import Head from 'next/head';
import { PROJECT_INFO } from "@/utils/constants";

export default function Meta() {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="theme-color" content="#000000"/>
      <meta name="title" content={PROJECT_INFO.name}/>
      <meta name="description" content={PROJECT_INFO.description}/>

      <meta property="og:url" content={PROJECT_INFO.website_url}/>
      <meta property="og:title" content={PROJECT_INFO.name}/>
      <meta property="og:description" content={PROJECT_INFO.description}/>
      <meta property="og:type" content="website"/>
      
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:site" content={PROJECT_INFO.twitter_account}/>
      <meta name="twitter:title" content={PROJECT_INFO.name} />
      <meta name="twitter:description" content={PROJECT_INFO.website_url} />

      <title>{PROJECT_INFO.name}</title>
    </Head>
  );
}
