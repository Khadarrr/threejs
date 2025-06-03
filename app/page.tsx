"use client";

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Github, Mail, Instagram, Facebook, ArrowDown, Code, BriefcaseBusiness, Sparkles } from "lucide-react";
import Link from 'next/link';
import type { Skill, Project } from "../lib/types";

// Enhanced loading progress with animation
function LoadingProgress(): JSX.Element {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 3;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[70%] max-w-md flex flex-col items-center">
      <Progress value={progress} className="w-full h-2 bg-slate-700" 
        style={{ 
          backgroundImage: 'linear-gradient(90deg, rgb(124, 58, 237), rgb(59, 130, 246))',
          backgroundSize: `${progress}% 100%`,
          backgroundRepeat: 'no-repeat'
        }} 
      />
      <div className="flex items-center gap-2 mt-3">
        <div className="animate-pulse w-2 h-2 bg-purple-500 rounded-full"></div>
        <p className="text-center text-sm text-white/90">Loading experience...</p>
      </div>
    </div>
  );
}

// Dynamic imports with enhanced loading states
const ThreeScene = dynamic(
  () => import("../app/components/threejs"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#111133] to-[#1a1b2e]">
        <LoadingProgress />
      </div>
    )
  }
);

const ProfileSection = dynamic(
  () => import("./components/ProfileScene"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#111133] to-[#1a1b2e]">
        <LoadingProgress />
      </div>
    )
  }
);

const ProjectsScene = dynamic(
  () => import("./components/ProjectSection"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] flex items-center justify-center backdrop-blur-lg rounded-xl">
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
      <div className="w-full h-[600px] flex items-center justify-center backdrop-blur-lg rounded-xl">
        <LoadingProgress />
      </div>
    )
  }
);

// Project data
const projects: Project[] = [
  {
    "title": "E-commerce Site",
    "description": "Modern e-commerce platform with Zustand state management for the shopping cart, featuring responsive design, product filtering, and a seamless checkout experience.",
    "github": "https://github.com/Khadarrr/e-commerce",
    "live": "https://e-commerce-orcin-omega.vercel.app/",
  },
  {
    "title": "Holidaze",
    "description": "Vacation rental platform where users can book stays and property owners can manage listings. Built with NextJS and integrated with Noroff's API for real-time data management.",
    "github": "https://github.com/Khadarrr/holidaze-bookings",
    "live": "https://holidaze-bookings.vercel.app/",
  },
  {
    "title": "Auction Sphere",
    "description": "Interactive auction marketplace featuring user authentication, real-time bidding, and item listing capabilities. Demonstrates API integration and state management with clean UI.",
    "github": "https://github.com/Khadarrr/Auction-House-sp",
    "live": "https://auctionsphere.netlify.app/",
  }
];

// TypeScript interface definitions
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  icon?: React.ReactNode;
}

interface BadgeProps {
  children: React.ReactNode;
}

interface ContactCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  href: string;
}

interface SocialButtonProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface MobileMenuProps {
  activeSection: string;
}

interface VisibilityState {
  about: boolean;
  projects: boolean;
  skills: boolean;
  contact: boolean;
}

// Enhanced Navigation component with animation
const Navigation = (): JSX.Element => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
      
      // Calculate active section based on scroll position
      const sections = ["home", "about", "projects", "skills", "contact"];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/40 backdrop-blur-lg py-3 shadow-xl' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-white font-bold text-xl group">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">KS</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="#home" isActive={activeSection === "home"}>Home</NavLink>
          <NavLink href="#about" isActive={activeSection === "about"}>About</NavLink>
          <NavLink href="#projects" isActive={activeSection === "projects"}>Projects</NavLink>
          <NavLink href="#skills" isActive={activeSection === "skills"}>Skills</NavLink>
          <NavLink href="#contact" isActive={activeSection === "contact"}>Contact</NavLink>
          <Button size="sm" variant="secondary" className="ml-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-md" asChild>
            <Link href="/resume.pdf" target="_blank">
              <Mail className="mr-2 h-4 w-4" />
              Resume
            </Link>
          </Button>
        </div>
        <div className="md:hidden">
          <MobileMenu activeSection={activeSection} />
        </div>
      </div>
    </nav>
  );
};

