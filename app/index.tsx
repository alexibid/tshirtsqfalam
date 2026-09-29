import { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useDesignLayers } from "../hooks/useDesignLayers";
import { Navigation } from "../components/ui/Navigation";
import { CornerModal } from "../components/ui/CornerModal";
import { GarmentSelector } from "../components/ui/GarmentSelector";
import { DesignAi } from "../components/ui/DesignAi";
import { ExamplesGallery } from "../components/ui/ExamplesGallery";
import { DraggableResizableDesign } from "../components/ui/DraggableResizableDesign";

import TshirtFront from "../assets/tshirt_mockup.svg";
import TshirtBack from "../assets/tshirt_mockup_back.svg";
import SweatshirtFront from "../assets/sweatshirt_mockup.svg";
import SweatshirtBack from "../assets/sweatshirt_mockup_back.svg";
import HoodieFront from "../assets/hoodie_mockup.svg";
import HoodieBack from "../assets/hoodie_mockup_back.svg";

const MAX_PREVIEW_WIDTH = 575;
const BASE_DESIGN_SIZE = 175;

const GARMENT_ASSETS = {
  tshirt: {
    front: TshirtFront,
    back: TshirtBack,
  },
  sweatshirt: {
    front: SweatshirtFront,
    back: SweatshirtBack,
  },
  hoodie: {
    front: HoodieFront,
    back: HoodieBack,
  }
};

