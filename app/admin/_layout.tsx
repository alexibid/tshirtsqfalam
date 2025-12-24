import { Slot, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";

export default function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For MVP/Demo purposes, we might bypass this or use an anon login
    // In a real app, we'd check strictly for admin role
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // MOCK: For development speed, allowing access if no session, or we can prompt login.
  // Uncomment below to strict enforce (and user is stuck until they login)
  /*
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (!session) {
    // Determine if we show a login screen or redirect home
    // return <Redirect href="/" />;
  }
  */

  return <Slot />;
}