// Mobile menu component
const MobileMenu = ({ activeSection }: MobileMenuProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white/90 hover:text-white"
      >
        <span className="sr-only">Menu</span>
        <div className="flex flex-col gap-1">
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-lg p-4 shadow-xl rounded-b-lg">
          <div className="flex flex-col gap-3">
            <MobileNavLink href="#home" isActive={activeSection === "home"} onClick={() => setIsOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="#about" isActive={activeSection === "about"} onClick={() => setIsOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="#projects" isActive={activeSection === "projects"} onClick={() => setIsOpen(false)}>Projects</MobileNavLink>
            <MobileNavLink href="#skills" isActive={activeSection === "skills"} onClick={() => setIsOpen(false)}>Skills</MobileNavLink>
            <MobileNavLink href="#contact" isActive={activeSection === "contact"} onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
            <Button size="sm" variant="secondary" className="mt-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600" asChild>
              <Link href="/resume.pdf" target="_blank">
                <Mail className="mr-2 h-4 w-4" />
                Resume
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation link component with active state
const NavLink = ({ href, children, isActive }: NavLinkProps): JSX.Element => (
  <Link 
    href={href} 
    className={`transition-all duration-300 text-sm font-medium relative px-1 py-1 ${
      isActive 
        ? 'text-white' 
        : 'text-white/70 hover:text-white/90'
    }`}
    scroll={false}
  >
    {children}
    {isActive && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transform origin-left animate-in fade-in duration-300"></span>
    )}
  </Link>
);

// Mobile navigation link
const MobileNavLink = ({ href, children, isActive, onClick }: MobileNavLinkProps): JSX.Element => (
  <Link 
    href={href} 
    className={`text-base py-2 px-3 rounded-md transition-all duration-300 ${
      isActive 
        ? 'bg-white/10 text-white font-medium' 
        : 'text-white/80 hover:bg-white/5'
    }`}
    onClick={onClick}
    scroll={false}
  >
    {children}
  </Link>
);

// Enhanced scroll indicator with animation
const ScrollIndicator = (): JSX.Element => {
  const scrollToSection = (): void => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer" onClick={scrollToSection}>
      <span className="text-white/80 text-sm mb-2">Explore</span>
      <ArrowDown className="h-5 w-5 text-white/80" />
    </div>
  );
};

// Section header component with enhanced styling
const SectionHeader = ({ subtitle, title, icon }: SectionHeaderProps): JSX.Element => (
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center gap-2 mb-3">
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500"></div>
      <div className="flex items-center gap-2 text-white/80 text-lg font-light">
        {icon}
        <span>{subtitle}</span>
      </div>
      <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-transparent"></div>
    </div>
    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
      {title}
    </h2>
  </div>
);

// Improved About section
const AboutSection = (): JSX.Element => (
  <section id="about" className="py-24 relative min-h-screen flex items-center">
    <div className="container mx-auto px-4">
      <SectionHeader subtitle="About Me" title="My Journey & Skills" icon={<Code className="h-5 w-5" />} />
      
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center max-w-5xl mx-auto">
        <div className="md:w-1/2 order-2 md:order-1">
          <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-lg leading-relaxed mb-6 animate-in slide-in-from-left duration-700">
  I&apos;m a passionate front-end developer with expertise in creating responsive, user-friendly web applications. My journey in development started with a curiosity about how things work on the web, which has evolved into a career building engaging digital experiences.
</p>
<p className="text-white/80 text-lg leading-relaxed mb-6 animate-in slide-in-from-left duration-1000 delay-100">
  I specialize in modern JavaScript frameworks like React and Next.js, and I&apos;m experienced in creating seamless user interfaces with TailwindCSS and Three.js for interactive 3D experiences.
</p>
<p className="text-white/80 text-lg leading-relaxed animate-in slide-in-from-left duration-1000 delay-200">
  When I&apos;m not coding, I enjoy exploring new technologies, contributing to open-source projects, and staying updated with the latest web development trends.
</p>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3 animate-in slide-in-from-bottom duration-1000 delay-300">
            <Badge>JavaScript</Badge>
            <Badge>TypeScript</Badge>
            <Badge>React</Badge>
            <Badge>NextJS</Badge>
            <Badge>ThreeJS</Badge>
            <Badge>TailwindCSS</Badge>
            <Badge>Figma</Badge>
            <Badge>Git</Badge>
          </div>
        </div>
        
        <div className="md:w-1/2 order-1 md:order-2 animate-in slide-in-from-right duration-1000">
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-md p-1">
              <div className="w-full h-full backdrop-blur-md rounded-lg p-5 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">3+</p>
                  <p className="text-white/80">Years Experience</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-md p-1">
              <div className="w-full h-full backdrop-blur-md rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">10+</p>
                  <p className="text-white/80 text-sm">Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Badge component for skills
const Badge = ({ children }: BadgeProps): JSX.Element => (
  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-colors duration-300">
    {children}
  </span>
);

// Contact card component with improved hover effects
const ContactCard = ({ title, value, icon, href }: ContactCardProps): JSX.Element => (
  <Link href={href} target="_blank" rel="noopener noreferrer" className="group">
    <div className="bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 rounded-lg p-6 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-lg group-hover:shadow-purple-500/20">
      <div className="flex items-start gap-4">
        <div className="p-2 backdrop-blur-md rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">{title}</h3>
          <p className="text-white/70 text-sm break-all">{value}</p>
        </div>
      </div>
    </div>
  </Link>
);

// Enhanced social button component
const SocialButton = ({ icon, href, label }: SocialButtonProps): JSX.Element => (
  <Button 
    variant="outline" 
    size="lg" 
    className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-full p-3 h-auto w-auto transition-all duration-300 group hover:scale-110 hover:shadow-md hover:shadow-purple-500/30"
    asChild
  >
    <Link href={href} target="_blank" aria-label={label}>
      <span className="sr-only">{label}</span>
      <span className="text-white/80 group-hover:text-white transition-colors">
        {icon}
      </span>
    </Link>
  </Button>
);

// Enhanced home page component
const Home = (): JSX.Element => {
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

  const [isVisible, setIsVisible] = useState<VisibilityState>({
    about: false,
    projects: false,
    skills: false,
    contact: false
  });
  
  useEffect(() => {
    // Intersection observer for section animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && ['about', 'projects', 'skills', 'contact'].includes(id)) {
            setIsVisible(prev => ({ ...prev, [id]: true }));
          }
        }
      });
    }, { threshold: 0.1 });
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
    
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);
  
  // Handle smooth scroll implementation for hash links
  useEffect(() => {
    const handleHashClick = (e: MouseEvent): void => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash && target.hash.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL without triggering a page refresh
          window.history.pushState(null, '', target.hash);
        }
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <Navigation />
      
      {/* Three.js Background - Fixed at 100vh height */}
      <div className="fixed inset-0 bg-[#111133] h-screen">
        <Suspense
          fallback={
            <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#111133] to-[#1a1b2e]">
              <LoadingProgress />
            </div>
          }
        >
          <ThreeScene
            backgroundColor="#111133"
            rotationSpeed={0.005}
          />
        </Suspense>
      </div>

      {/* Portfolio Content Overlay */}
      <div className="relative z-10">
        {/* Home/Profile Section - Full Height */}
        <section id="home" className="h-screen w-full relative overflow-hidden">
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><LoadingProgress /></div>}>
            <div className="h-full w-full">
              <ProfileSection />
            </div>
          </Suspense>
          <ScrollIndicator />
        </section>

        {/* About Section */}
        <AboutSection />

        {/* Projects Section - Improved without gray background */}
        <section id="projects" className={`py-24 relative min-h-screen flex items-center transition-opacity duration-1000 ${isVisible.projects ? 'opacity-100' : 'opacity-0'}`}>
          <div className="container mx-auto px-4">
            <SectionHeader subtitle="My Work" title="Featured Projects" icon={<BriefcaseBusiness className="h-5 w-5" />} />
            <Suspense
              fallback={
                <div className="w-full h-[700px] flex items-center justify-center">
                  <LoadingProgress />
                </div>
              }
            >
              <ProjectsScene projects={projects} />
            </Suspense>
          </div>
        </section>

        {/* Skills Section - Improved without gray background */}
        <section id="skills" className={`py-24 relative min-h-screen flex items-center transition-opacity duration-1000 ${isVisible.skills ? 'opacity-100' : 'opacity-0'}`}>
          <div className="container mx-auto px-4">
            <SectionHeader subtitle="My Expertise" title="Technical Skills" icon={<Sparkles className="h-5 w-5" />} />
            <Suspense
              fallback={
                <div className="w-full h-[600px] flex items-center justify-center">
                  <LoadingProgress />
                </div>
              }
            >
              <SkillsScene skills={skills} />
            </Suspense>
          </div>
        </section>

        {/* Contact Section - Improved without gray background */}
        <section id="contact" className={`py-24 relative min-h-screen flex items-center transition-opacity duration-1000 ${isVisible.contact ? 'opacity-100' : 'opacity-0'}`}>
          <div className="container mx-auto px-4">
            <SectionHeader subtitle="Get In Touch" title="Let's Connect" icon={<Mail className="h-5 w-5" />} />
            
            <div className="max-w-3xl mx-auto">
              <div className="backdrop-blur-lg p-8 rounded-xl border border-white/5 shadow-xl bg-gradient-to-br from-black/20 to-purple-900/10">
              <p className="text-white/70 text-center mb-8 text-lg">
  Feel free to reach out if you&apos;re looking for a developer, have a question, or just want to connect. I&apos;m always open to new opportunities and collaborations.
