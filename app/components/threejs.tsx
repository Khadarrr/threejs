"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// Import your images statically
import FrontPic from '../textures/stars.jpg';
import BackPic from '../textures/stars.jpg';
import TopPic from '../textures/stars.jpg';
import BottomPic from '../textures/stars.jpg';
import RightPic from '../textures/stars.jpg';
import LeftPic from '../textures/stars.jpg';

// Define custom interfaces
interface ParticleMesh extends THREE.Mesh {
  userData: {
    velocity: THREE.Vector3;
  };
  material: THREE.MeshPhongMaterial;
}

interface ThreeSceneProps {
  backgroundColor?: string;
  rotationSpeed?: number;
}



const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  backgroundColor = '#000000',
  rotationSpeed = 0.02 
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const texturesLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!mountRef.current) return;
    if (texturesLoadedRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 5, 30);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x0044ff, 1, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff4400, 1, 10);
    pointLight2.position.set(-2, -2, -2);
    scene.add(pointLight2);

    // Create starfield
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Create floating particles with proper typing
    const particleCount = 200;
    const particles = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < particleCount; i++) {
      const material = baseMaterial.clone();
      const particle = new THREE.Mesh(particleGeometry, material) as unknown as ParticleMesh;
      particle.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      particle.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      );
      particles.add(particle);
    }
    scene.add(particles);

    // Texture loading
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const textures = [
      textureLoader.load(FrontPic.src),
      textureLoader.load(BackPic.src),
      textureLoader.load(TopPic.src),
      textureLoader.load(BottomPic.src),
      textureLoader.load(RightPic.src),
      textureLoader.load(LeftPic.src),
    ];

    loadingManager.onLoad = () => {
      texturesLoadedRef.current = true;
      console.log('All textures loaded successfully');
    };

    loadingManager.onError = (url) => {
      console.error('Error loading texture:', url);
    };

    // Create materials for main cube
    const materials = textures.map(texture => {
        // Use colorSpace instead of encoding
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        return new THREE.MeshStandardMaterial({ 
          map: texture,
          roughness: 0.7,
          metalness: 0.3
        });
      });
    // Create main cube
    const geometry = new THREE.BoxGeometry(2, 2, 2, 3, 3, 3);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

   
    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    // Enhanced Animation loop with proper type checking
    let animationFrameId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      starField.rotation.y += 0.0002;
      starField.rotation.x += 0.0001;

      // Animate particles with type checking
      particles.children.forEach((particle) => {
        if (particle instanceof THREE.Mesh) {
          const particleMesh = particle as ParticleMesh;
          particleMesh.position.add(particleMesh.userData.velocity);
          
          if (particleMesh.position.length() > 10) {
            particleMesh.position.setLength(Math.random() * 5);
          }
          
          if (particleMesh.material instanceof THREE.MeshPhongMaterial) {
            particleMesh.material.opacity = 0.3 + Math.sin(time * 3 + particleMesh.position.x) * 0.3;
          }
        }
      });

      // Animate point lights
      pointLight1.position.x = Math.sin(time * 0.5) * 3;
      pointLight1.position.z = Math.cos(time * 0.5) * 3;
      pointLight2.position.x = Math.sin(time * 0.5 + Math.PI) * 3;
      pointLight2.position.z = Math.cos(time * 0.5 + Math.PI) * 3;

      // Update main cube rotation
      cube.rotation.x += rotationSpeed;
      cube.rotation.y += rotationSpeed;


      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      materials.forEach(material => {
        material.map?.dispose();
        material.dispose();
      });
      starGeometry.dispose();
      starMaterial.dispose();
      particleGeometry.dispose();
      baseMaterial.dispose();
      renderer.dispose();
    };
  }, [backgroundColor, rotationSpeed]);

  return <div ref={mountRef} />;
};

export default ThreeScene;