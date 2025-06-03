"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { Github, Mail, ArrowDownCircle, Code, ExternalLink, Linkedin, Twitter } from 'lucide-react';
import ProfileImage from "../textures/portrett-meg.jpg";

// Custom hook for responsive design with breakpoints
const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024
      });
    };
    
    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  return breakpoint;
};

// Enhanced profile content with staged animations
const ProfileContent = ({ isVisible }: { isVisible: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [socialVisible, setSocialVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const fullText = "Developer & Designer";
  
  useEffect(() => {
    if (isVisible) {
      // Staged animations for smoother experience
      const imageTimer = setTimeout(() => setImageLoaded(true), 300);
      
      let index = 0;
      const textTimer = setTimeout(() => {
        const typewriter = setInterval(() => {
          if (index < fullText.length) {
            setDisplayText(prev => prev + fullText.charAt(index));
            index++;
          } else {
            clearInterval(typewriter);
            setTypewriterComplete(true);
            
            // Show social links after typewriter effect
            setTimeout(() => setSocialVisible(true), 400);
            
            // Show buttons last
            setTimeout(() => setButtonsVisible(true), 800);
          }
        }, 100);
        
        return () => clearInterval(typewriter);
      }, 800);
      
      return () => {
        clearTimeout(imageTimer);
        clearTimeout(textTimer);
      };
    }
  }, [isVisible, fullText]);

  return (
    <div className={`w-full h-full flex items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center px-4 md:px-0 max-w-2xl">
        {/* Enhanced profile image section */}
        <div className="mb-8 relative">
          {/* Pulsating gradient circle behind profile image */}
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 
                         bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-blue-500/30 
                         blur-xl rounded-full animate-pulse-slow"></div>
          
          {/* Rotating accent dots */}
          <div className="absolute -z-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64">
            <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-orbit-slow"></div>
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-orbit-slow-reverse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute w-1 h-1 bg-white rounded-full animate-orbit-fast" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Profile image with effects */}
          <div className={`relative w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden 
                        border-4 border-white/20 shadow-lg transition-all duration-700 
                        ${imageLoaded ? 'scale-100' : 'scale-90 opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-500">
              <Image
                src={ProfileImage}
                alt="Profile"
                quality={95}
                fill
                sizes="(max-width: 768px) 128px, 192px"
                className={`object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </div>
          </div>
          
          {/* Accent decorations */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-full">
            <div className="flex justify-center space-x-20">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-3">
            <p className={`text-lg md:text-xl text-white/80 animate-in fade-in font-light tracking-wide`}>
              Hello, I&apos;m
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 animate-in slide-in-from-bottom duration-500 tracking-tight">
              Khadar
            </h1>
            <div className="h-8 relative">
              <p className="text-xl md:text-2xl text-white/80 font-light">
                {displayText}
                <span className={`inline-block w-0.5 h-5 bg-white/80 ml-1 align-middle ${typewriterComplete ? 'animate-pulse' : 'animate-blink'}`}></span>
              </p>
            </div>
          </div>
          
          <p className="text-white/70 max-w-lg mx-auto animate-in fade-in duration-1000 delay-500">
            Crafting engaging web experiences with modern technologies and creative design solutions.
          </p>
          
          {/* Action buttons with enhanced animation */}
          <div className={`flex justify-center gap-4 md:gap-6 transition-all duration-500 ${buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button 
              size="lg" 
              variant="default" 
              className="text-sm md:text-base hover:scale-105 transition-transform bg-gradient-to-r from-purple-600 to-blue-600 shadow-md shadow-purple-900/20" 
              asChild
            >
              <Link href="#contact">
                Get in Touch
                <Mail className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-sm md:text-base hover:scale-105 transition-transform border-white/20 bg-white/5 backdrop-blur-sm" 
              asChild
            >
              <Link href="#projects">
                View Projects
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Social links with staggered animation */}
          <div className={`flex justify-center gap-5 md:gap-7 transition-all duration-500 ${socialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <SocialButton icon={<Github />} href="https://github.com/Khadarrr" label="GitHub" />
            <SocialButton icon={<Mail />} href="mailto:Khadar_shire@hotmail.com" label="Email" />
            <SocialButton icon={<Linkedin />} href="#" label="LinkedIn" />
            <SocialButton icon={<Twitter />} href="#" label="Twitter" />
            <SocialButton icon={<Code />} href="#skills" label="Skills" />
          </div>
        </div>
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Link href="#about" scroll={true} aria-label="Scroll to About section">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 group-hover:opacity-60 blur transition duration-300"></div>
              <ArrowDownCircle className="h-8 w-8 relative text-white/50 group-hover:text-white/90 transition-colors duration-300" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Enhanced social button component with hover effects
const SocialButton = ({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) => (
  <Button 
    variant="ghost" 
    size="icon" 
    className="group relative hover:scale-110 transition-all duration-300 bg-white/5 border border-white/10 p-2" 
    asChild
  >
    <Link href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label}>
      <span className="sr-only">{label}</span>
      <span className="text-white/80 group-hover:text-white transition-colors">
        {icon}
      </span>
      {/* Button glow effect */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
    </Link>
  </Button>
);

// Main profile component with enhanced loading and animations
const ProfileComponent: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Staggered load sequence
    const loadTimer = setTimeout(() => setIsLoaded(true), 300);
    const contentTimer = setTimeout(() => setShowContent(true), 800);
    
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Content */}
      <div className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <ProfileContent isVisible={showContent} />
      </div>
      
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes orbit-slow {
          0% { transform: translateX(-120px) translateY(0) rotate(0deg) translateX(120px) translateY(0); }
          100% { transform: translateX(-120px) translateY(0) rotate(360deg) translateX(120px) translateY(0); }
        }
        
        @keyframes orbit-slow-reverse {
          0% { transform: translateX(-100px) translateY(0) rotate(0deg) translateX(100px) translateY(0); }
          100% { transform: translateX(-100px) translateY(0) rotate(-360deg) translateX(100px) translateY(0); }
        }
        
        @keyframes orbit-fast {
          0% { transform: translateX(-80px) translateY(0) rotate(0deg) translateX(80px) translateY(0); }
          100% { transform: translateX(-80px) translateY(0) rotate(720deg) translateX(80px) translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        .animate-orbit-slow {
          animation: orbit-slow 20s linear infinite;
        }
        
        .animate-orbit-slow-reverse {
          animation: orbit-slow-reverse 15s linear infinite;
        }
        
        .animate-orbit-fast {
          animation: orbit-fast 10s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfileComponent;