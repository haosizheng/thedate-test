import { useState } from "react";
import { useAsync } from "react-use";
import useTheDateContract from "@/hooks/useTheDateContract";

export default function ArtworkSVGOnChain({ tokenId }: { tokenId: number }) {
  const TheDate = useTheDateContract();
  const [svgImage, setSVGImage] = useState<string | undefined>(undefined);
  
  useAsync(async () => {
    if (!TheDate) {
      return; 
    }
    setSVGImage(await TheDate?.generateSVGImage(tokenId));
  }, [TheDate]);

  return (
    <div dangerouslySetInnerHTML={{__html: svgImage ? svgImage : ""}}/>
  );
}
