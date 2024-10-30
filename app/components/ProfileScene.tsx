"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { Github, Mail } from 'lucide-react';
import * as THREE from 'three';
import ProfileImage from "../textures/me-pic.jpg";

// Custom hook for responsive design
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Profile Image and Content Component
const ProfileContent = ({ isVisible }: { isVisible: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center px-4 md:px-0 max-w-2xl">
        <div className="mb-6 relative">
          <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden 
                      border-4 border-white/20 shadow-lg">
            <div className="relative w-full h-full transform transition-transform duration-300">
              <Image
                src={ProfileImage}
                alt="Profile"
                quality={95}
                fill
                sizes="(max-width: 768px) 128px, 192px"
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <p className="text-lg md:text-xl text-white/80 animate-in fade-in font-light">
              Hello, I'm
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white animate-in slide-in-from-bottom duration-500">
              Khadar
            </h1>
            <p className="text-xl md:text-2xl text-white/80 animate-in slide-in-from-bottom duration-700 font-light">
              Developer
            </p>
          </div>
          
          <div className="flex justify-center gap-3 md:gap-4 animate-in slide-in-from-bottom duration-1000">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-sm md:text-base hover:scale-105 transition-transform" 
              asChild
            >
              <Link href="#contact">Get in Touch</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-sm md:text-base hover:scale-105 transition-transform" 
              asChild
            >
              <Link href="#projects">View Projects</Link>
            </Button>
          </div>
          
          <div className="flex justify-center gap-4 md:gap-6 animate-in slide-in-from-bottom duration-1000">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:scale-110 transition-all duration-300" 
              asChild
            >
              <Link href="https://github.com/Khadarrr" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:scale-110 transition-all duration-300" 
              asChild
            >
              <Link href="mailto:Khadar_shire@hotmail.com">
                <Mail className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated Background Spheres
const AnimatedSphere = ({ position, scale }: { position: [number, number, number], scale: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.5;
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.z = time * 0.2;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "#ff4d4d" : "#370617"}
        roughness={0.3}
        metalness={0.9}
        wireframe
        transparent
        opacity={hovered ? 0.9 : 0.7}
      />
    </mesh>
  );
};

// Scene Component
const Scene = ({ isMobile }: { isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const scale = isMobile ? 0.6 : 1;
  const radius = isMobile ? 2 : 3;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        {[...Array(isMobile ? 6 : 8)].map((_, i) => (
          <AnimatedSphere
            key={i}
            position={[
              Math.cos((i / (isMobile ? 6 : 8)) * Math.PI * 2) * radius,
              Math.random() * 2 - 1,
              Math.sin((i / (isMobile ? 6 : 8)) * Math.PI * 2) * radius
            ]}
            scale={scale}
          />
        ))}
      </Float>
    </group>
  );
};

// Camera Component
const CameraController = () => {
  const { camera } = useThree();
  const isMobile = useResponsive();
  
  useEffect(() => {
    const targetZ = isMobile ? 10 : 8;
    camera.position.z = targetZ;
  }, [camera, isMobile]);

  return null;
};

// Main Component
const EnhancedProfileScene: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const isMobile = useResponsive();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen">
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 8], fov: 75 }}
      >
        <CameraController />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Scene isMobile={isMobile} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <ProfileContent isVisible={showContent} />
    </section>
  );
};

export default EnhancedProfileScene;