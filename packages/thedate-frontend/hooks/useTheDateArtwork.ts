import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useTheDateContract from "@/hooks/useTheDateContract";
import { SECONDS_IN_A_DAY, tokenIdToDateString } from "@/utils/thedate";
import { BigNumber, ethers } from "ethers";
import { useMemo, useState } from "react";
import { useAsync } from "react-use";

export default function useTheDateArtwork(tokenId: number) {
  const { library, chainId, account } = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [owner, setOwner] = useState<string | undefined>(undefined);
  const [dateString, setDateString] = useState<string | undefined>(undefined);
  const [noteString, setNoteString] = useState<string | undefined>(undefined);
  const [exists, setExists] = useState<boolean | undefined>(undefined);
  const [highestBidder, setHighestBidder] = useState<string | undefined>(undefined);
  const [highestBid, setHighestBid] = useState<BigNumber | undefined>(undefined);
  const [auctionEnded, setAuctionEnded] = useState<boolean | undefined>(undefined);

  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    try { 
      const exists_ = await TheDate.exists(tokenId);
      setExists(exists_);

      if (!exists_) {
        return;
      }

      const owner_ = await TheDate.ownerOf(tokenId);
      setOwner(owner_);

      const note_ = await TheDate.getNote(tokenId);
      const { bidder: bidder_, amount: amount_ } = await TheDate.getHighestBid(tokenId);

      setHighestBidder(bidder_);
      setHighestBid(amount_);
      setDateString(tokenIdToDateString(tokenId));
      setNoteString(note_);

      if (!!owner_ && owner_ !== ethers.constants.AddressZero) {
        setExists(true);
      } else {
        setExists(false);
      }
      
      const blockTimestamp = (await library.getBlock(library.blockNumber)).timestamp;
      setAuctionEnded(blockTimestamp > (tokenId + 1) * SECONDS_IN_A_DAY);

    } catch (error) {
      return;
    }
  }, [library, chainId, TheDate]);

  return useMemo(() => {
    const engraveNote = async (newNoteString: string) => {
      if (!library || !TheDate || !account || !owner || owner !== account || !exists 
        || noteString === undefined || noteString.length > 0 
        || newNoteString.length == 0  || newNoteString.length > 100) {
        return;
      }
      await TheDate?.engraveNote(tokenId, newNoteString);
    };
  
    const eraseNote = async () => {
      if (!library || !TheDate || !account || !exists || !owner || owner !== account 
        || noteString == undefined || noteString.length == 0 ) {
        return;
      }
      await TheDate?.eraseNote(tokenId, { value: ethers.utils.parseEther("1") });
    };
  
    const claimArtwork = async () => {
      if (!library || !TheDate || !account || !exists  || !owner || owner !== TheDate.address) {
        return;
      }
      await TheDate?.settleLastAuction();
    };

    return {exists, owner, dateString, noteString, auctionEnded, highestBidder, highestBid, 
      engraveNote, eraseNote, claimArtwork};
  }, 
  [dateString, exists, noteString, owner, auctionEnded, highestBidder, highestBid, TheDate, account, library, tokenId]);
}
