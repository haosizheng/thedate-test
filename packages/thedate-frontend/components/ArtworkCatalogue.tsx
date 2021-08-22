

export default function ArtworkProfile(tokenId: number) {
  const { library, chainId } = useWeb3React<Web3Provider>();
  const TheDate = useTheDateContract();  
  const { data: etherPrice } = useEtherPrice();
  
  const [ tokenId, setTokenId ] = useState<number>(0);
  const [ bidHistory, setBidHistory ] = useState<BidHistoryItem[]>([]);
  const rendersCount = useRendersCount();

  return (
    <div>
      <p>Note: {artwork.note}</p>
      <p>Owner: {artwork.owner}</p>
      <p>Last Price: {artwork.price}</p>
    </div>
  );
}
