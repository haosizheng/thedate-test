import React, { useEffect,  useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, OrbitControls, RoundedBox } from '@react-three/drei';

function Thing() {
    const ref = useRef<THREE.Mesh>(null!)
    useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01))
    return (
      <mesh
        ref={ref}
        position={[0.5, 0.5, 0.5]} receiveShadow castShadow 
        onClick={e => console.log('click')}
        onPointerOver={e => console.log('hover')}
        onPointerOut={e => console.log('unhover')}>
        <boxBufferGeometry args={[2.1, 0.9, 0.2]} />
        <meshStandardMaterial attach="material" color="white" metalness={1} roughness={1} />
      </mesh>
    )
}

//#E5E5E5
export default function TheDateArtwork() {
  return (
    <Canvas orthographic 
      gl={{ powerPreference: 'default', antialias: false, stencil: false, depth: false, alpha: false }}
      camera={{ position: [0, 0, 5], near: 0.1, far: 100, zoom: 80 }}>
      <color attach="background" args={['#E5E5E5']} /> 
      <group name="sceneContainer">
        <Thing />
      </group>
      <ambientLight intensity={1.0} />
      <directionalLight 
        color="white"
        position={[-1, 10, 7.5]}
      />
      <pointLight
        color="antiquewhite"
        position={[-2, 1, 1.4]}
        intensity={1} />
      <OrbitControls autoRotate={false} enableZoom={false} 
        maxAzimuthAngle={Math.PI / 4}
        maxPolarAngle={Math.PI}
        minAzimuthAngle={-Math.PI / 4}
        minPolarAngle={0}/>
    </Canvas>
  )
}

