"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
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

// Example of projects array
const projects = [
  {
    title: "E-commerce Site",
    description: "A functional shopping cart application built by using Zustand state management",
    github: "https://github.com/Khadarrr/e-commerce",
    live: "https://e-commerce-orcin-omega.vercel.app/"
  },
  {
    title: "Holidaze",
    description: "A Airbnb type app that helps users find the best vacation spots, built using Noroffs API",
    github: "https://github.com/Khadarrr/holidaze-bookings",
    live: "https://holidaze-bookings.vercel.app/"
  },
  {
    title: "Auction House",
    description: "An online auction platform where users can buy and sell items, built using Noroffs API",
    github: "https://github.com/Khadarrr/Auction-House-sp",
    live: "https://auctionsphere.netlify.app/"
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
        <section id="contact" className="py-20 ">
          <div className="container mx-auto px-4">
            <p className="text-center text-white/80 text-lg mb-2">Get in Touch</p>
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              🥷
            </h2>
            <div className="flex justify-center items-center gap-8">
              <Button variant="ghost" className="text-white" asChild>
                <Link href="mailto:Khadar_shire@hotmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Khadar_shire@hotmail.com
                </Link>
              </Button>
              <Button variant="ghost" className="text-white" asChild>
                <Link href="https://github.com/khadarrr" target="_blank">
                  <Github className="mr-2 h-5 w-5" />
                  Khadarrr
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-sm py-8">
          <div className="container mx-auto px-4 text-center text-white/60">
            <p>© 2024 Khadar Hashi. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;