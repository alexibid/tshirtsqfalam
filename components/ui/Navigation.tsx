import { View, TouchableOpacity, Image, Text, Animated, Easing } from "react-native";
import { User as UserIcon, Shirt, Wand2, ShoppingCart } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";

interface NavigationProps {
  onAccountPress: () => void;
  onSelectPress: () => void;
  onLogoPress: () => void;
  onCreatePress: () => void;
  onCheckoutPress: () => void;
  hasDesign?: boolean;
  highlightedCorner?: "account" | "select" | "logo" | "create" | "order" | null;
  user: User | null;
  selectedGarment: "tshirt" | "sweatshirt" | "hoodie";
  selectedColor: string;
}

export function Navigation({ 
  onAccountPress, 
  onSelectPress, 
  onLogoPress,
  onCreatePress, 
  onCheckoutPress, 
  hasDesign,
  highlightedCorner,
  user,
  selectedGarment,
  selectedColor
}: NavigationProps) {
  
  // Standardized button style - now w-full h-full to fill the anchor container
  const buttonStyle = "bg-white w-full h-full items-center justify-center rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all shadow-black/30 elevation-10";
  
  const getHighlightClass = (corner: string) => 
    highlightedCorner === corner ? "border-2 border-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.6)]" : "border border-transparent";

  const iconSize = 24;
  const iconColor = "#000000";

  // Dynamic values
  const userAvatar = user?.user_metadata?.avatar_url;
  
  // Garment Icon Logic
  // Maintain stroke color for contrast if white
  const garmentFill = selectedColor;
  const garmentStroke = selectedColor === "#ffffff" ? "#94a3b8" : selectedColor; // slate-400 for white border

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(true);

  // Animations (Opacity) - Start invisible (0) for fade-in effect
  const anims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Single Sequence Duration: ~2000ms (0.6s + 0.8s + 0.6s)
    const createFadeSequence = () => {
      const animations = anims.map(anim => 
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
          Animated.delay(800),
          Animated.timing(anim, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.in(Easing.ease) })
        ])
      );
      return Animated.stagger(200, animations);
    };

    // Run loop
    const loop = Animated.loop(createFadeSequence());
    loop.start();

    // Auto-Cleanup after 6 seconds (3 full loops)
    const timer = setTimeout(() => {
      loop.stop();
      setShowTutorial(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);



  const wrapStyle = "items-center justify-center w-20 h-20"; 
  const anchorStyle = "relative w-14 h-14"; // Exact button size anchor

  // Tutorial Overlay Component with BEM Naming
  const TutorialOverlay = ({ index, label, number }: { index: number, label: string, number: string }) => {
    if (!showTutorial) return null;

    // BEM: nav__number
    // Conditional offset for Logo (Index 2)
    const offsetClass = index === 2 ? "-left-7" : "-left-6";
    const numberClass = `nav__number absolute -top-2 ${offsetClass} text-2xl font-black text-gray-900 z-50`;

    return (
      <Animated.View 
        style={{ 
          opacity: anims[index],
          width: 56, 
          height: 56, 
          position: 'absolute', 
          top: 0, 
          left: 0,
          pointerEvents: 'none'
        }}
      >
        {/* Wrapper to ensure BEM class exists in DOM and relative anchoring works */}
        <View className="nav__overlay w-full h-full relative">
          <Text className={numberClass}>
            {number}
          </Text>
          
          {/* BEM: nav__label-container */}
          <View className="nav__label-container absolute top-full mt-2 left-1/2 -ml-24 w-48 items-center justify-center">
            {/* BEM: nav__label */}
            <Text className="nav__label text-center text-xs font-bold text-gray-800 uppercase tracking-tighter">
              {label}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };
  
  // BEM: nav
  return (
    <View className="nav absolute top-8 left-0 right-0 z-50 flex-row justify-evenly items-start px-2 w-full">
      
      {/* 1. Account */}
      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity 
            className={`nav__button ${buttonStyle} ${getHighlightClass("account")}`}
            onPress={onAccountPress}
            style={{ overflow: 'hidden' }} // Ensure rounded image clips
          >
            {userAvatar ? (
               <Image source={{ uri: userAvatar }} className="w-full h-full" resizeMode="cover" />
            ) : (
               <UserIcon color={iconColor} size={iconSize} />
            )}
          </TouchableOpacity>
          <TutorialOverlay index={0} number="1º" label="LOGIN" />
        </View>
      </View>

      {/* 2. Select */}
      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity 
            className={`nav__button ${buttonStyle} ${getHighlightClass("select")}`}
            onPress={onSelectPress}
          >
            <Shirt stroke={garmentStroke} fill={garmentFill} size={iconSize} />
          </TouchableOpacity>
          <TutorialOverlay index={1} number="2º" label="SELECIONA" />
        </View>
      </View>

      {/* 3. Logo (Gallery) */}
      <View className={`nav__item ${wrapStyle}`}>
         {/* 
            Standardized Anchor: 56x56 (w-14 h-14).
         */}
         <View className={`nav__anchor ${anchorStyle}`}>
             {/* Logo Button */}
             <TouchableOpacity 
              onPress={onLogoPress}
              className={`nav__button nav__button--logo absolute inset-0 items-center justify-center active:scale-95 transition-all ${getHighlightClass("logo")}`}
              style={{ overflow: 'visible' }} 
            >
               {/* Semantic H1 for SEO */}
               <View className="absolute inset-0 opacity-0 overflow-hidden w-[1px] h-[1px]">
                 <Text 
                   accessibilityRole="header" 
                   aria-level={1}
                   className="sr-only"
                 >
                   T'shirts Q'falam - Crie a sua T-shirt Personalizada com AI
                 </Text>
               </View>

               {/* Image is larger than the 56px anchor, centered by flex/absolute */}
               <Image 
                  source={require("../../assets/logo.png")} 
                  style={{ width: 72, height: 72, resizeMode: "contain" }}
                />
            </TouchableOpacity>
            <TutorialOverlay index={2} number="3º" label="IDEIAS" />
         </View>
      </View>

      {/* 4. Create */}
      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity 
            className={`nav__button ${buttonStyle} ${getHighlightClass("create")}`}
            onPress={onCreatePress}
          >
            <Wand2 color={iconColor} size={iconSize} />
          </TouchableOpacity>
          <TutorialOverlay index={3} number="4º" label="AI DESIGN" />
        </View>
      </View>

      {/* 5. Order */}
      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity 
            className={`nav__button ${buttonStyle} ${getHighlightClass("order")}`} 
            onPress={onCheckoutPress}
          >
            <ShoppingCart color={iconColor} size={iconSize} />
          </TouchableOpacity>
          <TutorialOverlay index={4} number="5º" label="ENTREGA" />
        </View>
      </View>
    </View>
  );
}
