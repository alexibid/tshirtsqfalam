import { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Navigation } from "../components/ui/Navigation";
import { CornerModal } from "../components/ui/CornerModal";
import { ColorPicker } from "../components/ui/ColorPicker";
import { GarmentSelector } from "../components/ui/GarmentSelector";
import { DesignUploader } from "../components/ui/DesignUploader";
import { ExamplesGallery } from "../components/ui/ExamplesGallery";
import { LogOut } from "lucide-react-native";

import TshirtFront from "../assets/tshirt_mockup.svg";
import TshirtBack from "../assets/tshirt_mockup_back.svg";
import SweatshirtFront from "../assets/sweatshirt_mockup.svg";
import SweatshirtBack from "../assets/sweatshirt_mockup_back.svg";
import HoodieFront from "../assets/hoodie_mockup.svg";
import HoodieBack from "../assets/hoodie_mockup_back.svg";

import { DraggableResizableDesign } from "../components/ui/DraggableResizableDesign";


// Design Layer Interface
interface DesignLayer {
  id: string; 
  side: "front" | "back";
  image: any | null;
  isPlacing: boolean; // "Ghost Mode"
  label: string;
}

export default function Page() {
  // Responsive Design Logic
  const { width } = useWindowDimensions();
  const MAX_PREVIEW_WIDTH = 575;
  const BASE_DESIGN_SIZE = 175;
  
  // Calculate responsive size: (Current Width / Max Width) * Base Size
  const effectiveWidth = Math.min(width, MAX_PREVIEW_WIDTH);
  const responsiveDesignSize = (effectiveWidth / MAX_PREVIEW_WIDTH) * BASE_DESIGN_SIZE;

  const [activeModal, setActiveModal] = useState<"account" | "select" | "create" | "order" | "gallery" | null>(null);
  // Auth State
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  // Design State - Multi-Layer System
  const [layers, setLayers] = useState<DesignLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedGarment, setSelectedGarment] = useState<"tshirt" | "sweatshirt" | "hoodie">("tshirt");
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");

  // Garment Assets
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

  const CurrentGarment = GARMENT_ASSETS[selectedGarment][currentSide];

  // Helper to close modals
  const handleClose = () => setActiveModal(null);

  // Auth Handlers
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error logging in with Google:", error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveModal(null);
  };

  // Auto-init "Design 1" on mount if empty
  useEffect(() => {
      // Only if truly empty to avoid resetting on edits
      if (layers.length === 0) {
          const newId = Date.now().toString();
          setLayers([{
              id: newId,
              side: 'front',
              image: null,
              isPlacing: false, // Initial one is fixed? Or ghost? user: "start with design 1". Fixed is safer for initial state.
              label: "Desenho 1"
          }]);
          setActiveLayerId(newId);
      }
  }, []); // Run once

  // ... (Auth handlers remain)

  // Force Title Match
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "T'Shirts Q'Falam - Crie a sua T-shirt Personalizada com AI";
    }
  }, []);

  // Helper: Create new layer
  const handleAddLayer = () => {
    const newId = Date.now().toString();
    const countOnSide = layers.filter(l => l.side === currentSide).length;
    
    // Auto-select the new layer
    setActiveLayerId(newId);
    
    setLayers(prev => [...prev, {
      id: newId,
      side: currentSide,
      image: null,
      isPlacing: false, // Start Fixed (consistent with Design 1)
      label: `Desenho ${countOnSide + 1}`
    }]);
  };

  // Helper: Lock placement
  const handleLockLayer = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, isPlacing: false } : l));
  };
  
  // Helper: Delete layer (optional, maybe long press later)
  const handleDeleteLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    if (activeLayerId === id) setActiveLayerId(null);
  }

  const handleGenerateDesign = (prompt: string) => {
    setIsGenerating(true);
    console.log("Generating design with prompt:", prompt);
    
    // If no active layer, create one first? Or fail? 
    // Let's create one if none exists for this side
    let targetId = activeLayerId;
    if (!targetId) {
       // Logic to auto-create? For now let's assume user must select/add one, 
       // OR we auto-create a layer if empty. Let's auto-create for better UX.
       const newId = Date.now().toString();
       const countOnSide = layers.filter(l => l.side === currentSide).length;
       const newLayer: DesignLayer = {
           id: newId,
           side: currentSide, 
           image: null, 
           isPlacing: false, // If generated, just place it fixed? Or allow moving?
           label: `Desenho ${countOnSide + 1}`
       };
       setLayers(prev => [...prev, newLayer]);
       targetId = newId;
       setActiveLayerId(newId);
    }

    // Mock API Call
    setTimeout(() => {
      const mockImage = require("../assets/logo.png");
      setLayers(prev => prev.map(l => l.id === targetId ? { ...l, image: mockImage } : l));
      setIsGenerating(false);
      // Close modal if open?
      // setActiveModal(null);  <-- User requested to keep open
    }, 2000);
  };

  return (
      <View className="page flex-1 bg-white items-center relative overflow-hidden">
      <View className="page__container flex-1 w-full h-full max-w-screen-md relative">
        
        {/* Navigation (Rendered First as requested) */}
        <Navigation 
          onAccountPress={() => setActiveModal("account")}
          onSelectPress={() => setActiveModal("select")}
          onLogoPress={() => setActiveModal("gallery")}
          onCreatePress={() => setActiveModal("create")}
          onCheckoutPress={() => setActiveModal("order")}
          highlightedCorner={null}
          user={session?.user || null}
          selectedGarment={selectedGarment}
          selectedColor={selectedColor}
        />

        {/* Main Content Area - Garment Preview */}
        {/* Changed from absolute inset-0 to flex-1 with padding to respect Nav/Footer areas */}
        <View className="page__preview flex-1 w-full items-center justify-center z-0 pt-32 pb-24 pointer-events-none">
          <View className="page__preview-content w-full flex-1 items-center justify-center relative pointer-events-auto max-w-[575px] p-2">
            
            {/* TOP CONTROLS: Toggle Side + Add Layer */}
            <View className="page__controls absolute top-4 z-50 pointer-events-auto flex-row items-center gap-3">
               {/* Toggle Pill - Shows DESTINATION */}
               <TouchableOpacity 
                 onPress={() => setCurrentSide(prev => prev === 'front' ? 'back' : 'front')}
                 className="page__toggle bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-200 flex-row items-center gap-2"
               >
                 {/* Icon shows Destination Garment */}
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

               {/* Add Layer Button */}
               <TouchableOpacity 
                 onPress={handleAddLayer}
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
              
              {/* Design Layers Loop */}
              {layers.filter(l => l.side === currentSide).map((layer) => (
                  <DraggableResizableDesign 
                      key={layer.id}
                      initialSize={responsiveDesignSize}
                      label={layer.label}
                      isPlacing={layer.isPlacing}
                      isSelected={activeLayerId === layer.id}
                      onSelect={() => setActiveLayerId(layer.id)}
                      onLock={() => handleLockLayer(layer.id)}
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

        {/* Footer */}
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

        {/* Account Modal (Top Left) */}
        <CornerModal
          visible={activeModal === "account"}
          onClose={handleClose}
          position="top-left"
          title={session ? "A Sua Conta" : "Login"}
        >
          {session ? (
            <View className="page__account w-full items-center justify-center flex-1">
               <View className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-gray-100 shadow-sm">
                 {session.user.user_metadata.avatar_url ? (
                   <Image source={{ uri: session.user.user_metadata.avatar_url }} className="w-full h-full" />
                 ) : (
                   <View className="w-full h-full bg-gray-200 items-center justify-center">
                     <Text className="text-3xl font-bold text-gray-500">{session.user.email?.charAt(0).toUpperCase()}</Text>
                   </View>
                 )}
               </View>
               <Text className="text-2xl font-bold mb-2 text-center text-gray-900">{session.user.user_metadata.full_name || "Olá!"}</Text>
               <Text className="text-gray-500 text-base mb-8 text-center">{session.user.email}</Text>
               
               <TouchableOpacity 
                 onPress={handleLogout}
                 className="bg-red-50 px-8 py-4 rounded-2xl flex-row items-center gap-3 border border-red-100 active:bg-red-100 transition-colors w-full max-w-xs justify-center"
               >
                  <LogOut size={20} color="#ef4444" />
                  <Text className="text-red-500 font-bold text-base">Terminar Sessão</Text>
               </TouchableOpacity>
            </View>
          ) : (
            <View className="page__login w-full max-w-xs mx-auto flex-col gap-4 justify-center flex-1">
              <Text className="text-gray-500 text-center mb-4 leading-relaxed">
                Entre para guardar os seus designs e aceder ao histórico de compras.
              </Text>
              
              {/* Google */}
              <TouchableOpacity 
                onPress={handleGoogleLogin}
                disabled={loading}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center px-6 gap-4 shadow-sm active:scale-95 transition-all"
              >
                 <Image 
                   source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" }} 
                   className="w-6 h-6" 
                   resizeMode="contain"
                 />
                 <Text className="font-bold text-gray-800 text-base flex-1 text-center">
                   {loading ? "A carregar..." : "Continuar com Google"}
                 </Text>
              </TouchableOpacity>

              <View className="flex-row items-center gap-4 my-2 opacity-50">
                 <View className="h-[1px] bg-gray-300 flex-1" />
                 <Text className="text-xs font-semibold text-gray-400">OU</Text>
                 <View className="h-[1px] bg-gray-300 flex-1" />
              </View>

              {/* Instagram (Mock) */}
              <TouchableOpacity 
                className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex-row items-center px-6 gap-4 active:scale-95 transition-all"
                onPress={() => alert("Login com Instagram em breve!")}
              >
                 <Image 
                   source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png" }} 
                   className="w-6 h-6" 
                   resizeMode="contain"
                 />
                 <Text className="font-bold text-purple-700 text-base flex-1 text-center">Instagram</Text>
              </TouchableOpacity>

              {/* WhatsApp (Mock) */}
               <TouchableOpacity 
                className="bg-green-50 border border-green-100 rounded-2xl p-4 flex-row items-center px-6 gap-4 active:scale-95 transition-all"
                onPress={() => alert("Login com WhatsApp em breve!")}
              >
                 <Image 
                   source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/600px-WhatsApp.svg.png" }} 
                   className="w-6 h-6" 
                   resizeMode="contain"
                 />
                 <Text className="font-bold text-green-700 text-base flex-1 text-center">WhatsApp</Text>
              </TouchableOpacity>
            </View>
          )}
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
              // Same logic as generate: find active or create new
              let targetId = activeLayerId;
              if (!targetId) {
                  const newId = Date.now().toString();
                  const countOnSide = layers.filter(l => l.side === currentSide).length;
                  const newLayer: DesignLayer = {
                      id: newId,
                      side: currentSide,
                      image: null,
                      isPlacing: false,
                      label: `Desenho ${countOnSide + 1}`
                  };
                  setLayers(prev => [...prev, newLayer]);
                  targetId = newId;
                  setActiveLayerId(newId);
              }

              // Update layer
              setLayers(prev => prev.map(l => l.id === targetId ? { ...l, image: img } : l));
              setActiveModal(null);
            }} 
          />
        </CornerModal>

        {/* Create Modal (Bottom Left) */}
        <CornerModal
          visible={activeModal === "create"}
          onClose={handleClose}
          position="bottom-left"
          title="Criar Desenho"
        >
          <DesignUploader 
            onUpload={() => console.log("Upload pressed")} 
            onGenerate={handleGenerateDesign}
            isGenerating={isGenerating}
            // Carousel Wiring
            layers={layers.filter(l => l.side === currentSide)}
            activeLayerId={activeLayerId}
            onSelectLayer={setActiveLayerId}
          />
        </CornerModal>

        {/* Order Modal (Bottom Right) */}
        <CornerModal
          visible={activeModal === "order"}
          onClose={handleClose}
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
