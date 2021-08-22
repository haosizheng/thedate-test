import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, softShadows, useCubeTexture } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import loadFont from 'load-bmfont';
// @ts-ignore
import createGeometry from 'three-bmfont-text';
// @ts-ignore
import MSDFShader from 'three-bmfont-text/shaders/msdf';

softShadows()

// function SaveImage() {
//   var canvas = document.getElementById('myCanvas')
//   var dataURL = canvas.toDataURL()
//   console.log(dataURL)
//   return dataURL
// }

function GroundPlane(props: any) {
  return (
    <mesh receiveShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry attach="geometry" args={[500, 500]} />
      <shadowMaterial attach="material" transparent color="gray" opacity={0.5} /> 
      {/* <meshStandardMaterial attach="material" color="white" /> */}
    </mesh>
  )
}

function createCanvasTexture(message1: string, size: number, y: number, 
  backgroundColor: string, textColor: string, message2: string = "") {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d')!;
  canvas.width = 2560;
  canvas.height = 1080;

  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = backgroundColor
  ctx.textAlign = 'center'
  ctx.fill()

  ctx.fillStyle = textColor
  ctx.font = size + 'px Roboto mono'
  ctx.fillText(message1, canvas.width / 2, y)

  if (message2 != null) {
    ctx.font = 90 + 'px Roboto mono'
    ctx.fillText(message2, canvas.width / 2, canvas.height / 2)
  }

  var texture = new THREE.CanvasTexture(canvas)
  return texture;
}

function Artwork(props: any) {
  // const envMap = useCubeTexture(
  //   ['graycloud_ft.jpg', 'graycloud_bk.jpg', 'graycloud_up.jpg', 'graycloud_dn.jpg', 'graycloud_rt.jpg', 'graycloud_lf.jpg'],
  //   { path: '' }
  // );

  // const frontWhite = useLoader(TextureLoader, 'front-white.png')
  // const frontBlack = useLoader(TextureLoader, 'front-black.png')
  // const backWhite = useLoader(TextureLoader, 'back-black.png')
  // const backBlack = useLoader(TextureLoader, 'back-white.png')
  const roughness = 0.5;
  const metal = 0.9;
  const envInstense = 0.4;

  // var emptyColor = createCanvasTexture('', 44, 490 * 2, '#ffffff', '#D1D1D1')
  // var emptyMetal = createCanvasTexture('', 44, 490 * 2, '#818181', '#ffffff')
  // var emptyRoughness = createCanvasTexture('', 44, 490 * 2, '#BEBEBE', '#000000')

  var messageFrontDate = props.date; //'MAR 3 2021'
  var messageFrontTitle = 'THE DATE';
  var messageBack = props.note;

  // var frontColor = createCanvasTexture(messageFrontTitle, 55, 490 * 2, '#ffffff', '#D1D1D1', messageFrontDate)
  // var frontMetal = createCanvasTexture(messageFrontTitle, 55, 490 * 2, '#818181', '#ffffff', messageFrontDate)
  // var frontRoughness = createCanvasTexture(messageFrontTitle, 55, 490 * 2, '#BEBEBE', '#000000', messageFrontDate)
  // var frontNormal = createCanvasTexture(messageFrontTitle, 55, 490 * 2, '#ffffff', '#D1D1D1', messageFrontDate)

  // var backColor = createCanvasTexture(messageBack, 44, 490 * 2, '#ffffff', '#D1D1D1')
  // var backtMetal = createCanvasTexture(messageBack, 44, 490 * 2, '#818181', '#ffffff')
  // var backRoughness = createCanvasTexture(messageBack, 44, 490 * 2, '#BEBEBE', '#000000')
  // var backNormal = createCanvasTexture(messageBack, 44, 490 * 2, '#ffffff', '#D1D1D1')

  return (
    <mesh castShadow >
      <boxGeometry attach="geometry" args={[5.12, 2.16, 0.5]} />
      <meshStandardMaterial attach="material" color="white" metalness={1} roughness={1} />

{/* 
      <meshStandardMaterial
        map={emptyColor}
        metalnessMap={emptyMetal}
        roughnessMap={emptyRoughness}
        color="#C0C0C0"
        metalness={roughness}
        roughness={roughness}
        envMap={envMap}
        envMapIntensity={envInstense}
        attachArray="material"
      />
      <meshStandardMaterial
        map={emptyColor}
        metalnessMap={emptyMetal}
        roughnessMap={emptyRoughness}
        color="#C0C0C0"
        metalness={metal}
        roughness={roughness}
        envMap={envMap}
        envMapIntensity={envInstense}
        attachArray="material"
      />
      <meshStandardMaterial
        map={emptyColor}
        metalnessMap={emptyMetal}
        roughnessMap={emptyRoughness}
        color="#C0C0C0"
        metalness={metal}
        roughness={roughness}
        envMap={envMap}
        envMapIntensity={envInstense}
        attachArray="material"
      />
      <meshStandardMaterial
        map={emptyColor}
        metalnessMap={emptyMetal}
        roughnessMap={emptyRoughness}
        color="#C0C0C0"
        metalness={metal}
        roughness={roughness}
        envMap={envMap}
        envMapIntensity={envInstense}
        attachArray="material"
      />

      <meshStandardMaterial
        envMap={envMap}
        envMapIntensity={envInstense}
        map={frontColor}
        metalnessMap={frontMetal}
        roughnessMap={frontRoughness}
        normalMap={frontNormal}
        color="#C0C0C0"
        metalness={metal}
        roughness={roughness}
        attachArray="material"
      />

      <meshStandardMaterial
        // map={backBlack}
        map={backColor}
        metalnessMap={backtMetal}
        roughnessMap={backRoughness}
        normalMap={backNormal}
        color="#C0C0C0"
        metalness={metal}
        roughness={roughness}
        envMap={envMap}
        envMapIntensity={envInstense}
        attachArray="material"
      /> */}
    </mesh>
  )
}

export default function TheDateNewArtwork() {
  return (
    //shadows
    <Canvas id="thedate-artwork" shadows 
      gl={{ powerPreference: 'default', 
      antialias: true, 
      stencil: false, 
      depth: false, 
      alpha: true, 
      preserveDrawingBuffer: true }}
      camera={{ position: [5, 1, 8], fov: 40 }}>

      <color attach="background" args={['#E5E5E5']} /> 
      
      <directionalLight
        position={[2.5, 3, 3]}
        intensity={0.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <directionalLight
        position={[1, 16, 2]}
        intensity={0.2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <directionalLight
        castShadow
        position={[-1, 10, -2]}
        intensity={0.1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <GroundPlane />
      <Artwork date={"MAR 13 2021"} note={"The owner can engrave a unique note here"} />
      <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI/2 - Math.PI/10} maxPolarAngle={Math.PI/2}/>
    </Canvas>
    // <SaveImage/>
  )
}
