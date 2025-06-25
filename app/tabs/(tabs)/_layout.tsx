import React from "react";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Theme from "../../constants/Theme";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  return <Feather size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        tabBarActiveTintColor: Theme.colors.primary[600],
        tabBarInactiveTintColor: Theme.colors.neutral[400],
        tabBarStyle: {
          backgroundColor: Theme.colors.primary[50],
          borderTopColor: Theme.colors.neutral[200],
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: Theme.colors.primary[600],
        },
        headerTintColor: Theme.colors.primary[50],
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="baias"
        options={{
          title: "Baias",
          tabBarIcon: ({ color }) => <TabBarIcon name="grid" color={color} />,
        }}
      />

      <Tabs.Screen
        name="cavalos"
        options={{
          title: "Cavalos",
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />

      <Tabs.Screen
        name="tratador"
        options={{
          title: "Limpeza",
          tabBarIcon: ({ color }) => <TabBarIcon name="droplet" color={color} />,
        }}
      />

      <Tabs.Screen
        name="reproducao"
        options={{
          title: "Reprodução",
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />

      <Tabs.Screen
        name="relatorios"
        options={{
          title: "Relatórios",
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart-2" color={color} />,
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

      <Tabs.Screen
        name="estoque"
        options={{
          title: "Estoque",
          tabBarIcon: ({ color }) => <TabBarIcon name="package" color={color} />,
        }}
      />

      <Tabs.Screen
        name="veterinario"
        options={{
          title: "Veterinário",
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-square" color={color} />,
        }}
      />

      <Tabs.Screen
        name="embrioes"
        options={{
          title: "Embriões",
          tabBarIcon: ({ color }) => <TabBarIcon name="zap" color={color} />,
        }}
      />

      {/* Telas ocultas da barra de navegação */}
      <Tabs.Screen
        name="cavalos-disponiveis"
        options={{
          title: "Cavalos Disponíveis",
          tabBarButton: () => null, // Oculta da barra de navegação
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
