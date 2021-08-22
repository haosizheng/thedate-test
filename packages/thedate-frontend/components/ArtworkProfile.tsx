import Link from 'next/link';
import ArtworkImageViewer from "./ArtworkImageViewer";
import ArtworkCatalogue from "./ArtworkCatalogue";
import ArtworkModelViewer from "./ArtworkModelViewer";

interface ArtworkProfileProps {
  tokenId: number;
}

export default function ArtworkProfile({tokenId}: ArtworkProfileProps) {
  return (
    <>
      <div className="hero -mt-20">
        <div className="hero-content h-screen w-screen">
            <ArtworkModelViewer tokenId={tokenId} />
        </div>
      </div>
      <div className="hero">
        <div className="hero-content">
          <div className="text-xs">
            <ArtworkCatalogue tokenId={tokenId} />
          </div>
        </div>
    </div>
   </>
  );
}
