"use client";

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from "../../lib/types";
import Ecom from "../textures/e-com.png"; 
import Holidaze from "../textures/holidaze.png"; 
import Auction from "../textures/auction-house.png";

interface ProjectCardProps {
  project: Project;
  index: number;
  position: [number, number, number];
  angle: number;
  isMobile: boolean;
  isSelected: boolean;
  onClick: () => void;
  cameraPosition?: React.MutableRefObject<THREE.Vector3>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  position,
  // angle, // Removed since not used
  isMobile,
  isSelected,
  onClick,
  // cameraPosition // Removed since not used
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Get the appropriate image based on project title
  const getProjectTexture = () => {
    if (project.title.includes("E-commerce")) return Ecom;
    if (project.title.includes("Holidaze")) return Holidaze;
    if (project.title.includes("Auction")) return Auction;
    return Ecom; // Default fallback
  };
  
  // Create texture from imported image
  const [texture] = useState(() => {
    const t = new THREE.Texture();
    const img = new Image();
    img.src = getProjectTexture().src;
    img.onload = () => {
      t.image = img;
      t.needsUpdate = true;
    };
    return t;
  });
  
  useFrame((state) => {
    if (meshRef.current) {
      if (hovered || isSelected) {
        // Scale up when hovered or selected
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
        
        // Slight floating animation
        if (groupRef.current) {
          groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
      } else {
        // Return to original scale
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        
        // Return to original position
        if (groupRef.current) {
          groupRef.current.position.y = position[1];
        }
      }
    }
  });

  return (
    <group position={[position[0], position[1], position[2]]} ref={groupRef}>
      {/* Billboard ensures the card always faces the camera */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          {/* Panel geometry instead of cube */}
          <planeGeometry args={[isMobile ? 3 : 4, isMobile ? 2 : 2.5]} />
          <meshStandardMaterial 
            map={texture} 
            transparent={true}
            opacity={isSelected ? 1 : 0.9}
          />
          
          {/* Back side of the panel */}
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[isMobile ? 3 : 4, isMobile ? 2 : 2.5]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </mesh>
        
        {/* Project title always visible */}
        <Html
          position={[0, isMobile ? -1.4 : -1.6, 0]}
          center
          distanceFactor={10}
        >
          <div className="bg-black/80 text-white px-3 py-2 rounded-md text-sm md:text-base min-w-32 text-center whitespace-nowrap">
            <div className="font-medium">{project.title}</div>
            {(hovered || isSelected) && (
              <div className="text-white/60 mt-1 text-xs italic">
                Click to view details
              </div>
            )}
          </div>
        </Html>
      </Billboard>
    </group>
  );
};

export default ProjectCard;