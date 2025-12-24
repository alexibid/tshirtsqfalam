import { View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function Layout() {
  return (
    <View className="flex-1 bg-white">
      <Slot />
      <StatusBar style="auto" />
    </View>
  );
}
