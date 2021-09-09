import Image from 'next/image';

export default function ArtworkImageViewer({ tokenId }: {tokenId: number}) {
  return (
    <>
      {/* <Image src={`/api/renders/${tokenId}`} alt="artwork" /> */}
      <iframe className="w-full h-full" src={`/render/${tokenId}`} frameBorder={0} />
      {/* <Image src="/placeholder.png" alt="placeholder" width="350" height="350" /> */}
    </>
  );
}
