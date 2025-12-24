import { useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, Animated, Dimensions, TouchableWithoutFeedback } from "react-native";
import { LogOut } from "lucide-react-native";

export type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CornerModalProps {
  visible: boolean;
  onClose: () => void;
  position: CornerPosition;
  children: React.ReactNode;
  title?: string;
}

export function CornerModal({ visible, onClose, position, children, title }: CornerModalProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
      scale.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  // Determine origin for scale animation and positioning
  const getOriginStyles = () => {
    switch (position) {
      case "top-left": return { top: 32, left: 32, originX: 0, originY: 0 };
      case "top-right": return { top: 32, right: 32, originX: 1, originY: 0 };
      case "bottom-left": return { bottom: 32, left: 32, originX: 0, originY: 1 };
      case "bottom-right": return { bottom: 32, right: 32, originX: 1, originY: 1 };
    }
  };

  const origin = getOriginStyles();

  // Determine close button position (should overlay the original button position)
  const getCloseButtonPosition = () => {
    switch (position) {
      case "top-left": return "top-8 left-8";
      case "top-right": return "top-8 right-8";
      case "bottom-left": return "bottom-24 left-8"; // Matches Navigation bottom-24
      case "bottom-right": return "bottom-24 right-8";
    }
  };

  const getContainerClasses = () => {
    // We animate from the corner, but the layout is full screen. 
    return "flex-1 items-center justify-center";
  };

  return (
    <View className="absolute inset-0 z-50 pointer-events-auto">
       {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={{ opacity, flex: 1, backgroundColor: 'rgba(255,255,255,0.95)' }} />
      </TouchableWithoutFeedback>

      {/* The Expanding Modal Content */}
      <View 
        className="absolute pointer-events-none" 
        style={{ 
          top: 32, // top-8
          bottom: 96, // bottom-24
          left: 32, // left-8
          right: 32, // right-8
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
         <Animated.View 
            style={{ 
              transform: [
                { scale },
                { translateX: scale.interpolate({ inputRange: [0, 1], outputRange: [origin.originX ? 200 : -200, 0] }) },
                { translateY: scale.interpolate({ inputRange: [0, 1], outputRange: [origin.originY ? 200 : -200, 0] }) }
              ],
              opacity,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30, // Matches expected curvature
              backgroundColor: 'white', // Ensure background is white as it's a card
              // Added Box Shadow
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.35,
              shadowRadius: 15,
              elevation: 10,
              position: 'relative' // Ensure relative positioning for children
            }}
         >
            {/* Close Button - Top Right of the Card */}
            <View className="absolute top-6 right-6 z-[60]">
               <TouchableOpacity 
                 onPress={onClose} 
                 className="w-10 h-10 bg-black rounded-full items-center justify-center shadow-md elevation-5"
               >
                 <LogOut color="white" size={18} />
               </TouchableOpacity>
            </View>

            {title && <Text className="text-3xl font-black mb-8 uppercase tracking-tighter text-black">{title}</Text>}
            {children}
         </Animated.View>
      </View>

      {/* Close Button moved inside content */}
    </View>
  );
}
