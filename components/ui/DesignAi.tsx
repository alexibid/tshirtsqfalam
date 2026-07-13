import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Modal } from "react-native";
import { Upload, Wand2, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react-native";
import { DesignLayer } from "../../types";

interface DesignAiProps {
  onUpload: () => void;
  onGenerate: (prompt: string) => void;
  isGenerating?: boolean;
  layers: DesignLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
}

export function DesignAi({ 
  onUpload, 
  onGenerate, 
  isGenerating = false,
  layers = [],
  activeLayerId,
  onSelectLayer,
}: DesignAiProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeLayer = layers.find(l => l.id === activeLayerId);
  const [prompt, setPrompt] = useState(activeLayer?.originalPrompt || "");

  useEffect(() => {
    setPrompt(activeLayer?.originalPrompt || "");
  }, [activeLayerId, activeLayer]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt);
  };

  return (
    <View className="generator flex-1 w-full relative bg-white">
      <Modal 
        visible={isExpanded && !!activeLayer} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => setIsExpanded(false)}
      >
        <View className="generator__modal-backdrop flex-1 bg-black/80" style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
          <View className="generator__modal-content flex-1 bg-white rounded-[30px] overflow-hidden relative items-center justify-center">
            {activeLayer?.image && (
              <Image 
                source={activeLayer.image} 
                className="w-full h-full" 
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            )}

            <TouchableOpacity 
              onPress={() => setIsExpanded(false)}
              className="generator__zoom-btn absolute top-6 right-6 z-50 bg-black/5 p-2 rounded-full backdrop-blur-md active:bg-black/10 shadow-sm border border-black/5"
            >
              <Minimize2 size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView 
        className="generator__scroll-container w-full flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="generator__carousel w-full">
          <Text className="generator__carousel-title text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 pl-1">
            Seus Designs
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="generator__scroll w-full pl-1 h-20">
            {layers.map((layer) => (
              <TouchableOpacity 
                key={layer.id}
                onPress={() => onSelectLayer(layer.id)}
                className={`generator__item mr-3 w-16 h-16 rounded-xl border-2 items-center justify-center relative overflow-hidden bg-white shadow-sm ${activeLayerId === layer.id ? 'border-black' : 'border-gray-100'}`}
              >
                {layer.image ? (
                  <Image 
                    source={layer.image} 
                    className="generator__item-image w-full h-full" 
                    style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                  />
                ) : (
                  <Text className="generator__item-label text-xs font-bold text-gray-300">
                    {layer.label.replace("Desenho ", "#")}
                  </Text>
                )}
                
                {activeLayerId === layer.id && (
                  <View className="generator__indicator absolute bottom-0 w-full h-1 bg-black" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="generator__preview-area w-full items-center">
          <View className="generator__preview-box w-64 h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative items-center justify-center shadow-sm">
            {activeLayer && activeLayer.image && (
              <TouchableOpacity 
                onPress={() => setIsExpanded(true)}
                className="generator__zoom-btn absolute top-3 right-3 z-50 bg-white/50 p-2 rounded-full backdrop-blur-md active:bg-white/80 transition-colors"
              >
                <Maximize2 size={16} color="black" />
              </TouchableOpacity>
            )}

            {isGenerating && activeLayerId === activeLayer?.id ? (
              <ActivityIndicator size="large" color="#000000" />
            ) : activeLayer?.image ? (
              <Image 
                source={activeLayer.image} 
                className="generator__image w-full h-full" 
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            ) : (
              <View className="generator__placeholder items-center justify-center opacity-40">
                <ImageIcon size={32} color="#9ca3af" />
                <Text className="generator__placeholder-text text-gray-400 font-medium mt-2 text-xs text-center px-4">
                  {activeLayer?.label || "Selecione um design"}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="generator__input-section w-full max-w-sm">
          <Text className="generator__label text-gray-500 font-bold mb-2 text-xs uppercase tracking-wide text-center">
            {activeLayer?.label || "Descrição"}
          </Text>
          <TextInput 
            className="generator__textarea w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm leading-5 h-32 text-center"
            placeholder={activeLayer ? `Descreva o ${activeLayer.label}...` : "Selecione um design para editar"}
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={prompt} 
            onChangeText={setPrompt}
            editable={!!activeLayer}
          />
        </View>

        <View className="generator__actions w-full max-w-sm gap-3 pb-8">
          <TouchableOpacity 
            className={`generator__button-main w-full h-12 bg-black rounded-full items-center justify-center flex-row gap-2 shadow-lg shadow-black/20 active:scale-95 transition-transform ${(!prompt.trim() || !activeLayer) ? 'opacity-50' : ''}`}
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating || !activeLayer}
          >
            <Wand2 color="white" size={18} />
            <Text className="text-white font-bold text-base">
              {isGenerating ? "A Gerar..." : "Gerar Design"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onUpload}
            className="generator__button-upload w-full py-2 items-center justify-center flex-row gap-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <Upload color="#000" size={14} />
            <Text className="text-black font-medium text-xs underline">Ou carregar imagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
