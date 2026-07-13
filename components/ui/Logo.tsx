import { View, Text } from "react-native";

export function Logo() {
  return (
    <View className="logo items-center justify-center p-4 z-50">
      <View className="logo__bubble bg-black px-6 py-4 rounded-2xl rounded-br-none relative shadow-lg">
        <View className="logo__text-container items-center">
          <Text className="logo__text-top text-white font-bold text-center text-xs tracking-widest uppercase mb-0.5">
            T'SHIRTS
          </Text>
          <Text className="logo__text-bottom text-white font-bold text-center text-lg leading-5 tracking-wide uppercase">
            Q'FALAM
          </Text>
        </View>
        <View 
          className="logo__tail absolute -bottom-2 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-black border-r-[0px] border-r-transparent" 
        />
      </View>
      
      <View className="logo__ring-hint absolute w-[140%] h-[140%] border border-gray-200 rounded-full -z-10 opacity-50" />
    </View>
  );
}
