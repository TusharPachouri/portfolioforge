"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface DepthMapImageProps {
  imageSrc: string;
  depthSrc: string;
  width?: number | string;
  height?: number | string;
  intensity?: number;
  className?: string;
}

export default function DepthMapImage({
  imageSrc,
  depthSrc,
  width = 300,
  height = 400,
  intensity = 0.05,
  className = "",
}: DepthMapImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    
    // Size the renderer to match the CSS size
    const rect = containerRef.current.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const loader = new THREE.TextureLoader();

    const uniforms = {
      uImage: { value: null as THREE.Texture | null },
      uDepth: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
      uImageRes: { value: new THREE.Vector2(1, 1) },
      uPlaneRes: { value: new THREE.Vector2(1, 1) },
    };

    // Load textures
    loader.load(imageSrc, (texture) => {
      // Improve texture quality
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      uniforms.uImage.value = texture;
      uniforms.uImageRes.value.set(texture.image.width, texture.image.height);
    });

    loader.load(depthSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      uniforms.uDepth.value = texture;
    });

    // Create custom shader material
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uImage;
        uniform sampler2D uDepth;
        uniform vec2 uMouse;
        uniform float uIntensity;
        uniform vec2 uImageRes;
        uniform vec2 uPlaneRes;
        varying vec2 vUv;

        void main() {
          // Calculate object-cover UVs
          float planeAspect = uPlaneRes.x / uPlaneRes.y;
          float imageAspect = uImageRes.x / uImageRes.y;
          
          vec2 ratio = vec2(1.0);
          if (planeAspect > imageAspect) {
              ratio.y = imageAspect / planeAspect;
          } else {
              ratio.x = planeAspect / imageAspect;
          }
          
          vec2 coverUv = (vUv - 0.5) * ratio + 0.5;

          vec4 depthColor = texture2D(uDepth, coverUv);
          float depth = depthColor.r; // Use red channel for depth
          
          // Calculate parallax offset
          vec2 offset = uMouse * uIntensity * depth;
          
          // Sample the image with offset
          vec2 uv = coverUv - offset;
          
          // Clamp to avoid edge repeating/wrapping
          uv = clamp(uv, 0.001, 0.999);
          
          gl_FragColor = texture2D(uImage, uv);
        }
      `,
    });

    // A simple plane to draw the texture on
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse movement handling
    let targetMouse = new THREE.Vector2(0, 0);
    let currentMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const bounds = containerRef.current.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      // Calculate mouse position relative to container (-1 to +1)
      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;
      
      targetMouse.x = (x - 0.5) * 2;
      targetMouse.y = -(y - 0.5) * 2; // Invert Y for WebGL
    };

    const handleMouseLeave = () => {
      // Reset to center smoothly when mouse leaves
      targetMouse.x = 0;
      targetMouse.y = 0;
    };

    // Use window events to capture mouse movement around the component better
    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    let animationFrameId: number;
    const render = () => {
      // Lerp mouse position for smooth movement
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.005;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.005;
      
      uniforms.uMouse.value.copy(currentMouse);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newRect = containerRef.current.getBoundingClientRect();
      if (newRect.width === 0 || newRect.height === 0) return;
      renderer.setSize(newRect.width, newRect.height);
      uniforms.uPlaneRes.value.set(newRect.width, newRect.height);
    };
    handleResize(); // initial set
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [imageSrc, depthSrc, intensity]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover"
      />
    </div>
  );
}
