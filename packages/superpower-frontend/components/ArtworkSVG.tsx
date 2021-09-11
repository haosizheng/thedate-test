import { useState } from "react";
import { useAsync } from "react-use";
import useSuperpowerContract from "@/hooks/useSuperpowerContract";

export default function ArtworkSVG({ tokenId }: { tokenId: number }) {
  const Superpower = useSuperpowerContract();
  const [svgImage, setSVGImage] = useState<string | undefined>(undefined);
  
  useAsync(async () => {
    if (!Superpower) {
      return; 
    }
    setSVGImage(await Superpower?.generateSVGImage(tokenId));
  }, [Superpower]);

  return (
    <div dangerouslySetInnerHTML={{__html: svgImage ? svgImage : ""}}/>
  );
}
