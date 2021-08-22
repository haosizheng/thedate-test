import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import GLTFModel from "../components/gltf-model";

export default function ViewerPage() {
  return (
    <div className="hero">
      <div className="hero-content w-96 h-96">
        <Canvas
          gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
          shadows
        >
          <Suspense fallback={null}>
            <Stage
              contactShadow
              shadows
              adjustCamera
              intensity={1}
              environment="city"
              preset="rembrandt"
            >
              <GLTFModel model={"/DamagedHelmet.glb"} shadows={true} />
            </Stage>
            <OrbitControls autoRotate enablePan={false} enableZoom={false} minPolarAngle={Math.PI/2 - Math.PI/10} maxPolarAngle={Math.PI/2}/>
          </Suspense>
        </Canvas>
     </div>
    </div>
  );
  
}
