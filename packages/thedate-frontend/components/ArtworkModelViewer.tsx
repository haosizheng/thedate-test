import React, { useEffect, useState, Suspense } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

import { ImageLoader, Vector2 } from 'three'
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader'

function CreateCanvasTexture(date: string, note: string = "", backgroundColor: string, 
  textColor: string, useRoughness: boolean = false) 
{
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d')!;

  canvas.width = 4096;
  canvas.height = 4096;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.textAlign = 'center';
  ctx.fill();

  const img1 = useLoader(ImageLoader, '/noise-medium3.png');

  if (useRoughness) {
    ctx.drawImage(img1, 0, 0, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(img1, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(img1, 0, canvas.height / 2, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(img1, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
  }

  ctx.fillStyle = textColor;
  ctx.font = 160 + 'px Roboto mono';
  ctx.fillText(date, 1800, 1840)

  ctx.font = 54 + 'px Roboto mono';
  ctx.fillText(note, 1800, 3960);

  ctx.font = 54 + 'px Roboto mono';
  ctx.fillText('THE DATE', 1800, 2440);

  const texture = new THREE.CanvasTexture(canvas);

  return texture;
}

interface ArtworkProps {
  date: string;
  note: string;
}


function Artwork(props: ArtworkProps) {

  const glft: any = useGLTF("/cube.glb");

  let messageDate = props.date;
  let messageNote = props.note;

  var colorMap = CreateCanvasTexture(messageDate, messageNote, '#ffffff', '#D1D1D1')
  var roughnessMap = CreateCanvasTexture(messageDate, messageNote, '#ffffff', '#000000', true)
  var metalnessMap = CreateCanvasTexture(messageDate, messageNote, '#ffffff', '#D1D1D1')

  const materialProps = {
    clearcoat: 0.1,
    clearcoatRoughness: 0.3,
    metalness: 0.5,
    roughness: 0.4,
    color: 'white',
    map: colorMap,
    metalMap: metalnessMap,
    roughnessMap: roughnessMap,
    normalMap: roughnessMap,
    normalScale: new Vector2(0.3, 0.3),
    'normalMap-wrapS': THREE.RepeatWrapping,
    'normalMap-wrapT': THREE.RepeatWrapping,
    'normalMap-repeat': [100, 100],
    'normalMap-anisotropy': 16,
    transmission: 0.6,
    transparent: false
  }

  return (
    <group {...props}>
      <mesh geometry={glft.nodes.Cube.geometry} scale={[1, 1, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial {...materialProps} side={THREE.FrontSide} />
      </mesh>
    </group>
  )
}

function Environment({ background = false }) {
  const { gl, scene } = useThree()

  const [cubeMap] = useLoader(HDRCubeTextureLoader, 
    [['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr']], (loader) => {
    console.log('loader', loader)
    loader.setPath('/pisaHDR/')
    loader.setDataType(THREE.UnsignedByteType)
  })

  useEffect(() => {
    const gen = new THREE.PMREMGenerator(gl)
    gen.compileEquirectangularShader()
    const hdrCubeRenderTarget = gen.fromCubemap(cubeMap)
    cubeMap.dispose()
    gen.dispose()
    if (background) {
      scene.background = hdrCubeRenderTarget.texture;
    }
    scene.environment = hdrCubeRenderTarget.texture;
    return () => {
      scene.environment = scene.background = null;
    };
  }, [cubeMap])

  return null
}

interface ArtworkModelViewerProps {
  tokenId: number;
}

export default function ArtworkModelViewer({tokenId}: ArtworkModelViewerProps) {
  const [ready, set] = useState(false)

  return (
    <Canvas id="myCanvas" dpr={[1, 2]} shadows camera={{ position: [5, 1, 8], fov: 50 }}>
      <ambientLight intensity={0.6} />

      <directionalLight position={[2.5, 3, 3]} intensity={0.5} />

      <directionalLight position={[1, 16, 2]} intensity={0.2} />

      <directionalLight position={[15, 20, 15]} intensity={0.2} />

      <directionalLight position={[15, -20, 15]} intensity={0.2} />

      <directionalLight position={[-1, 10, -2]} intensity={0.1} />

      <Suspense fallback={<Html>Loading..</Html>}>
        <Environment />
        <Artwork date={'MAR 13 2021'} note={'The owner can engrave a unique note here'} />
      </Suspense>
      <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI/2 - Math.PI/10} 
        maxPolarAngle={Math.PI/2} />
    </Canvas>
  )
}
