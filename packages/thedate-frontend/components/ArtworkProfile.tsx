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
            <div className="flex items-center max-h-80 h-80 md:h-160 md:max-h-160 w-screen md:-mt-24">
              <ArtworkModelViewer tokenId={tokenId} noteString={noteString} fov={30} />
            </div>
          </div>
          <div className="hero py-10">
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


