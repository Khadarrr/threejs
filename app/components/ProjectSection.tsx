"use client";

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Ecom from "../textures/e-com.png"; 
import Holidaze from "../textures/holidaze.png"; 
import Auction from "../textures/auction-house.png";
import dynamic from 'next/dynamic';

// Import the Project type from your types file
import type { Project } from "../../lib/types";

// Dynamically import the ProjectCard component with SSR disabled
const ProjectCard = dynamic(() => import('../components/projectCard'), { ssr: false });

interface ProjectGroupProps {
  projects: Project[]; 
  isMobile: boolean;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  onSelectProject: (project: Project) => void;
}

const ProjectGroup: React.FC<ProjectGroupProps> = ({ 
  projects, 
  isMobile, 
  selectedIndex, 
  setSelectedIndex,
  onSelectProject 
}) => {
  const groupRef = useRef<Group>(null);
  const radius = isMobile ? 8 : 11; // Adjust radius based on screen size
  const rotationSpeed = 0.2; // Slower rotation for a more elegant feel
  
  // Create a reference to the camera position for billboard effect
  const cameraPosition = useRef(new Vector3(0, 0, isMobile ? 18 : 22));

  useFrame(({ clock, camera }) => {
    // Update reference to camera position
    cameraPosition.current.copy(camera.position);
    
    if (groupRef.current) {
      // If nothing is selected, rotate normally
      if (selectedIndex === null) {
        groupRef.current.rotation.y = clock.getElapsedTime() * rotationSpeed;
      } else {
        // When something is selected, rotate to position the selected project in front
        const targetAngle = -((2 * Math.PI * selectedIndex) / projects.length);
        groupRef.current.rotation.y = groupRef.current.rotation.y * 0.95 + targetAngle * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = 0; // Keep all projects at the same height for better visibility

        return (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            position={[x, y, z]}
            angle={angle}
            isMobile={isMobile}
            isSelected={selectedIndex === index}
            cameraPosition={cameraPosition}
            onClick={() => {
              setSelectedIndex(index);
              onSelectProject(project);
            }}
          />
        );
      })}
    </group>
  );
};

const MovingLights: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const spotLightRef1 = useRef<any>(null);
  const spotLightRef2 = useRef<any>(null);
  
  const radius = isMobile ? 15 : 20;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (spotLightRef1.current) {
      spotLightRef1.current.position.x = Math.sin(time * 0.3) * radius;
      spotLightRef1.current.position.z = Math.cos(time * 0.3) * radius;
    }
    if (spotLightRef2.current) {
      spotLightRef2.current.position.x = Math.sin(time * 0.3 + Math.PI) * radius;
      spotLightRef2.current.position.z = Math.cos(time * 0.3 + Math.PI) * radius;
    }
  });

  return (
    <>
      <spotLight ref={spotLightRef1} position={[radius, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} color="#6495ED" />
      <spotLight ref={spotLightRef2} position={[-radius, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} color="#9370DB" />
    </>
  );
};

const ProjectDetails: React.FC<{ 
  project: Project | null; 
  onClose: () => void;
}> = ({ project, onClose }) => {
  if (!project) return null;
  
  // Determine which image to use based on project title
  const getProjectImage = () => {
    if (project.title.includes("E-commerce")) return Ecom;
    if (project.title.includes("Holidaze")) return Holidaze;
    if (project.title.includes("Auction")) return Auction;
    return Ecom; // Default fallback
  };
  
  // Technologies for each project
  const getTechnologies = () => {
    if (project.title.includes("E-commerce")) {
      return ["React", "NextJS", "TailwindCSS", "Zustand"];
    }
    if (project.title.includes("Holidaze")) {
      return ["React", "NextJS", "Noroff API", "Responsive Design"];
    }
    if (project.title.includes("Auction")) {
      return ["React", "Noroff API", "JavaScript", "Netlify"];
    }
    return ["React", "NextJS", "TailwindCSS"];
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 backdrop-blur-md px-4">
      <Card className="bg-black/90 border border-white/20 p-6 rounded-lg max-w-md w-full shadow-xl">
        <div className="h-48 bg-white/5 relative mb-4 rounded-md overflow-hidden">
          <Image
            src={getProjectImage()}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-0">
          <CardTitle className="text-2xl font-bold text-white mb-2">{project.title}</CardTitle>
          <p className="text-white/80 mb-4">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {getTechnologies().map((tech) => (
              <span key={tech} className="bg-white/10 px-2 py-1 rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-4 mt-6 p-0">
          <Button variant="secondary" className="w-full" asChild>
            <Link href={project.github} target="_blank">Github</Link>
          </Button>
          <Button variant="default" className="w-full" asChild>
            <Link href={project.live} target="_blank">Live Site</Link>
          </Button>
        </CardFooter>
        
        <Button 
          variant="ghost" 
          className="mt-4 w-full text-white/60 hover:text-white"
          onClick={onClose}
        >
          Close
        </Button>
      </Card>
    </div>
  );
};

interface ProjectsSceneProps {
  projects: Project[];
}

const ProjectsScene: React.FC<ProjectsSceneProps> = ({ projects }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
    setSelectedIndex(null);
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <p className="text-center text-white/80 text-lg mb-2">Featured</p>
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Projects</h2>
        
        <div className="w-full h-[60vh] md:h-[700px] relative">
          {selectedProject && (
            <ProjectDetails project={selectedProject} onClose={handleCloseDetails} />
          )}
          
          <Canvas>
            <PerspectiveCamera 
              makeDefault 
              position={[0, 0, isMobile ? 18 : 22]} 
              fov={isMobile ? 75 : 60}
            />
            
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 10, 0]} intensity={0.5} />
            
            <MovingLights isMobile={isMobile} />
            
            <Suspense fallback={null}>
              <ProjectGroup 
                projects={projects} 
                isMobile={isMobile} 
                selectedIndex={selectedIndex} 
                setSelectedIndex={setSelectedIndex}
                onSelectProject={handleSelectProject}
              />
              <Environment preset="city" />
            </Suspense>
            
            <OrbitControls 
              enableZoom={false}
              minDistance={isMobile ? 15 : 20}
              maxDistance={isMobile ? 25 : 30}
              enablePan={false}
              autoRotate={selectedIndex === null}
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/70">
            <p>Click on projects to view details</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsScene;