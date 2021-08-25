import {create, urlSource } from "ipfs-http-client";

const script = async () => {
  const node = create({url: "https://ipfs.infura.io:5001"});

  const imgResult = await node.add(urlSource('https://ipfs.io/images/ipfs-logo.svg'));
  await node.pin.add(imgResult.path);

  const imgUrl = `https://ipfs.io/ipfs/${imgResult.path}`;
  console.log(`imageUrl: ${imgUrl}`);

  const metadata = {
    name: "The Date",
    description: `sdf is The Date`,
    image: imgUrl,
  };

  const metadataResult = await node.add(JSON.stringify(metadata));
  const metadataUrl = `https://ipfs.io/ipfs/${metadataResult.path}`;
  console.log(`metadataUrl: ${metadataUrl}`);
  node.name.publish
}

script().then();
