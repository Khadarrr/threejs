// SkillsScene.tsx
"use client";
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Group } from 'three';
import dynamic from 'next/dynamic';


const SkillCard = dynamic(() => import('../components/SkillCard'), { ssr: false });

type Skill = 'TypeScript' | 'JavaScript' | 'TailwindCSS' | 'Figma' | 'Supabase' | 'ThreeJs' | 'NextJs' | 'React';

interface SkillsSceneProps {
  skills: Skill[];
}

const SkillGroup: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  const groupRef = useRef<Group>(null);
  const radius = 10;
  const rotationSpeed = 0.0005;

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
        const y = Math.sin(index * 0.5) * 2;
        
        return (
          <SkillCard
            key={skill}
            skill={skill}
            position={[x, y, z]}
            rotation={[0, -angle, 0]}
          />
        );
      })}
    </group>
  );
};

const MovingLights: React.FC = () => {
  const spotLightRef1 = useRef<THREE.SpotLight>(null);
  const spotLightRef2 = useRef<THREE.SpotLight>(null);
  const spotLightRef3 = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (spotLightRef1.current) {
      spotLightRef1.current.position.x = Math.sin(time * 0.5) * 20;
      spotLightRef1.current.position.z = Math.cos(time * 0.5) * 20;
    }
    if (spotLightRef2.current) {
      spotLightRef2.current.position.x = Math.sin(time * 0.5 + Math.PI * 2 / 3) * 20;
      spotLightRef2.current.position.z = Math.cos(time * 0.5 + Math.PI * 2 / 3) * 20;
    }
    if (spotLightRef3.current) {
      spotLightRef3.current.position.x = Math.sin(time * 0.5 + Math.PI * 4 / 3) * 20;
      spotLightRef3.current.position.z = Math.cos(time * 0.5 + Math.PI * 4 / 3) * 20;
    }
  });

  return (
    <>
      <spotLight ref={spotLightRef1} position={[20, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#4a9eff" />
      <spotLight ref={spotLightRef2} position={[-10, -10, -17.32]} angle={0.3} penumbra={1} intensity={1} color="#ff4a4a" />
      <spotLight ref={spotLightRef3} position={[-10, -10, 17.32]} angle={0.3} penumbra={1} intensity={1} color="#4aff4a" />
    </>
  );
};

const SkillsScene: React.FC<SkillsSceneProps> = ({ skills }) => {
  return (
    <div className="w-200px h-[600px] relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 25]} />
        
        {/* Enhanced ambient lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 20, 0]} intensity={0.5} />
        
        {/* Moving spotlights */}
        <MovingLights />
        
        {/* Enhanced stars background */}
        <Stars radius={60} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
        
        <Suspense fallback={<span>Loading...</span>}>
          <SkillGroup skills={skills} />
        </Suspense>
        
        {/* Enhanced controls */}
        <OrbitControls enableZoom={true} minDistance={20} maxDistance={30} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI - Math.PI / 4} />
      </Canvas>
    </div>
  );
};

export default SkillsScene;
