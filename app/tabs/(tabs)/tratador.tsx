import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import Theme from '../../constants/Theme';
import { useHaras } from '../../../hooks/useHaras';
import { Stall, StallStatus } from '../../../services/harasProService';
import { authService } from '../../../services/api';
import LoginScreen from '../../../components/LoginScreen';

export default function CaretakerScreen() {
  const {
    harasList,
    selectedHaras,
    stalls,
    loading,
    error,
    selectHaras,
    refreshData,
    clearError
  } = useHaras();

  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Estados para limpeza
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [cleaningType, setCleaningType] = useState<'routine' | 'deep' | 'maintenance'>('routine');
  const [cleaningNotes, setCleaningNotes] = useState('');
  const [photoBefore, setPhotoBefore] = useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setCheckingAuth(true);
      const { token, user } = await authService.loadStoredAuthData();
      
      if (token && user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLoginSuccess = async () => {
    setTimeout(async () => {
      await checkAuthentication();
    }, 100);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
      clearError();
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const takePicture = async (type: 'before' | 'after') => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Erro', 'É necessário permitir acesso à câmera para tirar fotos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'before') {
          setPhotoBefore(result.assets[0].uri);
        } else {
          setPhotoAfter(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  const handleRecordCleaning = async () => {
    if (!selectedStall) return;

    try {
      // Aqui você faria a chamada para a API para registrar a limpeza
      // await harasProService.recordCleaning(selectedStall.id, {
      //   type: cleaningType,
      //   notes: cleaningNotes,
      //   timeSpent: timeSpent ? parseInt(timeSpent) : undefined,
      //   photoBefore,
      //   photoAfter
      // });

      Alert.alert('Sucesso', 'Limpeza registrada com sucesso!');
      
      // Limpar formulário
      setSelectedStall(null);
      setCleaningNotes('');
      setTimeSpent('');
      setPhotoBefore(null);
      setPhotoAfter(null);
      setCleaningType('routine');
      
      // Atualizar dados
      await refreshData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a limpeza');
    }
  };

  const getStallsNeedingCleaning = () => {
    return stalls.filter(stall => {
      if (!stall.nextCleaningDue) return true;
      return new Date(stall.nextCleaningDue) <= new Date();
    });
  };

  const isOverdue = (stall: Stall) => {
    if (!stall.nextCleaningDue) return false;
    return new Date(stall.nextCleaningDue) < new Date();
  };

  // Mostrar loading enquanto verifica autenticação
  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary[600]} />
          <Text style={styles.loadingText}>Verificando autenticação...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar tela de login se não estiver autenticado
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header para Tratadores */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Controle de Limpeza</Text>
            <Text style={styles.subtitle}>
              {currentUser?.name} - Tratador
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Seleção de Haras */}
        {harasList.length > 0 && (
          <View style={styles.harasSelector}>
            <Text style={styles.sectionTitle}>Selecione o Haras:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {harasList.map((haras) => (
                <TouchableOpacity
                  key={haras.id}
                  style={[
                    styles.harasCard,
                    selectedHaras?.id === haras.id && styles.harasCardSelected
                  ]}
                  onPress={() => selectHaras(haras)}
                >
                  <Text style={[
                    styles.harasName,
                    selectedHaras?.id === haras.id && styles.harasNameSelected
                  ]}>
                    {haras.name}
                  </Text>
                  <Text style={styles.harasInfo}>
                    {getStallsNeedingCleaning().length} baias para limpar
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Lista de Baias para Limpeza */}
        {selectedHaras && (
          <View style={styles.stallsContainer}>
            <Text style={styles.sectionTitle}>
              Baias que Precisam de Limpeza ({getStallsNeedingCleaning().length})
            </Text>
            
            {getStallsNeedingCleaning().length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="check-circle" size={48} color={Theme.colors.success[500]} />
                <Text style={styles.emptyText}>Todas as baias estão limpas!</Text>
                <Text style={styles.emptySubtext}>
                  Não há baias que precisam de limpeza no momento
                </Text>
              </View>
            ) : (
              getStallsNeedingCleaning().map((stall) => (
                <TouchableOpacity
                  key={stall.id}
                  style={[
                    styles.stallCard,
                    isOverdue(stall) && styles.stallCardOverdue
                  ]}
                  onPress={() => setSelectedStall(stall)}
                >
                  <View style={styles.stallHeader}>
                    <View style={styles.stallInfo}>
                      <Text style={styles.stallNumber}>Baia {stall.number}</Text>
                      {stall.horse && (
                        <Text style={styles.horseName}>{stall.horse.name}</Text>
                      )}
                      {stall.lastCleaning && (
                        <Text style={styles.lastCleaning}>
                          Última limpeza: {new Date(stall.lastCleaning).toLocaleDateString('pt-BR')}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.stallStatus}>
                      {isOverdue(stall) && (
                        <View style={styles.overdueTag}>
                          <Feather name="alert-circle" size={16} color="white" />
                          <Text style={styles.overdueText}>Atrasada</Text>
                        </View>
                      )}
                      <Feather name="chevron-right" size={20} color={Theme.colors.neutral[400]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de Registro de Limpeza */}
      {selectedStall && (
        <View style={styles.cleaningModal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Registrar Limpeza - Baia {selectedStall.number}
              </Text>
              <TouchableOpacity onPress={() => setSelectedStall(null)}>
                <Feather name="x" size={24} color={Theme.colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {/* Tipo de Limpeza */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo de Limpeza</Text>
                <View style={styles.typeSelector}>
                  {[
                    { value: 'routine', label: 'Rotina', icon: 'refresh-cw' },
                    { value: 'deep', label: 'Profunda', icon: 'zap' },
                    { value: 'maintenance', label: 'Manutenção', icon: 'tool' }
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeButton,
                        cleaningType === type.value && styles.typeButtonSelected
                      ]}
                      onPress={() => setCleaningType(type.value as any)}
                    >
                      <Feather 
                        name={type.icon as any} 
                        size={20} 
                        color={cleaningType === type.value ? 'white' : Theme.colors.neutral[600]} 
                      />
                      <Text style={[
                        styles.typeButtonText,
                        cleaningType === type.value && styles.typeButtonTextSelected
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tempo Gasto */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tempo Gasto (minutos)</Text>
                <TextInput
                  style={styles.textInput}
                  value={timeSpent}
                  onChangeText={setTimeSpent}
                  placeholder="Ex: 30"
                  keyboardType="numeric"
                />
              </View>

              {/* Observações */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observações</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={cleaningNotes}
                  onChangeText={setCleaningNotes}
                  placeholder="Descreva o que foi feito, problemas encontrados, etc."
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Fotos */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fotos (Opcional)</Text>
                <View style={styles.photoSection}>
                  <View style={styles.photoContainer}>
                    <Text style={styles.photoLabel}>Antes</Text>
                    {photoBefore ? (
                      <Image source={{ uri: photoBefore }} style={styles.photo} />
                    ) : (
                      <TouchableOpacity 
                        style={styles.photoPlaceholder}
                        onPress={() => takePicture('before')}
                      >
                        <Feather name="camera" size={24} color={Theme.colors.neutral[400]} />
                        <Text style={styles.photoPlaceholderText}>Tirar Foto</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.photoContainer}>
                    <Text style={styles.photoLabel}>Depois</Text>
                    {photoAfter ? (
                      <Image source={{ uri: photoAfter }} style={styles.photo} />
                    ) : (
                      <TouchableOpacity 
                        style={styles.photoPlaceholder}
                        onPress={() => takePicture('after')}
                      >
                        <Feather name="camera" size={24} color={Theme.colors.neutral[400]} />
                        <Text style={styles.photoPlaceholderText}>Tirar Foto</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Botões de Ação */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setSelectedStall(null)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleRecordCleaning}
              >
                <Feather name="check" size={20} color="white" />
                <Text style={styles.confirmButtonText}>Registrar Limpeza</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: 'white',
  },
  subtitle: {
    fontSize: Theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  harasSelector: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.success[50],
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.success[700],
    marginBottom: Theme.spacing.md,
  },
  harasCard: {
    backgroundColor: Theme.colors.success[100],
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    minWidth: 200,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  harasCardSelected: {
    borderColor: Theme.colors.success[600],
    backgroundColor: Theme.colors.success[100],
  },
  harasName: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.success[700],
    marginBottom: 4,
  },
  harasNameSelected: {
    color: Theme.colors.success[700],
  },
  harasInfo: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
  },
  stallsContainer: {
    padding: Theme.spacing.lg,
  },
  stallCard: {
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.warning[500],
  },
  stallCardOverdue: {
    borderLeftColor: Theme.colors.error[500],
  },
  stallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stallInfo: {
    flex: 1,
  },
  stallNumber: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
    marginBottom: 4,
  },
  horseName: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: 4,
  },
  lastCleaning: {
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.neutral[500],
  },
  stallStatus: {
    alignItems: 'flex-end',
  },
  overdueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.error[500],
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.sm,
  },
  overdueText: {
    color: 'white',
    fontSize: Theme.typography.sizes.xs,
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Theme.spacing['2xl'],
  },
  emptyText: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[600],
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  cleaningModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  modalTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.neutral[800],
  },
  modalScrollView: {
    padding: Theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.medium as any,
    color: Theme.colors.neutral[700],
    marginBottom: Theme.spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    backgroundColor: 'white',
  },
  typeButtonSelected: {
    backgroundColor: Theme.colors.success[600],
    borderColor: Theme.colors.success[600],
  },
  typeButtonText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginLeft: Theme.spacing.sm,
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  photoSection: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  photoContainer: {
    flex: 1,
  },
  photoLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  photo: {
    width: '100%',
    height: 120,
    borderRadius: Theme.borderRadius.md,
  },
  photoPlaceholder: {
    height: 120,
    borderWidth: 2,
    borderColor: Theme.colors.neutral[300],
    borderStyle: 'dashed',
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
    marginTop: Theme.spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.neutral[200],
  },
  cancelButton: {
    flex: 1,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.success[600],
  },
  confirmButtonText: {
    fontSize: Theme.typography.sizes.base,
    color: 'white',
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: Theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.success[600],
    marginTop: Theme.spacing.md,
  },
});
