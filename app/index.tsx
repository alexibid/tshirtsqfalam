import { useState } from "react";
import { View, Image, Text } from "react-native";
import { Navigation } from "../components/ui/Navigation";
import { CornerModal } from "../components/ui/CornerModal";
import { ColorPicker } from "../components/ui/ColorPicker";
import { GarmentSelector } from "../components/ui/GarmentSelector";
import { DesignUploader } from "../components/ui/DesignUploader";
import { ExamplesGallery } from "../components/ui/ExamplesGallery";

export default function Page() {
  const [activeModal, setActiveModal] = useState<"account" | "select" | "create" | "order" | "gallery" | null>(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedGarment, setSelectedGarment] = useState<"tshirt" | "sweatshirt" | "hoodie">("tshirt");
  
  // Design Generation State
  const [generatedImage, setGeneratedImage] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClose = () => setActiveModal(null);

  const handleGenerateDesign = (prompt: string) => {
    setIsGenerating(true);
    console.log("Generating design with prompt:", prompt);
    
    // Mock API Call - Replace with Nano Banana Logic later
    setTimeout(() => {
      // For demo, we'll just use the logo or a placeholder as the "generated" design
      setGeneratedImage(require("../assets/logo.png")); 
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-white items-center relative">
      <View className="flex-1 w-full h-full max-w-screen-md relative">
        
        {/* Footer */}
        <View className="absolute bottom-6 left-0 right-0 items-center z-40" style={{ marginBottom: 25 }}>
          <View className="flex-row gap-4">
             <Text className="text-xs font-medium text-gray-500">QUEM SOMOS</Text>
             <Text className="text-xs font-medium text-gray-500">•</Text>
             <Text className="text-xs font-medium text-gray-500">DATA</Text>
             <Text className="text-xs font-medium text-gray-500">•</Text>
             <Text className="text-xs font-medium text-gray-500">ONDE ESTAMOS</Text>
          </View>
        </View>

        {/* Main Content Area - Garment Preview */}
        <View className="absolute inset-0 items-center justify-center z-0 pointer-events-none">
          <View className="w-[80%] h-[60%] items-center justify-center relative">
            <Image 
              source={
                selectedGarment === 'tshirt' ? require("../assets/tshirt_mockup.png") :
                selectedGarment === 'sweatshirt' ? require("../assets/sweatshirt_mockup.png") :
                require("../assets/hoodie_mockup.png")
              }
              style={{ 
                width: '100%', 
                height: '100%', 
                resizeMode: 'contain',
                tintColor: selectedColor !== "#ffffff" ? selectedColor : undefined
              }}
            />
            {/* Design Placeholder Overlay */}
            <View className="absolute w-32 h-32 items-center justify-center">
               {generatedImage ? (
                 <Image 
                   source={generatedImage} 
                   style={{ width: 120, height: 120, resizeMode: 'contain' }} 
                 />
               ) : (
                 <View className="border-2 border-dashed border-gray-300 rounded-lg w-full h-full items-center justify-center bg-transparent opacity-50">
                    <Text className="text-xs text-gray-400 font-medium opacity-0">Área de Design</Text>
                 </View>
               )}
            </View>
          </View>
        </View>


        <Navigation 
          onAccountPress={() => setActiveModal("account")}
          onSelectPress={() => setActiveModal("select")}
          onLogoPress={() => setActiveModal("gallery")}
          onCreatePress={() => setActiveModal("create")}
          onCheckoutPress={() => setActiveModal("order")}
          highlightedCorner={null}
        />

        {/* Account Modal (Top Left) */}
        <CornerModal
          visible={activeModal === "account"}
          onClose={handleClose}
          position="top-left"
          title="Conta"
        >
          <Text className="text-gray-600 mb-4">Inicie sessão ou registe-se para guardar os seus designs.</Text>
          <View className="bg-gray-100 p-4 rounded-lg">
             <Text className="text-gray-400 text-center">Placeholder do Formulário de Login</Text>
          </View>
        </CornerModal>

        {/* Select Modal (Top Right) */}
        <CornerModal
          visible={activeModal === "select"}
          onClose={handleClose}
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

        {/* Gallery Modal (Center/Logo) - using top-left origin for now as discussed */}
        <CornerModal
          visible={activeModal === "gallery"}
          onClose={handleClose}
          position="top-left" // Reusing top-left since the content is centrally strictly constrained anyway
          title="Exemplos"
        >
          <ExamplesGallery 
            onSelect={(img) => {
              setGeneratedImage(img);
              setActiveModal(null);
            }} 
          />
        </CornerModal>

        {/* Create Modal (Bottom Left) */}
        <CornerModal
          visible={activeModal === "create"}
          onClose={handleClose}
          position="bottom-left"
          title="Criar Design"
        >
          <DesignUploader 
            onUpload={() => console.log("Upload pressed")} 
            onGenerate={handleGenerateDesign}
            isGenerating={isGenerating}
            previewImage={generatedImage}
          />
        </CornerModal>

        {/* Order Modal (Bottom Right) */}
        <CornerModal
          visible={activeModal === "order"}
          onClose={handleClose}
          position="bottom-right"
          title="O Seu Carrinho"
        >
          <View className="items-center justify-center py-8">
            <Text className="text-gray-400">O seu carrinho está vazio.</Text>
          </View>
        </CornerModal>
      </View>
    </View>
  );
}
