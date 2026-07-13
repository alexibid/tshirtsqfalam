import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { View } from "react-native";
import { TShirt } from "./TShirt";

interface SceneProps {
  textureUrl: string | null;
  shirtColor?: string;
}

export function Scene({ textureUrl, shirtColor = "#ffffff" }: SceneProps) {
  return (
    <View className="flex-1 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ backgroundColor: "#f9fafb" }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <TShirt textureUrl={textureUrl} color={shirtColor} />
        
        <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        <Environment preset="city" />
        <OrbitControls makeDefault enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </View>
  );
}