export default function Page() {
  const { width } = useWindowDimensions();
  const [activeModal, setActiveModal] = useState<"select" | "create" | "order" | "gallery" | null>(null);
  
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedGarment, setSelectedGarment] = useState<"tshirt" | "sweatshirt" | "hoodie">("tshirt");
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");

  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    isGenerating,
    addLayer,
    lockLayer,
    generateDesign,
    selectLayerImage
  } = useDesignLayers(currentSide);

  const effectiveWidth = Math.min(width, MAX_PREVIEW_WIDTH);
  const responsiveDesignSize = (effectiveWidth / MAX_PREVIEW_WIDTH) * BASE_DESIGN_SIZE;

  const CurrentGarment = GARMENT_ASSETS[selectedGarment][currentSide];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "T'Shirts Q'Falam - Crie a sua T-shirt Personalizada com AI";
    }
  }, []);

  return (
    <View className="page flex-1 bg-white items-center relative overflow-hidden">
      <View className="page__container flex-1 w-full h-full max-w-screen-md relative">
        <Navigation 
          onSelectPress={() => setActiveModal("select")}
          onLogoPress={() => setActiveModal("gallery")}
          onCreatePress={() => setActiveModal("create")}
          onCheckoutPress={() => setActiveModal("order")}
          highlightedCorner={null}
          selectedGarment={selectedGarment}
          selectedColor={selectedColor}
        />

        <View className="page__preview flex-1 w-full items-center justify-center z-0 pt-32 pb-24 pointer-events-none">
          <View className="page__preview-content w-full flex-1 items-center justify-center relative pointer-events-auto max-w-[575px] p-2">
            <View className="page__controls absolute top-4 z-50 pointer-events-auto flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={() => setCurrentSide(prev => prev === 'front' ? 'back' : 'front')}
                className="page__toggle bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200 flex-row items-center gap-2"
              >
                <View className="page__toggle-icon w-4 h-4 items-center justify-center">
                  {(() => {
                    const TargetIcon = GARMENT_ASSETS[selectedGarment][currentSide === 'front' ? 'back' : 'front'];
                    return <TargetIcon width={16} height={16} color="#4b5563" />;
                  })()}
                </View>
                <Text className="page__toggle-text text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                  {currentSide === 'front' ? 'COSTAS' : 'FRENTE'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={addLayer}
                className="page__add-btn bg-black px-4 py-2 rounded-full shadow-sm flex-row items-center gap-2 active:scale-95 transition-transform"
              >
                <Text className="page__add-symbol text-white text-lg font-light leading-none mb-[2px]">+</Text>
                <Text className="page__add-text text-[10px] font-bold text-white uppercase tracking-widest">
                  Desenho
                </Text>
              </TouchableOpacity>
            </View>

            <View className="relative w-full h-full items-center justify-center">
              <CurrentGarment 
                width="100%" 
                height="100%" 
                style={{ position: 'absolute', overflow: 'visible' }}
                color={selectedColor}
              />
              
              {layers.filter(l => l.side === currentSide).map((layer) => (
                <DraggableResizableDesign 
                  key={layer.id}
                  initialSize={responsiveDesignSize}
                  label={layer.label}
                  isPlacing={layer.isPlacing}
                  isSelected={activeLayerId === layer.id}
                  onSelect={() => setActiveLayerId(layer.id)}
                  onLock={() => lockLayer(layer.id)}
                >
                  {layer.image ? (
                    <Image 
                      source={layer.image} 
                      className="page__design-image w-full h-full"
                      style={{ width: '100%', height: '100%', resizeMode: 'contain' }} 
                    />
                  ) : (
                    <View className="page__design-placeholder border-2 border-dashed border-gray-400/50 rounded-lg w-full h-full items-center justify-center bg-white/10 backdrop-blur-sm">
                      <Text className="page__design-text text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60 text-center px-2">
                        {layer.isPlacing ? "Posiciona e Toca 2x" : "Área Vazia - Toca para editar"}
                      </Text>
                    </View>
                  )}
                </DraggableResizableDesign>
              ))}
            </View>
          </View>
        </View>

        <View className="page__footer absolute bottom-6 left-0 right-0 items-center z-40" style={{ pointerEvents: 'box-none' }}>
          <View className="page__footer-links flex-row gap-6 opacity-40">
            <TouchableOpacity onPress={() => alert("Sobre")}>
              <Text className="page__footer-link text-[10px] font-bold uppercase tracking-widest">Sobre</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert("Termos")}>
              <Text className="page__footer-link text-[10px] font-bold uppercase tracking-widest">Termos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert("Privacidade")}>
              <Text className="page__footer-link text-[10px] font-bold uppercase tracking-widest">Privacidade</Text>
            </TouchableOpacity>
          </View>
          
          <View className="page__footer-copyright flex-row items-center gap-2 mt-4">
            <Image 
              source={require("../assets/logo.png")} 
              style={{ width: 16, height: 16, opacity: 0.6 }}
              resizeMode="contain" 
            />
            <Text className="text-xs text-gray-500 font-medium">
              {new Date().getFullYear()}
            </Text>
          </View>

          <Text 
            accessibilityRole="header" 
            aria-level={1}
            className="page__footer-h1 text-xs text-gray-900 font-bold mt-1 text-center px-4"
          >
            T'Shirts Q'Falam - Crie a sua T-shirt Personalizada com AI
          </Text>
        </View>

        <CornerModal
          visible={activeModal === "select"}
          onClose={() => setActiveModal(null)}
          position="top-right"
          title="Selecionar Artigo"
        >
          <GarmentSelector 
            selectedGarment={selectedGarment}
            onSelectGarment={setSelectedGarment}
            selectedColor={selectedColor} 
            onSelectColor={setSelectedColor} 
          />
        </CornerModal>

        <CornerModal
          visible={activeModal === "gallery"}
          onClose={() => setActiveModal(null)}
          position="top-left"
          title="Exemplos"
        >
          <ExamplesGallery 
            onSelect={(img) => {
              selectLayerImage(img);
              setActiveModal(null);
            }} 
          />
        </CornerModal>

        <CornerModal
          visible={activeModal === "create"}
          onClose={() => setActiveModal(null)}
          position="bottom-left"
          title="Criar Desenho"
        >
          <DesignAi 
            onUpload={() => console.log("Upload pressed")} 
            onGenerate={generateDesign}
            isGenerating={isGenerating}
            layers={layers.filter(l => l.side === currentSide)}
            activeLayerId={activeLayerId}
            onSelectLayer={setActiveLayerId}
          />
        </CornerModal>

        <CornerModal
          visible={activeModal === "order"}
          onClose={() => setActiveModal(null)}
          position="bottom-right"
          title="O Seu Carrinho"
        >
          <View className="page__cart-empty items-center justify-center py-8">
            <Text className="page__cart-text text-gray-400">O seu carrinho está vazio.</Text>
          </View>
        </CornerModal>
      </View>
    </View>
  );
}
