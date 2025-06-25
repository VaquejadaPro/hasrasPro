import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { cavaloService } from '../services/cavaloService';
import { baiaService } from '../services/baiaService';
import Theme from '@/constants/Theme';

const GerenciamentoBaiasScreen: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Simular harasId e IDs conhecidos
  const harasId = 'haras-example-id';
  const cavalos = [
    { id: 'KG9loRAFKrTgw335w47O', name: 'Egoismo' },
    { id: 'NcpaXa3KRPuIyOMfTofP', name: 'Cavalo 2' }
  ];
  const baias = [
    { id: 'llH2FvCH4RD9Lh540JzY', number: 'A03', name: 'Baia Premium' },
    { id: '9UOEUWVKka2vNTlIjm3H', number: 'B01', name: 'Baia Standard' },
    { id: 's42Ibyh4GU0AWGpmr2Tm', number: 'C05', name: 'Baia VIP' }
  ];

  // Função para testar atribuição
  const testAssignCavalo = async (horseId: string, stallId: string, horseName: string, stallName: string) => {
    try {
      setLoading(true);
      await cavaloService.assignCavaloToBaia(horseId, stallId);
      Alert.alert('Sucesso', `${horseName} foi atribuído à ${stallName}!`);
    } catch (error) {
      console.error('Erro ao atribuir:', error);
      Alert.alert('Erro', 'Falha na atribuição. Verifique o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Função para testar remoção
  const testRemoveCavalo = async (horseId: string, horseName: string) => {
    try {
      setLoading(true);
      await cavaloService.removeCavaloFromBaia(horseId);
      Alert.alert('Sucesso', `${horseName} foi removido da baia!`);
    } catch (error) {
      console.error('Erro ao remover:', error);
      Alert.alert('Erro', 'Falha na remoção. Verifique o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Função para consultar cavalo
  const consultarCavalo = async (horseId: string, horseName: string) => {
    try {
      setLoading(true);
      const cavalo = await cavaloService.getCavaloById(horseId);
      
      let message = `Cavalo: ${cavalo.name}\nStatus: ${cavalo.status}`;
      if (cavalo.stallId) {
        message += `\nBaia: ${cavalo.stallId}`;
      } else {
        message += '\nBaia: Não atribuída';
      }
      
      Alert.alert('Informações do Cavalo', message);
    } catch (error) {
      console.error('Erro ao consultar:', error);
      Alert.alert('Erro', 'Falha na consulta. Verifique o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar opções para um cavalo
  const showCavaloOptions = (cavalo: any) => {
    Alert.alert(
      `Opções para ${cavalo.name}`,
      'Escolha uma ação:',
      [
        { text: 'Consultar', onPress: () => consultarCavalo(cavalo.id, cavalo.name) },
        { text: 'Remover da Baia', onPress: () => testRemoveCavalo(cavalo.id, cavalo.name) },
        { 
          text: 'Atribuir à Baia', 
          onPress: () => {
            // Mostrar opções de baias
            const baiaOptions = baias.map(baia => ({
              text: `${baia.number} - ${baia.name}`,
              onPress: () => testAssignCavalo(cavalo.id, baia.id, cavalo.name, `${baia.number} - ${baia.name}`)
            }));
            baiaOptions.push({ text: 'Cancelar', onPress: async () => {} });
            Alert.alert('Escolher Baia', 'Selecione uma baia:', baiaOptions);
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={Theme.colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teste de Baias</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Seção de Cavalos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cavalos Disponíveis</Text>
          <Text style={styles.sectionSubtitle}>
            Toque em um cavalo para ver as opções
          </Text>
          
          {cavalos.map(cavalo => (
            <TouchableOpacity
              key={cavalo.id}
              style={styles.item}
              onPress={() => showCavaloOptions(cavalo)}
              disabled={loading}
            >
              <View style={styles.itemIcon}>
                <Feather name="user" size={20} color={Theme.colors.primary[600]} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{cavalo.name}</Text>
                <Text style={styles.itemId}>ID: {cavalo.id}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Theme.colors.neutral[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção de Baias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baias Disponíveis</Text>
          <Text style={styles.sectionSubtitle}>
            Informações das baias para referência
          </Text>
          
          {baias.map(baia => (
            <View key={baia.id} style={styles.item}>
              <View style={styles.itemIcon}>
                <Feather name="home" size={20} color={Theme.colors.success[600]} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{baia.number} - {baia.name}</Text>
                <Text style={styles.itemId}>ID: {baia.id}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Instruções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instruções</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instruction}>
              • Toque em um cavalo para ver as opções
            </Text>
            <Text style={styles.instruction}>
              • Use "Consultar" para ver o status atual
            </Text>
            <Text style={styles.instruction}>
              • Use "Atribuir à Baia" para associar a uma baia
            </Text>
            <Text style={styles.instruction}>
              • Use "Remover da Baia" para desassociar
            </Text>
            <Text style={styles.instruction}>
              • Os resultados aparecerão em alertas
            </Text>
          </View>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Processando...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginBottom: Theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: Theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[800],
    marginBottom: 2,
  },
  itemId: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  instructionsList: {
    backgroundColor: '#ffffff',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  instruction: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: Theme.spacing.xs,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
  },
  loadingText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
  },
});

export default GerenciamentoBaiasScreen;
