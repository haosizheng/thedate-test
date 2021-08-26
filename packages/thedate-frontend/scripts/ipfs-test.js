const ipfs = require("ipfs-http-client");
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");

//import {create, urlSource } from "ipfs-http-client";

const projectId = '1xFkx06kx4VbDal79dGArNXkZbB';
const projectSecret = '180a32d324578fba1a08312b10e05483';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const script = async () => {
  const  {create, urlSource }  = ipfs;
  const node = create({host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth
    }
  });

  // const node = create({host: '127.0.0.1',
  //   port: 5001,
  //   protocol: 'http'
  // });


  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  const tokenId = 3;

  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/model/${tokenId}`);
  await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 2 })
  await page.goto(`http://localhost:3000/model/${tokenId}`, 
    {timeout: 10000, waitUntil:'networkidle2'})
  // await page.waitForSelector('#model');

  const imgData = await page.screenshot({
    type: 'png',
    path: '/tmp/a.png'
  })

  await browser.close();

  const id = await node.id();
  console.log(`node: ${id}`);

  const imgResult = await node.add(imgData);
  await node.pin.add(imgResult.path);
  console.log(`imgResult: ${imgResult.cid}`);
  console.log(`imgResult path: ${imgResult.path}`);

  const imgUrl = `https://ipfs.io/ipfs/${imgResult.path}`;
  console.log(`imageUrl: ${imgUrl}`);


  await node.files.mkdir('/thedate', { parents: true });
  await node.files.cp(`/ipfs/${imgResult.path}`, `/thedate/${tokenId}.png`);
  const folderResult = await node.files.stat("/thedate/");
  const nameResult = await node.name.publish(folderResult.cid);
  console.log(nameResult.name);

}

script().then();
