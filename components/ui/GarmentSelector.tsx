import { View, TouchableOpacity, Text } from "react-native";
import { ColorPicker } from "./ColorPicker";

import TshirtFront from "../../assets/tshirt_mockup.svg";
import SweatshirtFront from "../../assets/sweatshirt_mockup.svg";
import HoodieFront from "../../assets/hoodie_mockup.svg";

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
  
  const garments: { type: GarmentType; label: string; component: React.FC<any> }[] = [
    { type: "tshirt", label: "T-Shirt", component: TshirtFront },
    { type: "sweatshirt", label: "Sweatshirt", component: SweatshirtFront }, 
    { type: "hoodie", label: "Hoodie", component: HoodieFront },
  ];

  return (
    <View className="selector flex-col gap-6">
      <View className="selector__type-section w-full flex-1 items-center justify-center">
        <Text className="selector__label text-gray-500 font-medium mb-3">Selecionar Tipo</Text>
        <View className="selector__list flex-row justify-center gap-4">
          {garments.map((item) => (
            <TouchableOpacity 
              key={item.type}
              onPress={() => onSelectGarment(item.type)}
              className={`selector__item w-[100px] h-[100px] items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden ${
                selectedGarment === item.type 
                  ? "selector__item--active border-black bg-gray-50 bg-opacity-50" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <View className="selector__indicator absolute top-2 right-2 z-10">
                <View className={`w-4 h-4 rounded-full border border-gray-300 items-center justify-center bg-white ${selectedGarment === item.type ? "border-black" : ""}`}>
                  {selectedGarment === item.type && <View className="w-2 h-2 rounded-full bg-black" />}
                </View>
              </View>
              
              <item.component 
                width="100%" 
                height={60} 
                style={{ marginBottom: 4, opacity: selectedGarment === item.type ? 1 : 0.6 }} 
                color={selectedColor}
              />
              <Text className={`selector__item-label text-[10px] font-semibold ${selectedGarment === item.type ? "text-black" : "text-gray-400"}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="selector__colors border-t border-gray-100 pt-6">
        <ColorPicker selectedColor={selectedColor} onSelectColor={onSelectColor} />
      </View>
    </View>
  );
}
