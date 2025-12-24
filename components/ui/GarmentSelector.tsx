
import { View, TouchableOpacity, Text, Image } from "react-native";
import { ColorPicker } from "./ColorPicker";

export type GarmentType = "tshirt" | "sweatshirt" | "hoodie";

interface GarmentSelectorProps {
  selectedGarment: GarmentType;
  onSelectGarment: (garment: GarmentType) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export function GarmentSelector({ 
  selectedGarment, 
  onSelectGarment,
  selectedColor,
  onSelectColor 
}: GarmentSelectorProps) {
  
  const garments: { type: GarmentType; label: string; image: any }[] = [
    { type: "tshirt", label: "T-Shirt", image: require("../../assets/tshirt_mockup.png") },
    { type: "sweatshirt", label: "Sweatshirt", image: require("../../assets/sweatshirt_mockup.png") }, 
    { type: "hoodie", label: "Hoodie", image: require("../../assets/hoodie_mockup.png") },
  ];

  return (
    <View className="flex-col gap-6">
      {/* Garment Type Selection */}
      <View className="w-full flex-1 items-center justify-center">
        <Text className="text-gray-500 font-medium mb-3">Selecionar Tipo</Text>
        <View className="flex-row justify-center gap-4">
          {garments.map((item) => (
            <TouchableOpacity 
              key={item.type}
              onPress={() => onSelectGarment(item.type)}
              className={`w-[100px] h-[100px] items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden ${
                selectedGarment === item.type 
                  ? "border-black bg-gray-50 bg-opacity-50" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              {/* Custom Radio Button Indicator - Top Right */}
              <View className="absolute top-2 right-2 z-10">
                <View className={`w-4 h-4 rounded-full border border-gray-300 items-center justify-center bg-white ${selectedGarment === item.type ? "border-black" : ""}`}>
                  {selectedGarment === item.type && <View className="w-2 h-2 rounded-full bg-black" />}
                </View>
              </View>
              
              <Image 
                source={item.image} 
                className="mb-1"
                style={{ width: '100%', height: 60, resizeMode: 'contain', opacity: selectedGarment === item.type ? 1 : 0.6 }} 
              />
              <Text className={`text-[10px] font-semibold ${selectedGarment === item.type ? "text-black" : "text-gray-400"}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Color Selection (Existing Component) */}
      <View className="border-t border-gray-100 pt-6">
        <ColorPicker selectedColor={selectedColor} onSelectColor={onSelectColor} />
      </View>
    </View>
  );
}
