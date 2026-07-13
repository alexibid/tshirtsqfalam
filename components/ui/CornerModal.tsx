import { useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback } from "react-native";
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

  const getOriginStyles = () => {
    switch (position) {
      case "top-left": return { top: 32, left: 32, originX: 0, originY: 0 };
      case "top-right": return { top: 32, right: 32, originX: 1, originY: 0 };
      case "bottom-left": return { bottom: 32, left: 32, originX: 0, originY: 1 };
      case "bottom-right": return { bottom: 32, right: 32, originX: 1, originY: 1 };
    }
  };

  const origin = getOriginStyles();

  return (
    <View className="modal absolute inset-0 z-50 pointer-events-auto">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View className="modal__backdrop" style={{ opacity, flex: 1, backgroundColor: 'rgba(255,255,255,0.95)' }} />
      </TouchableWithoutFeedback>

      <View 
        className="modal__positioner absolute pointer-events-none" 
        style={{ 
          top: 32,
          bottom: 96,
          left: 32,
          right: 32,
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <Animated.View 
            className="modal__content"
            style={{ 
              transform: [
                { scale },
                { translateX: scale.interpolate({ inputRange: [0, 1], outputRange: [origin.originX ? 200 : -200, 0] }) },
                { translateY: scale.interpolate({ inputRange: [0, 1], outputRange: [origin.originY ? 200 : -200, 0] }) }
              ],
              opacity,
              width: '100%',
              height: '100%',
              borderRadius: 30, 
              backgroundColor: 'white', 
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.35,
              shadowRadius: 15,
              elevation: 10,
              position: 'relative',
              paddingHorizontal: 16,
              paddingTop: 80, 
              paddingBottom: 32, 
            }}
            pointerEvents="auto"
          >
            <View className="modal__close-container absolute top-6 right-6 z-[60]">
              <TouchableOpacity 
                onPress={onClose} 
                className="modal__close w-10 h-10 bg-black rounded-full items-center justify-center shadow-md elevation-5"
              >
                <LogOut color="white" size={18} />
              </TouchableOpacity>
            </View>

            {title && (
              <View className="modal__header-wrapper absolute top-8 left-8 right-16 justify-center">
                <Text className="modal__title text-3xl font-black uppercase tracking-tighter text-black" numberOfLines={1} adjustsFontSizeToFit>
                  {title}
                </Text>
              </View>
            )}

            <View className="modal__body flex-1 w-full justify-center z-[70]">
              {children}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
