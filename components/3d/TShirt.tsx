import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Decal } from "@react-three/drei";
import { Mesh, MeshStandardMaterial } from "three";

interface TShirtProps {
  textureUrl?: string | null;
  color?: string;
}

export function TShirt({ textureUrl, color = "#ffffff" }: TShirtProps) {
  // TODO: Replace with actual GLB path when available
  // const { nodes, materials } = useGLTF("/assets/tshirt.glb");
  
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.5} position={[0, -0.5, 0]}>
      {/* Placeholder: Box until GLB is ready */}
      <boxGeometry args={[1, 1.5, 0.5]} />
      {/* If texture is present, use it (green mock), else use selected color */}
      <meshStandardMaterial color={textureUrl ? "#39ff14" : color} />
      
      {/* 
        This is where the Dynamic Texture from AI will be applied 
        <Decal ... /> 
      */}
    </mesh>
  );
}
