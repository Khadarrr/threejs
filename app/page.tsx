"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Github, Mail, Instagram, Facebook  } from "lucide-react";
import Link from 'next/link';
import type { Skill,} from "../lib/types";
import ProjectsSection from './components/ProjectSection';
import ProfileSection from "./components/ProfileScene"

function LoadingProgress() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[60%] max-w-md">
      <Progress value={progress} className="w-full" />
      <p className="text-center text-sm text-white mt-2">Loading 3D Scene...</p>
    </div>
  );
}

const ThreeScene = dynamic(
  () => import("../app/components/threejs"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-[#2b2d42]">
        <LoadingProgress />
      </div>
    )
  }
);

const SkillsScene = dynamic(
  () => import("../app/components/SkillScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center">
        <LoadingProgress />
      </div>
    )
  }
);


const projects = [
  {
    "title": "E-commerce Site",
    "description": "E-commerce platform where the shopping cart leverages Zustand state management for dynamic updates, showcasing expertise in state management and responsive design.",
    "github": "https://github.com/Khadarrr/e-commerce",
    "live": "https://e-commerce-orcin-omega.vercel.app/"
  },
  
  {
    "title": "Holidaze",
    "description": "A responsive vacation booking platform, allowing users to book stays and hosts to manage properties. Built using Noroff's API, highlighting frontend and API integration skills.",
    "github": "https://github.com/Khadarrr/holidaze-bookings",
    "live": "https://holidaze-bookings.vercel.app/"
  },
  
  {
    "title": "Auction Sphere",
    "description": "An interactive auction site where users can create accounts to list, buy, and bid on items. Built with Noroff's API, emphasizing seamless user experience and real-time interactions.",
    "github": "https://github.com/Khadarrr/Auction-House-sp",
    "live": "https://auctionsphere.netlify.app/"
  }
];



const Home = () => {
  const skills: Skill[] = [
    "TypeScript",
    "JavaScript",
    "TailwindCSS",
    "Figma",
    "Supabase",
    "ThreeJs",
    "NextJs",
    "React"
  ];

  return (
    <div className="min-h-screen relative">
      {/* Three.js Background */}
      <div className="fixed inset-0">
        <Suspense
          fallback={
            <div className="h-screen w-full flex items-center justify-center bg-[#2b2d42]">
              <LoadingProgress />
            </div>
          }
        >
          <ThreeScene
            backgroundColor="#2b2d42"
            rotationSpeed={0.010}
          />
        </Suspense>
      </div>

      {/* Portfolio Content Overlay */}
      <div className="relative z-10">
        {/* Profile Section */}
        <ProfileSection/>

        {/* Projects Section */}
        <ProjectsSection projects={projects} />

        {/* Skills Section */}
        <section className="py-20">
          <div className="container mx-auto px-2">
            <p className="text-center text-white/80 text-lg mb-2">Skills</p>
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Programs
            </h2>
            <Suspense
              fallback={
                <div className="w-full h-[600px] flex items-center justify-center">
                  <LoadingProgress />
                </div>
              }
            >
             <SkillsScene 
      skills={skills}
      
    />
            </Suspense>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <p className="text-center text-white/80 text-lg mb-2">Get in Touch</p>
        <div className="flex justify-center items-center gap-8">
          <Button variant="ghost" className="text-white" asChild>
            <Link href="mailto:Khadar_shire@hotmail.com">
              <Mail className="mr-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" className="text-white" asChild>
            <Link href="https://github.com/khadarrr" target="_blank">
              <Github className="mr-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" className="text-white" asChild>
            <Link href="https://instagram.com/kadvfi" target="_blank">
              <Instagram className="mr-2 h-5 w-5" />
              
            </Link>
          </Button>
          <Button variant="ghost" className="text-white" asChild>
            <Link href="https://www.facebook.com/LilCaddy" target="_blank">
              <Facebook className="mr-2 h-5 w-5" />
              
            </Link>
          </Button>
        </div>
      </div>
    </section>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-sm py-8">
          <div className="container mx-auto px-4 text-center text-white/60">
            <p>© 2024 Khadar All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;