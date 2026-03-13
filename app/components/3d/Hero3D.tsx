"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

interface FloatingSphereProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
  scale?: number;
}

function FloatingSphere({
  position,
  color,
  speed = 1,
  distort = 0.3,
  scale = 1,
}: FloatingSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField({ count = 500, color = "#8b5cf6" }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.02} color={color} transparent opacity={0.6} />
    </points>
  );
}

function GridFloor() {
  return (
    <gridHelper
      args={[30, 30, "#8b5cf6", "#1a1a2e"]}
      position={[0, -3, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

interface Scene3DProps {
  primaryColor?: string;
  sceneStyle?: "minimal" | "futuristic" | "developer" | "creative";
}

function Scene({ primaryColor = "#8b5cf6", sceneStyle = "futuristic" }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={primaryColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

      {/* Main sphere */}
      <FloatingSphere
        position={[0, 0, 0]}
        color={primaryColor}
        distort={0.4}
        scale={1.5}
      />

      {/* Accent spheres */}
      <FloatingSphere
        position={[-3, 1, -2]}
        color="#ec4899"
        scale={0.4}
        speed={0.8}
      />
      <FloatingSphere
        position={[3, -1, -1]}
        color="#06b6d4"
        scale={0.3}
        speed={1.2}
      />
      <FloatingSphere
        position={[2, 2, -3]}
        color="#10b981"
        scale={0.25}
        speed={0.6}
      />

      {/* Background elements based on scene style */}
      {(sceneStyle === "futuristic" || sceneStyle === "developer") && (
        <>
          <Stars
            radius={50}
            depth={50}
            count={1000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          <GridFloor />
        </>
      )}

      {sceneStyle === "creative" && (
        <ParticleField count={800} color={primaryColor} />
      )}

      {sceneStyle === "minimal" && (
        <Stars
          radius={100}
          depth={50}
          count={300}
          factor={2}
          saturation={0}
          fade
          speed={0.2}
        />
      )}
    </>
  );
}

export default function Hero3D({ primaryColor, sceneStyle }: Scene3DProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <Scene primaryColor={primaryColor} sceneStyle={sceneStyle} />
      </Canvas>
    </div>
  );
}
