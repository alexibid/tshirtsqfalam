import React, { useEffect } from 'react';
import { View, Platform, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface DraggableResizableProps {
  children: React.ReactNode;
  initialSize?: number;
  label?: string;
  isPlacing?: boolean;
  isSelected?: boolean;
  onLock?: () => void;
  onSelect?: () => void;
}

export function DraggableResizableDesign({ 
  children, 
  initialSize = 120, 
  label, 
  isPlacing = false,
  isSelected = true,
  onLock,
  onSelect
}: DraggableResizableProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Reset/Effect when isPlacing changes? 
  // For now we trust parent to mount new component or reset values.

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

  // Double Tap (Reset or Lock)
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (isPlacing && onLock) {
         // Fix position
         onLock();
      } else {
        // Reset Logic
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        savedTranslateX.value = 0;
        translateY.value = withSpring(0);
        savedTranslateY.value = 0;
      }
    });

  // Single Tap (Select)
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (onSelect) onSelect();
    });

  // Resize Pan (Logic same as before)
  const resizeHandleGesture = Gesture.Pan()
    .onStart(() => {
        savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      const growth = (e.translationX + e.translationY) / 2; // Diagonal movement
      // Sensitivity factor
      const scaleFactor = 1 + (growth / 100); 
      scale.value = Math.max(0.5, savedScale.value * scaleFactor);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const composedMain = Gesture.Simultaneous(panGesture, pinchGesture, doubleTapGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
      <Animated.View 
        className="design-layer"
        style={[
          animatedStyle, 
          { 
            position: 'absolute', 
            width: initialSize, 
            height: initialSize, 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: isSelected ? 100 : 10, // Active layer on top
            // Web-specific styles for better UX
            ...(Platform.OS === 'web' ? {
              cursor: isPlacing ? 'crosshair' : 'move',
              userSelect: 'none',
              touchAction: 'none'
            } as any : {})
          }
        ]}
      >
        <GestureDetector gesture={composedMain}>
            <View 
                className={`design-layer__content w-full h-full rounded-lg overflow-visible relative transition-all ${
                    isSelected 
                        ? "border-2 border-dashed border-blue-400/80 bg-blue-50/10" 
                        : "border border-transparent"
                }`}
                style={{ opacity: isPlacing ? 0.7 : 1 }}
            >
                {/* Label (e.g. #1) */}
                {label && (
                    <View className="design-layer__label absolute -top-6 left-0 bg-black/60 px-2 py-1 rounded">
                        <Text className="text-white text-[10px] font-bold">{label}</Text>
                    </View>
                )}

                {children}
            </View>
        </GestureDetector>
            
        {/* Visual Resize Handle (Bottom Right) - Only if selected and not ghost placing */}
        {/* Moved OUTSIDE composedMain so touches aren't stolen */}
        {isSelected && !isPlacing && (
            <GestureDetector gesture={resizeHandleGesture}>
            <View 
                className="design-layer__handle absolute -bottom-3 -right-3 w-8 h-8 items-center justify-center z-50 rounded-full"
                // containerStyle={{ zIndex: 50 }} 
                style={Platform.OS === 'web' ? { cursor: 'nwse-resize' } as any : {}}
            >
                <View className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
            </View>
            </GestureDetector>
        )}
      </Animated.View>
  );
}
