// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { tokenIdToDateString } from "@/utils/thedate";

type Data = {
  name: string,
  description: string,
  image: string,
  animation_url: string,
  external_url: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tokenIdString } = req.query;
  
  const tokenId = Number(tokenIdString);

  if (tokenId === undefined) {
    return res.status(400).end(`Wrong tokenId`)
  }
  
  res.status(200).json({ 
    name: `${tokenIdToDateString(tokenId)}`,
    description: 'The date is the cool project', 
    image: 'ipns://metadata.thedate.art/${tokenId}.png',
    animation_url: `https://thedate.art/model/${tokenId}`,
    external_url: `https://thedate.art/artwork/${tokenId}`
  })
}
