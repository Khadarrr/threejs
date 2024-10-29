// SkillCard.tsx
"use client";

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Image from 'next/image';
import type { Mesh } from 'three';
import * as THREE from 'three';

// Importing images
import ReactLogo from "../textures/react-1.svg";
import JSLogo from "../textures/JavaScript-logo.png";
import TaiwindLogo from "../textures/tailwindcss.jpeg";
import FigmaLogo from "../textures/figma-1-logo-png-transparent.png";
import ThreeJsLogo from "../textures/threejs-logo.png";
import TSLogo from "../textures/typscript logo.png";
import SbaseLogo from "../textures/supabase.jpeg";
import NextLogo from "../textures/nextJS.jpg";

// Define images and colors by skill
const skillImages = {
  TypeScript: TSLogo,
  JavaScript: JSLogo,
  TailwindCSS: TaiwindLogo,
  Figma: FigmaLogo,
  Supabase: SbaseLogo,
  ThreeJs: ThreeJsLogo,
  NextJs: NextLogo,
  React: ReactLogo
} as const;

interface SkillCardProps {
  skill: keyof typeof skillImages;
  position: [number, number, number];
  rotation: [number, number, number];
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, position, rotation }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = new THREE.TextureLoader().load(skillImages[skill].src);

  // Define materials for each face of the cube
  const materials = [
    new THREE.MeshStandardMaterial({ map: texture }),
    new THREE.MeshStandardMaterial({ map: texture }),
    new THREE.MeshStandardMaterial({ map: texture }),
    new THREE.MeshStandardMaterial({ map: texture }),
    new THREE.MeshStandardMaterial({ map: texture }),
    new THREE.MeshStandardMaterial({ map: texture }),
  ];

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.rotation.x += delta * 0.5;
        meshRef.current.rotation.y += delta * 0.5;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
      } else {
        meshRef.current.rotation.x += (rotation[0] - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y += (rotation[1] - meshRef.current.rotation.y) * 0.1;
        meshRef.current.position.y += (position[1] - meshRef.current.position.y) * 0.1;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      material={materials}
    >
      <boxGeometry args={[2, 2, 2]} />

      {/* Display skill name on hover */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black text-white px-2 py-1 rounded-md text-sm">
            {skill}
          </div>
        </Html>
      )}
    </mesh>
  );
};

export default SkillCard;
