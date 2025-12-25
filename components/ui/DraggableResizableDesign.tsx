import React from 'react';
import { View, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface DraggableResizableProps {
  children: React.ReactNode;
  initialSize?: number;
}

export function DraggableResizableDesign({ children, initialSize = 120 }: DraggableResizableProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Pan Gesture (Move)
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Pinch Gesture (Resize)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Double Tap (Reset)
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1);
      savedScale.value = 1;
      translateX.value = withSpring(0);
      savedTranslateX.value = 0;
      translateY.value = withSpring(0);
      savedTranslateY.value = 0;
    });

  // Resize Handle Gesture (Bottom Right)
  const resizeHandleGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Calculate growth based on diagonal movement or just X/Y
      // Simple approach: Use max of translation X/Y relative to roughly 100px base
      const growth = (e.translationX + e.translationY) / 2;
      const scaleFactor = 1 + (growth / 100); 
      // Limit minimum scale to avoid inversion
      scale.value = Math.max(0.5, savedScale.value * scaleFactor);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const composedMain = Gesture.Simultaneous(panGesture, pinchGesture, doubleTapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedMain}>
      <Animated.View 
        style={[
          animatedStyle, 
          { 
            position: 'absolute', 
            width: initialSize, 
            height: initialSize, 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 100, // Ensure it's above the garment
            // Web-specific styles for better UX
            ...(Platform.OS === 'web' ? {
              cursor: 'move',
              userSelect: 'none',
              touchAction: 'none'
            } as any : {})
          }
        ]}
      >
        <View className="w-full h-full border border-dashed border-gray-400/50 rounded-lg overflow-visible relative">
            {children}
            
            {/* Visual Resize Handle (Bottom Right) */}
            <GestureDetector gesture={resizeHandleGesture}>
              <View 
                className="absolute -bottom-3 -right-3 w-8 h-8 items-center justify-center z-50 rounded-full"
                containerStyle={{ zIndex: 50 }} // Needed for Gesture Handler to catch touch? Actually View doesn't have containerStyle.
                style={Platform.OS === 'web' ? { cursor: 'nwse-resize' } as any : {}}
              >
                 <View className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
              </View>
            </GestureDetector>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
