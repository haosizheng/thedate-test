
import useActiveWeb3React from "./useActiveWeb3React";
import useTheDateContract from "./useTheDateContract";
import { useMemo, useState } from "react";
import { useAsync } from "react-use";  
import { SECONDS_IN_A_DAY, tokenIdToDateString } from "@/utils/thedate";
import { BigNumber, ethers } from "ethers";  
import useBlockNumber from "./useBlockNumber";

export default function useTheDateArtwork(tokenId: number) {
  const { library, chainId, account } = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [owner, setOwner] = useState<string>(null!);
  const [dateString, setDateString] = useState<string>(null!);
  const [noteString, setNoteString] = useState<string>(null!);
  const [exists, setExists] = useState<boolean>(false);
  const [highestBidder, setHighestBidder] = useState<string>(null!);
  const [highestBid, setHighestBid] = useState<BigNumber>(null!);
  const [auctionEnded, setAuctionEnded] = useState<boolean>(null!);

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
    const artwork_ = await TheDate.artworks(tokenId);
    
    const { bidder: bidder_, amount: amount_ } = await TheDate.getHighestBid(tokenId);

    setHighestBidder(bidder_);
    setHighestBid(amount_);
    setDateString(tokenIdToDateString(artwork_.date.toNumber()));
    setNoteString(artwork_.note);

    if (owner_ && owner_ !== ethers.constants.AddressZero) {
      setExists(true);
    } else {
      setExists(false);
    }
    
    const blockTimestamp = (await library.getBlock(library.blockNumber)).timestamp;

    setAuctionEnded(blockTimestamp > (tokenId + 1) * SECONDS_IN_A_DAY);

  }, [library, chainId, TheDate]);

  return useMemo(() => ({exists, tokenId, owner, dateString, noteString, auctionEnded,
    highestBidder, highestBid, engraveNote, eraseNote, claimArtwork}), 
    [dateString, exists, noteString, owner, auctionEnded, highestBidder, highestBid, tokenId]);
}
