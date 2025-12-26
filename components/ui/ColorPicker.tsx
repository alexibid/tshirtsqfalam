
import { View, TouchableOpacity, Text } from "react-native";

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  const colors = [
    "#ffffff", // White
    "#000000", // Black
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#22c55e", // Green
    "#eab308", // Yellow
    "#a855f7", // Purple
  ];

  return (
    <View className="color-picker flex-col gap-4">
      <Text className="color-picker__title text-gray-500 font-medium mb-1 text-center">Selecionar Cor Base</Text>
      <View className="color-picker__list flex-row flex-wrap gap-3">
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => onSelectColor(color)}
            className={`color-picker__swatch w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-black scale-110' : 'border-gray-200'} shadow-sm`}
            style={{ backgroundColor: color }}
          />
        ))}
      </View>
    </View>
  );
}
