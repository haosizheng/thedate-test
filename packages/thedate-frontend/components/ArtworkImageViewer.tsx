import Image from 'next/image';

export interface ArtworkImageViewerProps {
  tokenId: number;
}

export default function ArtworkImageViewer({ tokenId }: ArtworkImageViewerProps) {
  return (
    <div>
      {/* <Image src={`/api/renders/${tokenId}`} alt="artwork" /> */}
      <Image src="/placeholder.png" alt="placeholder" width="350" height="350" />
    </div>
  );
}
