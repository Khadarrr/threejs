import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Project } from "../../lib/types";
import Ecom from "../textures/e-com.png";
import Holidaze from "../textures/holidaze.png";
import Auction from "../textures/auction-house.png";

interface ProjectsProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <p className="text-center text-white/80 text-lg mb-2">Recent</p>
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all">
              <div className="h-48 bg-white/5 relative">
                <Image
                  src={index === 0 ? Ecom : index === 1 ? Holidaze : Auction}
                  alt={project.title}
                  fill
                  className="object-contain"
                />
              </div>
              <CardContent>
                <CardTitle className="text-xl font-bold text-white mb-4">{project.title}</CardTitle>
                <p className="text-white/80 mb-4">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between gap-4">
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={project.github} target="_blank">Github</Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={project.live} target="_blank">Live Site</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;