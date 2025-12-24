import { View, Image, ScrollView, Text, TouchableOpacity } from "react-native";

const examples = [
  require("../../assets/examples/ex1.png"),
  require("../../assets/examples/ex2.png"),
  require("../../assets/examples/ex3.png"),
  require("../../assets/examples/ex4.png"),
  // Add more as needed or duplicate for demo
  require("../../assets/examples/ex1.png"),
  require("../../assets/examples/ex2.png"),
];

interface ExamplesGalleryProps {
  onSelect?: (image: any) => void;
}

export function ExamplesGallery({ onSelect }: ExamplesGalleryProps) {
  return (
    <View className="gallery flex-1 w-full">
      <Text className="gallery__title text-gray-500 font-medium mb-4 text-sm uppercase tracking-wide text-center">
        Galeria de Exemplos
      </Text>
      
      <ScrollView 
        className="gallery__scroll flex-1 w-full"
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gallery__grid flex-row flex-wrap justify-between gap-y-4">
           {examples.map((img, index) => (
             <TouchableOpacity 
                key={index} 
                className="gallery__item w-[48%] aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                onPress={() => onSelect && onSelect(img)}
             >
               <Image 
                 source={img} 
                 className="gallery__image w-full h-full" 
                 style={{ resizeMode: 'contain' }}
               />
             </TouchableOpacity>
           ))}
        </View>
      </ScrollView>
    </View>
  );
}
