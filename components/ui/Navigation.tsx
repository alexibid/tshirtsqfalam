import { View, TouchableOpacity, Image, Text, Animated, Easing, useWindowDimensions } from "react-native";
import { Shirt, Wand2, ShoppingCart } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";

interface NavigationProps {
  onSelectPress: () => void;
  onLogoPress: () => void;
  onCreatePress: () => void;
  onCheckoutPress: () => void;
  hasDesign?: boolean;
  highlightedCorner?: "select" | "logo" | "create" | "order" | null;
  selectedGarment: "tshirt" | "sweatshirt" | "hoodie";
  selectedColor: string;
}

export function Navigation({
  onSelectPress,
  onLogoPress,
  onCreatePress, 
  onCheckoutPress, 
  highlightedCorner,
  selectedGarment,
  selectedColor
}: NavigationProps) {
  const buttonStyle = "bg-white w-full h-full items-center justify-center rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all shadow-black/30 elevation-10";
  
  const getHighlightClass = (corner: string) => 
    highlightedCorner === corner ? "border-2 border-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.6)]" : "border border-transparent";

  const iconSize = 24;
  const iconColor = "#000000";
  const { width } = useWindowDimensions();
  const logoSize = width > 420 ? 72 : 56;

  const garmentFill = selectedColor;
  const garmentStroke = selectedColor === "#ffffff" ? "#000000" : selectedColor;

  const [showTutorial, setShowTutorial] = useState(true);
  const anims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
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

    const loop = Animated.loop(createFadeSequence());
    loop.start();

    const timer = setTimeout(() => {
      loop.stop();
      setShowTutorial(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);

  const wrapStyle = "items-center justify-center w-16 h-16 min-[420px]:w-20 min-[420px]:h-20"; 
  const anchorStyle = "relative w-12 h-12 min-[420px]:w-16 min-[420px]:h-16";

  const TutorialOverlay = ({ index, label, number }: { index: number, label: string, number: string }) => {
    if (!showTutorial) return null;

    const offsetClass = index === 1 ? "-left-7" : "-left-6";
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
        <View className="nav__overlay w-full h-full relative">
          <Text className={numberClass}>
            {number}
          </Text>
          
          <View className="nav__label-container absolute top-full mt-2 left-1/2 -ml-24 w-48 items-center justify-center">
            <Text className="nav__label text-center text-xs font-bold text-gray-800 uppercase tracking-tighter">
              {label}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };
  
  return (
    <View className="nav absolute top-8 left-0 right-0 z-50 flex-row justify-evenly items-start px-2 w-full">
      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity
            className={`nav__button ${buttonStyle} ${getHighlightClass("select")}`}
            onPress={onSelectPress}
          >
            <Shirt stroke={garmentStroke} fill={garmentFill} size={iconSize} />
          </TouchableOpacity>
          <TutorialOverlay index={0} number="1º" label="SELECIONA" />
        </View>
      </View>

      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity 
            onPress={onLogoPress}
            className={`nav__button nav__button--logo absolute inset-0 items-center justify-center active:scale-95 transition-all ${getHighlightClass("logo")}`}
          >
            <Image 
              source={require("../../assets/logo.png")} 
              className="nav__logo-image"
              style={{ width: logoSize, height: logoSize }}
            />
          </TouchableOpacity>
          <TutorialOverlay index={1} number="2º" label="IDEIAS" />
        </View>
      </View>

      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity 
            className={`nav__button ${buttonStyle} ${getHighlightClass("create")}`}
            onPress={onCreatePress}
          >
            <Wand2 color={iconColor} size={iconSize} />
          </TouchableOpacity>
          <TutorialOverlay index={2} number="3º" label="AI DESIGN" />
        </View>
      </View>

      <View className={`nav__item ${wrapStyle}`}>
        <View className={`nav__anchor ${anchorStyle}`}>
          <TouchableOpacity 
            className={`nav__button ${buttonStyle} ${getHighlightClass("order")}`} 
            onPress={onCheckoutPress}
          >
            <ShoppingCart color={iconColor} size={iconSize} />
          </TouchableOpacity>
          <TutorialOverlay index={3} number="4º" label="ENTREGA" />
        </View>
      </View>
    </View>
  );
}
