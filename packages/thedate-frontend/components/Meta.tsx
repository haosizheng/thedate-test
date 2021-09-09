import Head from 'next/head';

export default function Meta() {
  const description = "The Date is a metadata-based NFT art experiment about time and blockchain. ";
  const name = "The Date";
  const url = "https://thedate.art/";

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="theme-color" content="#000000"/>
      <meta name="title" content={name}/>
      <meta name="description" content={description}/>

      <meta property="og:url" content={url}/>
      <meta property="og:title" content={name}/>
      <meta property="og:description" content={description}/>
      <meta property="og:type" content="website"/>
      
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:site" content="@thedate_art"/>
      <meta name="twitter:title" content={name} />
      <meta name="twitter:image" content={url} />
      <meta name="twitter:description" content={url} />

      <title>The Date</title>
    </Head>
  );
}
