import React from "react";
import Gradient from "@/assets/Icons/Gradient";
import Logo from "@/assets/Icons/Logo";
import { Box } from "@/components/ui/box";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Link } from "expo-router";

export default function Welcome() {
  return (
    <Box className="flex-1 bg-black h-[100vh]">
      <ScrollView
        style={{ height: "100%" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px]">
          <Gradient />
        </Box>
        <Box className="flex flex-1 items-center justify-center my-16 mx-5 lg:my-24 lg:mx-32">
          
          {/* Logo Section */}
          <Box className="items-center mb-8">
            <Box className="justify-center items-center h-[160px] w-[300px] lg:h-[200px] lg:w-[400px] mb-6">
              <Logo />
            </Box>
            <Text className="text-typography-white text-4xl font-bold text-center mb-2">
              Haras Pro
            </Text>
            <Text className="text-typography-400 text-xl text-center mb-8">
              Gestão Profissional de Haras
            </Text>
          </Box>

          {/* Action Buttons */}
          <VStack space="lg" className="w-full max-w-sm">
            <Link href="/login" asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <ButtonText className="text-typography-white font-semibold text-lg">
                  Fazer Login
                </ButtonText>
              </Button>
            </Link>

            <Link href="/register" asChild>
              <Button variant="outline" className="border-outline-600 bg-transparent">
                <ButtonText className="text-typography-white font-semibold text-lg">
                  Criar Conta
                </ButtonText>
              </Button>
            </Link>

            <Link href="/tabs" asChild>
              <Button variant="outline" className="border-outline-600 bg-transparent mt-4">
                <ButtonText className="text-typography-400 font-medium">
                  Explorar Demo
                </ButtonText>
              </Button>
            </Link>
          </VStack>

          {/* Features */}
          <Box className="mt-12 w-full max-w-md">
            <Text className="text-typography-white text-lg font-semibold text-center mb-4">
              Principais Funcionalidades
            </Text>
            <VStack space="sm">
              <HStack space="md" className="items-center">
                <Box className="w-2 h-2 bg-primary-500 rounded-full" />
                <Text className="text-typography-300 flex-1">
                  Gestão completa de cavalos e éguas
                </Text>
              </HStack>
              <HStack space="md" className="items-center">
                <Box className="w-2 h-2 bg-primary-500 rounded-full" />
                <Text className="text-typography-300 flex-1">
                  Controle de coberturas e nascimentos
                </Text>
              </HStack>
              <HStack space="md" className="items-center">
                <Box className="w-2 h-2 bg-primary-500 rounded-full" />
                <Text className="text-typography-300 flex-1">
                  Relatórios financeiros e genealógicos
                </Text>
              </HStack>
              <HStack space="md" className="items-center">
                <Box className="w-2 h-2 bg-primary-500 rounded-full" />
                <Text className="text-typography-300 flex-1">
                  Sincronização cross-platform
                </Text>
              </HStack>
            </VStack>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="items-center pb-6">
          <Text className="text-typography-500 text-xs text-center">
            © 2025 Haras Pro. Todos os direitos reservados.
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
}
