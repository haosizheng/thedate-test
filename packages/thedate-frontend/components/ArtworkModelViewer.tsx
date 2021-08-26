import { tokenIdToDateString } from "@/utils/thedate"
import { Html, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import React, { Suspense, useEffect, useState } from 'react'
import * as THREE from "three"
import { ImageLoader, Vector2 } from "three"
import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader"

// const loadFont = require("load-bmfont");
// const createTextGeometry = require("three-bmfont-text");
// const createMSDFShader = require("three-bmfont-text/shaders/msdf");
// const fontFile = require("load-bmfont/../assets/Lato-Black.fnt");
// const fontAtlas = require("../../assets/Lato-Black.png");

function CreateCanvasTexture(date: string, note: string = "", backgroundColor: string, 
  textColor: string, useRoughness: boolean = false) 
{
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d')!;

  canvas.width = 4096;
  canvas.height = 4096;
  ctx.imageSmoothingEnabled = true;
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.textAlign = 'center';
  ctx.fill();

  const noiseImg = useLoader(ImageLoader, '/noise-medium3.png');

  if (useRoughness) {
    ctx.drawImage(noiseImg, 0, 0, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(noiseImg, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(noiseImg, 0, canvas.height / 2, canvas.width / 2, canvas.height / 2);
    ctx.drawImage(noiseImg, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
  }

  ctx.fillStyle = textColor;
  ctx.font = 200 + 'px Roboto mono';
  ctx.fillText(date, 1800, 1840)

  ctx.font = 54 + 'px Roboto mono';
  ctx.fillText(note, 1800, 3960);

  ctx.font = 54 + 'px Roboto mono';
  ctx.fillText('THE DATE', 1800, 2440);

  const texture = new THREE.CanvasTexture(canvas);

  return texture;
}

function Artwork({dateString, noteString = ""}: {dateString: string, noteString?: string}) {
  const glft: any = useGLTF("/cube.glb");

  var colorMap = CreateCanvasTexture(dateString, noteString, '#ffffff', '#D1D1D1')
  var roughnessMap = CreateCanvasTexture(dateString, noteString, '#ffffff', '#000000', true)
  var metalnessMap = CreateCanvasTexture(dateString, noteString, '#ffffff', '#D1D1D1')

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
    <group>
      <mesh geometry={glft.nodes.Cube.geometry} scale={[1, 1, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial {...materialProps} side={THREE.FrontSide} />
      </mesh>
    </group>
  )
}

function Environment({ background = false }) {
  const { gl, scene } = useThree()

  // @ts-ignore
  const [cubeMap] = useLoader(HDRCubeTextureLoader, 
    [
      ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr']], (loader) => {
    loader.setPath('/pisaHDR/');
   // @ts-ignore
    loader.setDataType(THREE.UnsignedByteType);
  });

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

export default function ArtworkModelViewer({ tokenId, noteString = "", autoRotate = true, fov = 20}: 
  { tokenId: number, noteString?: string, autoRotate?: boolean, fov?: number }) {
  const [ready, set] = useState(false)

  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 0, 10], fov: fov }}  gl={{ antialias: true }} >
      <ambientLight intensity={0.6} />

      <directionalLight position={[2.5, 3, 3]} intensity={0.5} />

      <directionalLight position={[1, 16, 2]} intensity={0.2} />

      <directionalLight position={[15, 20, 15]} intensity={0.2} />

      <directionalLight position={[15, -20, 15]} intensity={0.2} />

      <directionalLight position={[-1, 10, -2]} intensity={0.1} />

      <Suspense fallback={<Html className="hero text-xs">Loading..</Html>}>
        <Environment />
        <Artwork dateString={tokenIdToDateString(tokenId)} 
          noteString={noteString ? noteString : ""} />
      </Suspense>

      <OrbitControls autoRotate={autoRotate} 
        enablePan={false} enableZoom={true} minDistance={8} maxDistance={10} minPolarAngle={Math.PI/2 - Math.PI/10} 
        maxPolarAngle={Math.PI/2 +  Math.PI/10} />
    </Canvas>
  )
}
