import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { embryoService, EmbryoActivation } from '../services/embryoService';
import Theme from '@/constants/Theme';
import PremiumCard from '@/components/ui/premium-card';

const AtivarEmbriaoScreen: React.FC = () => {
  const router = useRouter();
  const { embryoId } = useLocalSearchParams<{ embryoId: string }>();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipientId: '',
    recipientName: '',
    recipientRegistration: '',
    activationDate: new Date().toISOString().split('T')[0],
    veterinarian: '',
    clinic: '',
    notes: '',
  });

  // Atualizar campo do formulário
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validar formulário
  const validateForm = (): boolean => {
    if (!formData.recipientName.trim()) {
      Alert.alert('Erro', 'Nome da receptora é obrigatório');
      return false;
    }
    if (!formData.recipientRegistration.trim()) {
      Alert.alert('Erro', 'Registro da receptora é obrigatório');
      return false;
    }
    if (!formData.veterinarian.trim()) {
      Alert.alert('Erro', 'Nome do veterinário é obrigatório');
      return false;
    }
    if (!formData.clinic.trim()) {
      Alert.alert('Erro', 'Nome da clínica é obrigatório');
      return false;
    }
    return true;
  };

  // Ativar embrião
  const handleActivateEmbryo = useCallback(async () => {
    if (!embryoId || !validateForm()) return;
    
    try {
      setLoading(true);
      
      const activationData: EmbryoActivation = {
        recipientId: formData.recipientId || `RECEPTOR_${Date.now()}`,
        recipientName: formData.recipientName,
        recipientRegistration: formData.recipientRegistration,
        activationDate: formData.activationDate,
        veterinarian: formData.veterinarian,
        clinic: formData.clinic,
        notes: formData.notes,
      };
      
      console.log('Ativando embrião:', embryoId, activationData);
      
      await embryoService.activateEmbryo(embryoId, activationData);
      
      Alert.alert(
        'Sucesso!',
        'Embrião transferido com sucesso para a receptora.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao ativar embrião:', error);
      Alert.alert('Erro', 'Não foi possível ativar o embrião. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [embryoId, formData, router]);

  // Renderizar campo de entrada
  const renderInput = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    icon: keyof typeof Feather.glyphMap,
    multiline = false,
    keyboardType: 'default' | 'email-address' | 'numeric' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabel}>
        <Feather name={icon} size={16} color={Theme.colors.primary[600]} />
        <Text style={styles.inputLabelText}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={Theme.colors.neutral[400]}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary[600]} />
      
      {/* Header */}
      <LinearGradient
        colors={[Theme.colors.primary[600], Theme.colors.primary[700]]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ativar Embrião</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <Text style={styles.headerSubtitle}>
          Transferir embrião para receptora
        </Text>
      </LinearGradient>

      {/* Formulário */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações da Receptora */}
        <PremiumCard
          title="Informações da Receptora"
          icon="heart"
          iconColor={Theme.colors.success[600]}
          delay={0}
        >
          {renderInput(
            'Nome da Receptora *',
            'recipientName',
            'Ex: RECEPTORA 001',
            'user'
          )}
          
          {renderInput(
            'Registro *',
            'recipientRegistration',
            'Ex: R000001',
            'bookmark'
          )}
          
          {renderInput(
            'ID da Receptora (opcional)',
            'recipientId',
            'ID interno do sistema',
            'hash'
          )}
        </PremiumCard>

        {/* Informações do Procedimento */}
        <PremiumCard
          title="Dados do Procedimento"
          icon="calendar"
          iconColor={Theme.colors.warning[600]}
          delay={200}
        >
          {renderInput(
            'Data da Ativação *',
            'activationDate',
            'AAAA-MM-DD',
            'calendar'
          )}
          
          {renderInput(
            'Veterinário Responsável *',
            'veterinarian',
            'Ex: Dr. José Silva',
            'user'
          )}
          
          {renderInput(
            'Clínica/Local *',
            'clinic',
            'Ex: Clínica Veterinária Palmery',
            'map-pin'
          )}
        </PremiumCard>

        {/* Observações */}
        <PremiumCard
          title="Observações"
          icon="file-text"
          iconColor={Theme.colors.neutral[600]}
          delay={400}
        >
          {renderInput(
            'Observações (opcional)',
            'notes',
            'Informações adicionais sobre o procedimento...',
            'edit-3',
            true
          )}
        </PremiumCard>

        {/* Informações importantes */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Feather name="info" size={20} color={Theme.colors.blue[600]} />
            <Text style={styles.infoTitle}>Informações Importantes</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              • O período de gestação de cavalos é de aproximadamente 340 dias
            </Text>
            <Text style={styles.infoText}>
              • O acompanhamento veterinário é essencial durante toda a gestação
            </Text>
            <Text style={styles.infoText}>
              • Após a ativação, o status do embrião será alterado para "Transferido"
            </Text>
            <Text style={styles.infoText}>
              • A receptora entrará em período de acompanhamento gestacional
            </Text>
          </View>
        </View>

        {/* Espaçamento para o botão flutuante */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão de ativação */}
      <TouchableOpacity
        style={[styles.activateButton, loading && styles.activateButtonDisabled]}
        onPress={handleActivateEmbryo}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            loading 
              ? [Theme.colors.neutral[400], Theme.colors.neutral[500]]
              : [Theme.colors.success[500], Theme.colors.success[600]]
          }
          style={styles.activateButtonGradient}
        >
          <Feather 
            name={loading ? "clock" : "play"} 
            size={20} 
            color="#ffffff" 
          />
          <Text style={styles.activateButtonText}>
            {loading ? 'Ativando...' : 'Ativar Embrião'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: Theme.typography.sizes.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  inputLabelText: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Theme.colors.neutral[700],
    marginLeft: Theme.spacing.xs,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[800],
    ...Theme.shadows.sm,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoCard: {
    backgroundColor: Theme.colors.blue[50],
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.blue[600],
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  infoTitle: {
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.blue[800],
    marginLeft: Theme.spacing.sm,
  },
  infoContent: {
    // Styled inline
  },
  infoText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.blue[700],
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },
  activateButton: {
    position: 'absolute',
    bottom: Theme.spacing.lg,
    left: Theme.spacing.lg,
    right: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.lg,
  },
  activateButtonDisabled: {
    opacity: 0.7,
  },
  activateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  activateButtonText: {
    color: '#ffffff',
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.bold as any,
    marginLeft: Theme.spacing.sm,
  },
});

export default AtivarEmbriaoScreen;