</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <ContactCard 
                    title="Email" 
                    value="Khadar_shire@hotmail.com" 
                    icon={<Mail className="h-6 w-6 text-purple-400" />}
                    href="mailto:Khadar_shire@hotmail.com"
                  />
                  <ContactCard 
                    title="GitHub" 
                    value="khadarrr" 
                    icon={<Github className="h-6 w-6 text-purple-400" />}
                    href="https://github.com/khadarrr"
                  />
                </div>
                
                <div className="flex justify-center">
                  <div className="flex justify-center items-center gap-6">
                    <SocialButton icon={<Mail className="h-5 w-5" />} href="mailto:Khadar_shire@hotmail.com" label="Email" />
                    <SocialButton icon={<Github className="h-5 w-5" />} href="https://github.com/khadarrr" label="GitHub" />
                    <SocialButton icon={<Instagram className="h-5 w-5" />} href="https://instagram.com/kadvfi" label="Instagram" />
                    <SocialButton icon={<Facebook className="h-5 w-5" />} href="https://www.facebook.com/LilCaddy" label="Facebook" />
                  </div>
                </div>
                
                <div className="mt-10 flex justify-center">
                  <Button variant="default" size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-8 py-6 text-base shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300" asChild>
                    <Link href="mailto:Khadar_shire@hotmail.com">
                      Let's Work Together
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Enhanced */}
        <footer className="bg-black/60 backdrop-blur-md py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">KS</span>
                <p className="text-white/60 mt-2">© {new Date().getFullYear()} Khadar. All rights reserved.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <Link href="#home" className="text-white/60 hover:text-white text-sm transition-colors">Home</Link>
                <Link href="#about" className="text-white/60 hover:text-white text-sm transition-colors">About</Link>
                <Link href="#projects" className="text-white/60 hover:text-white text-sm transition-colors">Projects</Link>
                <Link href="#skills" className="text-white/60 hover:text-white text-sm transition-colors">Skills</Link>
                <Link href="#contact" className="text-white/60 hover:text-white text-sm transition-colors">Contact</Link>
              </div>
            </div>
            <div className="mt-6 text-center text-white/40 text-xs">
              Designed & Built with ❤️ using Next.js, TailwindCSS & Three.js
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;