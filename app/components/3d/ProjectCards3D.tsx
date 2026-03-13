"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

interface Card3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

function Card3D({ position = [0, 0, 0], rotation = [0, 0, 0], color = "#8b5cf6" }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <RoundedBox
        ref={meshRef}
        args={[2.5, 1.5, 0.1]}
        radius={0.1}
        smoothness={4}
        position={position}
        rotation={rotation}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.5}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </RoundedBox>
    </Float>
  );
}

function Scene({ primaryColor = "#8b5cf6" }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#ec4899" />
      
      <Card3D position={[-1.5, 0.5, 0]} rotation={[0.1, 0.3, 0]} color={primaryColor} />
      <Card3D position={[1.5, -0.3, -1]} rotation={[-0.1, -0.2, 0]} color="#ec4899" />
      <Card3D position={[0, 0, -2]} rotation={[0, 0.1, 0]} color="#06b6d4" />
    </>
  );
}

interface ProjectCards3DProps {
  primaryColor?: string;
}

export default function ProjectCards3D({ primaryColor }: ProjectCards3DProps) {
  return (
    <div className="h-[300px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Scene primaryColor={primaryColor} />
      </Canvas>
    </div>
  );
}
