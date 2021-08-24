import ArtworkImageViewer from "./ArtworkImageViewer";
import ArtworkCatalogue from "./ArtworkCatalogue";
import ArtworkModelViewer from "./ArtworkModelViewer";
import useTheDateArtwork from "@/hooks/useTheDateArtwork";
import { tokenIdToDateString } from "@/utils/thedate";

export default function ArtworkProfile({tokenId}: {tokenId: number}) {
  const {exists, owner, dateString, noteString, engraveNote, eraseNote} = useTheDateArtwork(tokenId);

  return (
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
      </>
  );
}
