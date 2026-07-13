import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

interface TShirtProps {
  textureUrl?: string | null;
  color?: string;
}

export function TShirt({ textureUrl, color = "#ffffff" }: TShirtProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.5} position={[0, -0.5, 0]}>
      <boxGeometry args={[1, 1.5, 0.5]} />
      <meshStandardMaterial color={textureUrl ? "#39ff14" : color} />
    </mesh>
  );
}
