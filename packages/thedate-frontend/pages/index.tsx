import Layout from "@/components/Layout";
import ArtworkSVG from "@/components/ArtworkSVG";
import Link from "next/link";
import ArtworkSVGOnChain from "@/components/ArtworkSVGOnChain";
import { ISODateToTokenId } from "@/utils/thedate";
import { Swiper, SwiperSlide } from "swiper/react";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { formatOpenSeaLink } from "@/utils/ethers";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination"
import SwiperCore, {
  Pagination, Autoplay
} from 'swiper';
import { PROJECT_INFO } from "@/utils/constants";
SwiperCore.use([Pagination, Autoplay]);

export default function HomePage() {
  const TheDate = useTheDateContract();
  const {chainId} = useActiveWeb3React();

  const displayTokenDates = ["2001-09-11", "2021-08-27", "2013-12-06", "2009-01-03", "2020-01-26"];
  return (
    <Layout>
        <div className="content">
          <Swiper loop={true} autoplay={{delay: 3000}} pagination={{"clickable": true, "type": "custom"}}>
            {
              displayTokenDates.map((tokenDate) => 
                <SwiperSlide key={tokenDate}>
                  <figure className="swiper-slide">
                    <Link href={`/artwork/${ISODateToTokenId(tokenDate)}`}>
                      <a>
                        <ArtworkSVGOnChain tokenId={ISODateToTokenId(tokenDate)} />
                      </a>
                    </Link>
                  </figure>
                </SwiperSlide>
                )
            }
          </Swiper>

          <div className="flex flex-row justify-center gap-4 sm:gap-10 text-sm sm:text-lg">
            <Link href="/claim"><a className="hover:underline">Claim the Date of Past</a></Link>
            <Link href="/auction"><a className="hover:underline">Auction the Date of Today</a></Link>
          </div> 

          <div className="mt-16 sm:mt-20 mx-auto text-left max-w-lg">
            <p>
              The Date is an interactable on-chain metadata NFT project about time and meaning. 
            </p>
            <p>
              One Date a day. 
              Each fleeting day would be imprinted into an NFT as metadata immutably. 
              Owners can interact The Date with a note as additional metadata.
           </p>
           <p>
            As an interactable on-chain metadata NFT, it&apos;s the first of its kind.  For more detail, read <Link href="/faq"><a>FAQ</a></Link>.
           </p>
          </div>
        </div>
    </Layout>
  );
}
