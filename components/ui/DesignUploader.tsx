import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Upload, Wand2, Image as ImageIcon } from "lucide-react-native";

interface DesignUploaderProps {
  onUpload: () => void;
  onGenerate: (prompt: string) => void;
  isGenerating?: boolean;
  previewImage?: any;
}

export function DesignUploader({ onUpload, onGenerate, isGenerating = false, previewImage }: DesignUploaderProps) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const enhancedPrompt = `${prompt}, vector art, flat design, simple shapes, clean lines, no gradients, white background, high contrast, screen print style`;
    onGenerate(enhancedPrompt);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full"
    >
      <ScrollView 
        className="flex-1 w-full"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col w-full h-full gap-6">
          {/* 1. Preview Area (Top) - Restricted Size */}
          <View className="self-center">
             <View className="w-[200px] h-[200px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative items-center justify-center shadow-sm">
                {isGenerating ? (
                  <ActivityIndicator size="large" color="#000000" />
                ) : previewImage ? (
                  <Image 
                    source={previewImage} 
                    className="w-full h-full" 
                    style={{ resizeMode: 'contain' }}
                  />
                ) : (
                  <View className="items-center justify-center opacity-40">
                    <ImageIcon size={32} color="#9ca3af" />
                    <Text className="text-gray-400 font-medium mt-2 text-xs text-center px-4">
                      Preview (200px)
                    </Text>
                  </View>
                )}
                
                {/* Style Tag Indicator */}
                <View className="absolute top-2 right-2 bg-black/5 px-2 py-1 rounded-md">
                   <Text className="text-[8px] font-bold text-gray-500 uppercase">Vector</Text>
                </View>
             </View>
          </View>

          {/* 2. Prompt Input (Middle) - Main Focus */}
          <View className="w-full flex-1">
            <Text className="text-gray-500 font-medium mb-2 text-sm uppercase tracking-wide">Descrição do Design</Text>
            <TextInput 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base leading-6 h-40"
                placeholder="Ex: Um robô a comer pizza, estilo vetorial plano..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={prompt}
                onChangeText={setPrompt}
                style={{ minHeight: 160 }} // Increased height for importance
            />
            <Text className="text-xs text-gray-400 mt-2 text-right">
               Otimizado para impressão
            </Text>
          </View>

          {/* 3. Actions */}
          <View className="gap-3 mt-auto pb-4">
            <TouchableOpacity 
              className={`w-full h-14 bg-black rounded-full items-center justify-center flex-row gap-2 shadow-lg shadow-black/20 ${!prompt.trim() ? 'opacity-50' : ''}`}
              onPress={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
            >
                <Wand2 color="white" size={20} />
                <Text className="text-white font-bold text-lg">
                  {isGenerating ? "A Gerar..." : "Gerar Design"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onUpload}
              className="w-full py-3 items-center justify-center flex-row gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <Upload color="#000" size={16} />
              <Text className="text-black font-medium text-sm underline">Ou carregar a sua própria imagem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
