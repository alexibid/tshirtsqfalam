import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";

export default function AdminDashboard() {
  // Mock data for orders
  const orders = [
    { id: "ORD-001", status: "PAID", customer: "user@example.com", date: "2023-12-23" },
    { id: "ORD-002", status: "PENDING", customer: "test@test.com", date: "2023-12-23" },
    { id: "ORD-003", status: "SHIPPED", customer: "dev@dev.com", date: "2023-12-22" },
  ];

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-row justify-between items-center mb-8 mt-12">
        <Text className="text-2xl font-bold">Admin Dashboard</Text>
        <Link href="/" asChild>
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-lg">
            <Text className="text-sm font-semibold">Exit</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView>
        <Text className="text-lg font-bold mb-4">Recent Orders</Text>
        <View className="border border-gray-200 rounded-lg overflow-hidden">
          {orders.map((order, index) => (
            <View 
              key={order.id} 
              className={`flex-row justify-between p-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <View>
                <Text className="font-semibold">{order.id}</Text>
                <Text className="text-xs text-gray-500">{order.customer}</Text>
              </View>
              <View className="items-end">
                <View className={`px-2 py-1 rounded-full ${
                  order.status === 'PAID' ? 'bg-green-100' : 
                  order.status === 'PENDING' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <Text className={`text-xs font-bold ${
                    order.status === 'PAID' ? 'text-green-800' : 
                    order.status === 'PENDING' ? 'text-yellow-800' : 'text-blue-800'
                  }`}>
                    {order.status}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 mt-1">{order.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-8 mb-12">
           <Text className="text-lg font-bold mb-4">Actions</Text>
           <TouchableOpacity 
             className="bg-black py-4 rounded-lg items-center active:bg-gray-800"
             onPress={() => alert("Downloading Production Assets (Mock)...")}
           >
             <Text className="text-white font-bold">Download All Production Assets</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
