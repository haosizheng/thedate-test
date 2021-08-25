import type { NextApiRequest, NextApiResponse } from 'next'
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer";
import {create, urlSource } from "ipfs-http-client";
import { constants } from 'buffer';

export default async function render(req: NextApiRequest, res: NextApiResponse) {
  const { query: { tokenId } } = req

  if (!tokenId) {
    return res.status(400).end(`Wrong tokenId`)
  }

  let browser

  // if (process.env.NODE_ENV === 'production') {
  //   browser = await puppeteer.launch({
  //     args: chrome.args,
  //     defaultViewport: chrome.defaultViewport,
  //     executablePath: await chrome.executablePath,
  //     headless: chrome.headless,
  //     ignoreHTTPSErrors: true
  //   })
  // } else {
  //   browser = await puppeteer.launch({
  //     headless: true
  //   })
  // }

  browser = await puppeteer.launch({
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true
  })
  
  browser = await puppeteer.launch({
        headless: true
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 2 })
  await page.goto(`${process.env.NEXT_PUBLIC_BASE_URL}/render/${tokenId}`)
//  await page.waitForFunction('window.status === "ready"')
  await page.waitFor(5000);

  const data = await page.screenshot({
    quality: 100,
    type: 'jpeg'
  })

  await browser.close()

  const node = create({url: "https://ipfs.infura.io:5001"});
  const imgResult = await node.add(data as Buffer);
  await node.pin.add(imgResult.path);

  node.files.mkdir

  // const imgUrl = `https://ipfs.io/ipfs/${imgResult.path}`;
  // console.log(`imageUrl: ${imgUrl}`);

  // const metadata = {
  //   name: "The Date",
  //   description: `${tokenId} is The Date`,
  //   image: imgUrl,
  // };

  // const metadataResult = await node.add(JSON.stringify(metadata));
  // const metadataUrl = `https://ipfs.io/ipfs/${metadataResult.path}`;
  // console.log(`metadataUrl: ${metadataUrl}`);

  // await node.pin.add(metadataResult.path);

  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate')
  res.setHeader('Content-Type', 'image/png')
  // Write the image to the response with the specified Content-Type
  res.end(data)
}
