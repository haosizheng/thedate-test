import type { NextApiRequest, NextApiResponse } from 'next'
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer";
import { create, globSource } from "ipfs-http-client";

export default async function render(req: NextApiRequest, res: NextApiResponse) {
  let {
    query: { tokenId }
  } = req

  if (!tokenId) 
    return res.status(400).end(`No model provided`)

  let browser

  // if (process.env.NODE_ENV === 'production') {
    // browser = await puppeteer.launch({
    //   args: chrome.args,
    //   defaultViewport: chrome.defaultViewport,
    //   executablePath: await chrome.executablePath,
    //   headless: true,
    //   ignoreHTTPSErrors: true
    // })
  // } else {
  //   browser = await puppeteer.launch({
  //     headless: true
  //   })
  // }

  browser = await puppeteer.launch({
    headless: true
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 512, height: 512 })
  await page.goto(`${process.env.NEXT_PUBLIC_BASE_URL}/render/${tokenId}`)
  await page.waitForFunction('window.status === "ready"')

  const data = await page.screenshot({
    type: 'png'
  })

  await browser.close()
  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  // Write the image to the response with the specified Content-Type
  res.end(data)
}
