"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, } from '@react-three/drei';
import { Group, SpotLight } from 'three';
import dynamic from 'next/dynamic';

const SkillCard = dynamic(() => import('../components/SkillCard'), { ssr: false });

type Skill = 'TypeScript' | 'JavaScript' | 'TailwindCSS' | 'Figma' | 'Supabase' | 'ThreeJs' | 'NextJs' | 'React';

interface SkillsSceneProps {
  skills: Skill[];
}

const SkillGroup: React.FC<{ skills: Skill[]; isMobile: boolean }> = ({ skills, isMobile }) => {
  const groupRef = useRef<Group>(null);
  const radius = isMobile ? 7 : 10; // Smaller radius for mobile
  const rotationSpeed = 0.7;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => {
        const angle = (index / skills.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = Math.sin(index * 0.5) * (isMobile ? 1.5 : 2); // Reduced vertical spread for mobile

        return (
          <SkillCard
            key={skill}
            skill={skill}
            position={[x, y, z]}
            rotation={[0, -angle, 0]}
            isMobile={isMobile}
          />
        );
      })}
    </group>
  );
};

const MovingLights: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const spotLightRef1 = useRef<SpotLight>(null);
  const spotLightRef2 = useRef<SpotLight>(null);
  const spotLightRef3 = useRef<SpotLight>(null);
  
  const radius = isMobile ? 15 : 20; // Adjust light radius for mobile

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (spotLightRef1.current) {
      spotLightRef1.current.position.x = Math.sin(time * 0.5) * radius;
      spotLightRef1.current.position.z = Math.cos(time * 0.5) * radius;
    }
    if (spotLightRef2.current) {
      spotLightRef2.current.position.x = Math.sin(time * 0.5 + Math.PI * 2 / 3) * radius;
      spotLightRef2.current.position.z = Math.cos(time * 0.5 + Math.PI * 2 / 3) * radius;
    }
    if (spotLightRef3.current) {
      spotLightRef3.current.position.x = Math.sin(time * 0.5 + Math.PI * 4 / 3) * radius;
      spotLightRef3.current.position.z = Math.cos(time * 0.5 + Math.PI * 4 / 3) * radius;
    }
  });

  return (
    <>
      <spotLight ref={spotLightRef1} position={[radius, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#4a9eff" />
      <spotLight ref={spotLightRef2} position={[-radius/2, -10, -radius*0.866]} angle={0.3} penumbra={1} intensity={1} color="#ff4a4a" />
      <spotLight ref={spotLightRef3} position={[-radius/2, -10, radius*0.866]} angle={0.3} penumbra={1} intensity={1} color="#4aff4a" />
    </>
  );
};

const SkillsScene: React.FC<SkillsSceneProps> = ({ skills }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-[50vh] md:h-[600px] relative">
      <Canvas>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, isMobile ? 18 : 25]} 
          fov={isMobile ? 90 : 75}
        />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 20, 0]} intensity={0.7} />
        
        <MovingLights isMobile={isMobile} />
        
        
        <Suspense fallback={<span>Loading...</span>}>
          <SkillGroup skills={skills} isMobile={isMobile} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false}
          minDistance={isMobile ? 15 : 20}
          maxDistance={isMobile ? 25 : 30}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.7}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default SkillsScene;