// components/ThreeProfileScene.tsx
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ThreeProfileScene: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (sphereRef.current) {
        sphereRef.current.rotation.x = y * Math.PI;
        sphereRef.current.rotation.y = x * Math.PI;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Canvas style={{ background: '#370617' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#00ff00" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeProfileScene;
