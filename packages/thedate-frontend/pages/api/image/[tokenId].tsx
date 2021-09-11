import type { NextApiRequest, NextApiResponse } from 'next'

export default async function upload(req: NextApiRequest, res: NextApiResponse) {

  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
  res.setHeader('Content-Type', 'image/svg+xml');
  // Write the image to the response with the specified Content-Type
}
