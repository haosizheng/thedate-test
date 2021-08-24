import Image from 'next/image';

export default function ArtworkImageViewer({ tokenId }: {tokenId: number}) {
  return (
    <div>
      {/* <Image src={`/api/renders/${tokenId}`} alt="artwork" /> */}
      <Image src="/placeholder.png" alt="placeholder" width="350" height="350" />
    </div>
  );
}
