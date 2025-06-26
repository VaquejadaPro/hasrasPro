import React from "react";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Platform, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Theme from "../../constants/Theme";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
  focused?: boolean;
}) {
  if (props.focused) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <LinearGradient
          colors={[Theme.colors.primary[500], Theme.colors.primary[600]]}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: Theme.colors.primary[600],
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather 
            name={props.name} 
            size={18} 
            color="#FFFFFF"
          />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Feather 
        name={props.name} 
        size={16} 
        color={props.color}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        tabBarActiveTintColor: Theme.colors.primary[600],
        tabBarInactiveTintColor: Theme.colors.neutral[500],
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: Theme.colors.primary[100],
          borderTopWidth: 0.5,
          paddingTop: Platform.OS === 'ios' ? 8 : 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingHorizontal: 2,
          height: Platform.OS === 'ios' ? 85 : 72,
          shadowColor: Theme.colors.primary[600],
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 1,
          textTransform: 'none',
          letterSpacing: 0.1,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          paddingHorizontal: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        },
        headerStyle: {
          backgroundColor: Theme.colors.primary[600],
          shadowColor: Theme.colors.primary[600],
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 6,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="baias"
        options={{
          title: "Baias",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="grid" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="cavalos"
        options={{
          title: "Cavalos",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="users" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="tratador"
        options={{
          title: "Limpeza",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="shield" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="reproducao"
        options={{
          title: "Cria",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="heart" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="relatorios"
        options={{
          title: "Dados",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="bar-chart-2" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="estoque"
        options={{
          title: "Estoque",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="package" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="embrioes"
        options={{
          title: "TE",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="zap" color={color} focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="user" color={color} focused={focused} />,
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
