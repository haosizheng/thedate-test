
import useActiveWeb3React from "./useActiveWeb3React";
import useTheDateContract from "./useTheDateContract";
import { useMemo, useState } from "react";
import { useAsync } from "react-use";  
import { tokenIdToDateString } from "@/utils/thedate";
import { ethers } from "ethers";  

export default function useTheDateArtwork(tokenId: number) {
  const { library, chainId, account } = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [owner, setOwner] = useState<string>(null!);
  const [dateString, setDateString] = useState<string>(null!);
  const [noteString, setNoteString] = useState<string>(null!);
  const [exists, setExists] = useState<boolean>(false);

  const engraveNote = async (newNoteString: string) => {
    if (!library || !TheDate || !account || !owner || owner != account || !exists 
      || !noteString || noteString.length > 0 
      || !newNoteString || newNoteString.length > 100) {
      return;
    }
    if (newNoteString) {
      await TheDate?.engraveArtworkNote(tokenId, newNoteString);
    }
  };

  const eraseNote = async () => {
    if (!library || !TheDate || !account || !exists || !owner || owner != account) {
      return;
    }
    await TheDate?.eraseArtworkNote(tokenId, { value: ethers.utils.parseEther("1") });
  };

  const claimArtwork = async () => {
    if (!library || !TheDate || !account || !exists  || !owner || owner != TheDate.address) {
      return;
    }
    await TheDate?.endAuction(tokenId);
  };

  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    const owner_ = await TheDate.ownerOf(tokenId);

    setOwner(owner_);
    console.log(owner_);
    const artwork_ = await TheDate.artworks(tokenId);
    setDateString(tokenIdToDateString(artwork_.date.toNumber()));
    setNoteString(artwork_.note);
    if (owner_ && owner_ !== ethers.constants.AddressZero) {
      setExists(true);
    } else {
      setExists(false);
    }
  }, [library, chainId, TheDate]);

  return useMemo(() => ({exists, tokenId, owner, dateString, noteString, engraveNote, eraseNote}), 
    [dateString, exists, noteString, owner, tokenId]);
}
