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
    <View className="uploader flex-1 w-full items-center justify-center">
        <View className="uploader__container flex-col w-full max-w-sm gap-6 items-center">
          {/* 1. Preview Area (Top) */}
          <View className="uploader__preview-area">
             <View className="uploader__preview-box w-[180px] h-[180px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative items-center justify-center shadow-sm">
                {isGenerating ? (
                  <ActivityIndicator size="large" color="#000000" />
                ) : previewImage ? (
                  <Image 
                    source={previewImage} 
                    className="uploader__image w-full h-full" 
                    style={{ resizeMode: 'contain' }}
                  />
                ) : (
                  <View className="uploader__placeholder items-center justify-center opacity-40">
                    <ImageIcon size={32} color="#9ca3af" />
                    <Text className="text-gray-400 font-medium mt-2 text-xs text-center px-4">
                      Preview
                    </Text>
                  </View>
                )}
                
                {/* Style Tag Indicator */}
                <View className="uploader__tag absolute top-2 right-2 bg-black/5 px-2 py-1 rounded-md">
                   <Text className="text-[8px] font-bold text-gray-500 uppercase">Vector</Text>
                </View>
             </View>
          </View>

          {/* 2. Prompt Input (Middle) */}
          <View className="uploader__input-section w-full">
            <Text className="uploader__label text-gray-500 font-bold mb-2 text-xs uppercase tracking-wide text-center">Descrição do Design</Text>
            <TextInput 
                className="uploader__textarea w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm leading-5 h-32 text-center"
                placeholder="Ex: Um robô a comer pizza..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={prompt}
                onChangeText={setPrompt}
            />
          </View>

          {/* 3. Actions */}
          <View className="uploader__actions w-full gap-3">
            <TouchableOpacity 
              className={`uploader__button-generate w-full h-12 bg-black rounded-full items-center justify-center flex-row gap-2 shadow-lg shadow-black/20 ${!prompt.trim() ? 'opacity-50' : ''}`}
              onPress={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
            >
                <Wand2 color="white" size={18} />
                <Text className="text-white font-bold text-base">
                  {isGenerating ? "A Gerar..." : "Gerar Design"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onUpload}
              className="uploader__button-upload w-full py-2 items-center justify-center flex-row gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <Upload color="#000" size={14} />
              <Text className="text-black font-medium text-xs underline">Ou carregar imagem</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
}
