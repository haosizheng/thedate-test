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
    return {exists, owner, dateString, noteString, auctionEnded, highestBidder, highestBid};
  }, [dateString, exists, noteString, owner, auctionEnded, highestBidder, highestBid]);
}
