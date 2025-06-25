import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Link } from 'expo-router';
import { ScrollView } from 'react-native';
import Logo from '@/assets/Icons/Logo';
import Gradient from '@/assets/Icons/Gradient';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleRegister = () => {
    // Implementar lógica de registro aqui
    console.log('Register:', { nome, email, password, telefone });
  };

  return (
    <Box className="flex-1 bg-black">
      <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Background */}
        <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px] opacity-80">
          <Gradient />
        </Box>

        {/* Main Content */}
        <Box className="flex-1 justify-center items-center px-6 py-8">
          <VStack space="xl" className="w-full max-w-md">
            
            {/* Logo Section */}
            <Box className="items-center mb-4">
              <Box className="w-24 h-24 mb-3">
                <Logo />
              </Box>
              <Text className="text-typography-white text-2xl font-bold text-center">
                Haras Pro
              </Text>
              <Text className="text-typography-400 text-base text-center mt-1">
                Criar Nova Conta
              </Text>
            </Box>

            {/* Register Form */}
            <VStack space="lg" className="w-full">
              <Text className="text-typography-white text-xl font-semibold text-center mb-2">
                Cadastro
              </Text>

              {/* Nome Input */}
              <VStack space="sm">
                <Text className="text-typography-300 text-sm font-medium">
                  Nome Completo
                </Text>
                <Input className="bg-background-800 border-outline-600">
                  <InputField
                    className="text-typography-white"
                    placeholder="Digite seu nome completo"
                    placeholderTextColor="#9CA3AF"
                    value={nome}
                    onChangeText={setNome}
                  />
                </Input>
              </VStack>

              {/* Email Input */}
              <VStack space="sm">
                <Text className="text-typography-300 text-sm font-medium">
                  Email
                </Text>
                <Input className="bg-background-800 border-outline-600">
                  <InputField
                    className="text-typography-white"
                    placeholder="Digite seu email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
              </VStack>

              {/* Telefone Input */}
              <VStack space="sm">
                <Text className="text-typography-300 text-sm font-medium">
                  Telefone
                </Text>
                <Input className="bg-background-800 border-outline-600">
                  <InputField
                    className="text-typography-white"
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#9CA3AF"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                  />
                </Input>
              </VStack>

              {/* Password Input */}
              <VStack space="sm">
                <Text className="text-typography-300 text-sm font-medium">
                  Senha
                </Text>
                <Input className="bg-background-800 border-outline-600">
                  <InputField
                    className="text-typography-white"
                    placeholder="Digite sua senha"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                  />
                </Input>
              </VStack>

              {/* Confirm Password Input */}
              <VStack space="sm">
                <Text className="text-typography-300 text-sm font-medium">
                  Confirmar Senha
                </Text>
                <Input className="bg-background-800 border-outline-600">
                  <InputField
                    className="text-typography-white"
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                  />
                </Input>
              </VStack>

              {/* Register Button */}
              <Button
                className="bg-primary-600 hover:bg-primary-700 mt-4"
                onPress={handleRegister}
              >
                <ButtonText className="text-typography-white font-semibold text-lg">
                  Criar Conta
                </ButtonText>
              </Button>

              {/* Terms */}
              <Text className="text-typography-400 text-xs text-center">
                Ao criar uma conta, você concorda com nossos{' '}
                <Text className="text-primary-400 underline">
                  Termos de Uso
                </Text>{' '}
                e{' '}
                <Text className="text-primary-400 underline">
                  Política de Privacidade
                </Text>
              </Text>

              {/* Login Link */}
              <Box className="items-center mt-4">
                <HStack space="sm" className="items-center">
                  <Text className="text-typography-400 text-sm">
                    Já tem uma conta?
                  </Text>
                  <Link href="/login">
                    <Text className="text-primary-400 text-sm font-semibold">
                      Fazer login
                    </Text>
                  </Link>
                </HStack>
              </Box>
            </VStack>
          </VStack>
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
