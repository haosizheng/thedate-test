// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

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
  const { tokenId } = req.query;
  res.status(200).json({ 
    name: `${tokenId}`,
    description: 'The date is the cool project', 
    image: 'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb',
    animation_url: 'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb',
    external_url: 'http://'
  })
}
