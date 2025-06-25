import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { embryoService, Embryo } from '../services/embryoService';
import Theme from '@/constants/Theme';
import PremiumCard from '@/components/ui/premium-card';
import QuickStat from '@/components/ui/quick-stat';

const DetalheEmbriaoScreen: React.FC = () => {
  const router = useRouter();
  const { embryoId } = useLocalSearchParams<{ embryoId: string }>();
  
  const [embryo, setEmbryo] = useState<Embryo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar dados do embrião
  const loadEmbryo = useCallback(async () => {
    if (!embryoId) return;
    
    try {
      setLoading(true);
      console.log('Carregando detalhes do embrião:', embryoId);
      
      const embryoData = await embryoService.getEmbryoById(embryoId);
      console.log('Dados do embrião carregados:', embryoData);
      
      setEmbryo(embryoData);
    } catch (error) {
      console.error('Erro ao carregar embrião:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do embrião.');
    } finally {
      setLoading(false);
    }
  }, [embryoId]);

  // Refresh dos dados
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEmbryo();
    setRefreshing(false);
  }, [loadEmbryo]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadEmbryo();
  }, [loadEmbryo]);

  // Formatação de data
  const formatarData = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Formatação de data e hora
  const formatarDataHora = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR') + ' às ' + 
           new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Obter informações de gestação
  const getGestationInfo = () => {
    if (!embryo?.activationDate) return null;
    return embryoService.calculateGestationInfo(embryo.activationDate, embryo.daysPregnant);
  };

  // Handler para ativar embrião
  const handleActivateEmbryo = () => {
    if (!embryo) return;
    Alert.alert('Ativar Embrião', `Deseja ativar o embrião ${embryo.code}?`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!embryo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={Theme.colors.neutral[400]} />
          <Text style={styles.errorText}>Embrião não encontrado</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = embryoService.getEmbryoStatus(embryo);
  const gestationInfo = getGestationInfo();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
      
      {/* Header Premium */}
      <LinearGradient
        colors={[Theme.colors.primary[600], Theme.colors.primary[700]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{embryo.code}</Text>
            <Text style={styles.headerSubtitle}>
              Criado em {formatarData(embryo.creationDate)}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Genealogia - Pais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genealogia</Text>
          
          <View style={styles.parentsCard}>
            <LinearGradient
              colors={[Theme.colors.neutral[50], Theme.colors.neutral[100]]}
              style={styles.parentsGradient}
            >
              {/* Pai */}
              <View style={styles.parentSection}>
                <View style={styles.parentHeader}>
                  <View style={[styles.parentIcon, { backgroundColor: Theme.colors.primary[100] }]}>
                    <MaterialIcons name="male" size={20} color={Theme.colors.primary[600]} />
                  </View>
                  <Text style={styles.parentLabel}>PAI</Text>
                </View>
                <Text style={styles.parentName}>{embryo.fatherName}</Text>
                <Text style={styles.parentRegistration}>Registro: {embryo.fatherRegistration}</Text>
              </View>

              <View style={styles.parentsDivider} />

              {/* Mãe */}
              <View style={styles.parentSection}>
                <View style={styles.parentHeader}>
                  <View style={[styles.parentIcon, { backgroundColor: Theme.colors.warning[100] }]}>
                    <MaterialIcons name="female" size={20} color={Theme.colors.warning[600]} />
                  </View>
                  <Text style={styles.parentLabel}>MÃE</Text>
                </View>
                <Text style={styles.parentName}>{embryo.motherName}</Text>
                <Text style={styles.parentRegistration}>Registro: {embryo.motherRegistration}</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Informações Técnicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Técnicas</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Feather name="calendar" size={16} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoLabel}>Data de Criação</Text>
              <Text style={styles.infoValue}>{formatarData(embryo.creationDate)}</Text>
            </View>

            {embryo.freezingDate && (
              <View style={styles.infoRow}>
                <MaterialIcons name="ac-unit" size={16} color={Theme.colors.primary[500]} />
                <Text style={styles.infoLabel}>Data de Congelamento</Text>
                <Text style={styles.infoValue}>{formatarDataHora(embryo.freezingDate)}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Feather name="user" size={16} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoLabel}>Veterinário</Text>
              <Text style={styles.infoValue}>{embryo.veterinarian}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={Theme.colors.neutral[500]} />
              <Text style={styles.infoLabel}>Clínica</Text>
              <Text style={styles.infoValue}>{embryo.clinic}</Text>
            </View>

            {embryo.technique && (
              <View style={styles.infoRow}>
                <MaterialIcons name="science" size={16} color={Theme.colors.success[500]} />
                <Text style={styles.infoLabel}>Técnica</Text>
                <Text style={styles.infoValue}>{embryo.technique}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Gestação (se ativado) */}
        {gestationInfo && embryo.status === 'activated' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestação</Text>
            
            <View style={styles.gestationCard}>
              <LinearGradient
                colors={[Theme.colors.success[500], Theme.colors.success[600]]}
                style={styles.gestationHeader}
              >
                <MaterialIcons name="pregnant-woman" size={24} color="#ffffff" />
                <Text style={styles.gestationTitle}>Em Andamento</Text>
                <Text style={styles.gestationPercent}>
                  {gestationInfo.gestationPercent.toFixed(1)}%
                </Text>
              </LinearGradient>

              <View style={styles.gestationContent}>
                {/* Barra de progresso */}
                <View style={styles.gestationProgress}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(gestationInfo.gestationPercent, 100)}%` }
                      ]}
                    />
                  </View>
                </View>

                {/* Stats de gestação */}
                <View style={styles.gestationStats}>
                  <View style={styles.gestationStat}>
                    <Text style={styles.gestationStatValue}>{gestationInfo.gestationDays}</Text>
                    <Text style={styles.gestationStatLabel}>Dias</Text>
                  </View>
                  <View style={styles.gestationStat}>
                    <Text style={styles.gestationStatValue}>
                      {Math.max(gestationInfo.remainingDays, 0)}
                    </Text>
                    <Text style={styles.gestationStatLabel}>Restantes</Text>
                  </View>
                  <View style={styles.gestationStat}>
                    <Text style={styles.gestationStatValue}>
                      {formatarData(gestationInfo.expectedBirthDate.toISOString())}
                    </Text>
                    <Text style={styles.gestationStatLabel}>Nascimento</Text>
                  </View>
                </View>

                {/* Receptora */}
                {embryo.recipientName && (
                  <View style={styles.recipientInfo}>
                    <View style={styles.recipientHeader}>
                      <MaterialIcons name="pets" size={20} color={Theme.colors.primary[600]} />
                      <Text style={styles.recipientTitle}>Receptora</Text>
                    </View>
                    <Text style={styles.recipientName}>{embryo.recipientName}</Text>
                    <Text style={styles.recipientRegistration}>
                      Registro: {embryo.recipientRegistration}
                    </Text>
                    {embryo.activationDate && (
                      <Text style={styles.recipientDate}>
                        Ativado em: {formatarData(embryo.activationDate)}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Observações */}
        {embryo.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{embryo.notes}</Text>
            </View>
          </View>
        )}

        {/* Ações */}
        {embryo.status === 'frozen' && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.activateButton}
              onPress={handleActivateEmbryo}
            >
              <LinearGradient
                colors={[Theme.colors.success[500], Theme.colors.success[600]]}
                style={styles.activateButtonGradient}
              >
                <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
                <Text style={styles.activateButtonText}>Ativar Embrião</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Theme.colors.neutral[600],
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Theme.colors.neutral[600],
    marginTop: 12,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Theme.colors.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 20,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.neutral[800],
    marginBottom: 12,
  },
  parentsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  parentsGradient: {
    flexDirection: 'row',
    padding: 20,
  },
  parentSection: {
    flex: 1,
  },
  parentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  parentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  parentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.neutral[600],
    letterSpacing: 0.5,
  },
  parentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.neutral[800],
    marginBottom: 4,
  },
  parentRegistration: {
    fontSize: 14,
    color: Theme.colors.neutral[600],
  },
  parentsDivider: {
    width: 1,
    backgroundColor: Theme.colors.neutral[200],
    marginHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[100],
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: Theme.colors.neutral[600],
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.neutral[800],
  },
  gestationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  gestationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  gestationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
    flex: 1,
  },
  gestationPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  gestationContent: {
    padding: 20,
    paddingTop: 0,
  },
  gestationProgress: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: Theme.colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.success[500],
    borderRadius: 4,
  },
  gestationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gestationStat: {
    alignItems: 'center',
    flex: 1,
  },
  gestationStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.neutral[800],
    marginBottom: 4,
  },
  gestationStatLabel: {
    fontSize: 12,
    color: Theme.colors.neutral[500],
  },
  recipientInfo: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: 12,
    padding: 16,
  },
  recipientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipientTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.neutral[700],
    marginLeft: 8,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.neutral[800],
    marginBottom: 4,
  },
  recipientRegistration: {
    fontSize: 14,
    color: Theme.colors.neutral[600],
    marginBottom: 2,
  },
  recipientDate: {
    fontSize: 14,
    color: Theme.colors.neutral[600],
  },
  notesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.neutral[700],
  },
  activateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  activateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  activateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  bottomPadding: {
    height: 40,
  },
});

export default DetalheEmbriaoScreen;
