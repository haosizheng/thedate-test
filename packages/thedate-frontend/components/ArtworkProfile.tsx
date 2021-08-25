import ArtworkImageViewer from "./ArtworkImageViewer";
import ArtworkCatalogue from "./ArtworkCatalogue";
import ArtworkModelViewer from "./ArtworkModelViewer";
import useTheDateArtwork from "@/hooks/useTheDateArtwork";
import ArtworkHistory from "./ArtworkHistory";

export default function ArtworkProfile({tokenId}: {tokenId: number}) {
  const {exists, noteString} = useTheDateArtwork(tokenId);

  return (<>
    { exists !== undefined && (
      !exists ? 
        <div className="hero">
          <div className="hero-content">
            Artwork {tokenId} does not exists.
          </div>
        </div>
      : 
        <>
          <div className="hero">
            <div className="hero-content h-full w-screen">
              <ArtworkModelViewer tokenId={tokenId} noteString={noteString} />
            </div>
          </div>
          <div className="hero">
            <div className="hero-content">
              <div className="text-sm">
                <ArtworkCatalogue tokenId={tokenId} editable />
              </div>
            </div>
          </div>
          <div className="hero">
            <div className="hero-content">
              <div className="text-sm">
                <ArtworkHistory tokenId={tokenId} />
              </div>
            </div>
          </div>
        </>
    )}
    </>
  );
}


