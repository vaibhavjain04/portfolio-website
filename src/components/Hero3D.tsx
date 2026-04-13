import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere({ position, color, speed, distort, scale }: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#38bdf8" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function FloatingRing({ position, rotation, color }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = rotation[0] + state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh ref={ref} position={position} rotation={rotation}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} metalness={1} roughness={0.1} />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#38bdf8" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#a78bfa" />

        <AnimatedSphere position={[-3, 1.5, -2]} color="#38bdf8" speed={1.2} distort={0.4} scale={0.8} />
        <AnimatedSphere position={[3.5, -1, -3]} color="#a78bfa" speed={0.8} distort={0.6} scale={1.1} />
        <AnimatedSphere position={[0, -2.5, -4]} color="#22d3ee" speed={1} distort={0.3} scale={0.6} />
        <AnimatedSphere position={[-2, -1.5, -1]} color="#818cf8" speed={1.5} distort={0.5} scale={0.4} />

        <FloatingRing position={[2, 2, -2]} rotation={[0.5, 0, 0]} color="#38bdf8" />
        <FloatingRing position={[-2.5, -0.5, -3]} rotation={[1, 0.5, 0]} color="#a78bfa" />

        <ParticleField />
        <Stars radius={50} depth={50} count={1000} factor={3} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
