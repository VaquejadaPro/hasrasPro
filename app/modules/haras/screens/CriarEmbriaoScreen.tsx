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
import { useRouter } from 'expo-router';
import { embryoService, CreateEmbryoData } from '../services/embryoService';
import { useHaras } from '@/hooks/useHaras';
import Theme from '@/constants/Theme';
import PremiumCard from '@/components/ui/premium-card';

const CriarEmbriaoScreen: React.FC = () => {
  const router = useRouter();
  const { selectedHaras } = useHaras();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    fatherName: '',
    fatherRegistration: '',
    fatherId: '',
    motherName: '',
    motherRegistration: '',
    motherId: '',
    creationDate: new Date().toISOString().split('T')[0],
    veterinarian: '',
    clinic: '',
    technique: 'FIV - Fertilização in vitro',
    notes: '',
  });

  // Atualizar campo do formulário
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gerar código automático
  const generateCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const code = `EMB${timestamp}`;
    updateField('code', code);
  };

  // Validar formulário
  const validateForm = (): boolean => {
    if (!formData.code.trim()) {
      Alert.alert('Erro', 'Código do embrião é obrigatório');
      return false;
    }
    if (!formData.fatherName.trim()) {
      Alert.alert('Erro', 'Nome do pai é obrigatório');
      return false;
    }
    if (!formData.fatherRegistration.trim()) {
      Alert.alert('Erro', 'Registro do pai é obrigatório');
      return false;
    }
    if (!formData.motherName.trim()) {
      Alert.alert('Erro', 'Nome da mãe é obrigatório');
      return false;
    }
    if (!formData.motherRegistration.trim()) {
      Alert.alert('Erro', 'Registro da mãe é obrigatório');
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

  // Criar embrião
  const handleCreateEmbryo = useCallback(async () => {
    if (!selectedHaras?.id || !validateForm()) return;
    
    try {
      setLoading(true);
      
      const embryoData: CreateEmbryoData = {
        haras_id: selectedHaras.id,
        code: formData.code,
        fatherName: formData.fatherName,
        fatherRegistration: formData.fatherRegistration,
        fatherId: formData.fatherId || `FATHER_${Date.now()}`,
        motherName: formData.motherName,
        motherRegistration: formData.motherRegistration,
        motherId: formData.motherId || `MOTHER_${Date.now()}`,
        creationDate: formData.creationDate,
        veterinarian: formData.veterinarian,
        clinic: formData.clinic,
        technique: formData.technique,
        notes: formData.notes,
      };
      
      console.log('Criando embrião:', embryoData);
      
      await embryoService.createEmbryo(embryoData);
      
      Alert.alert(
        'Sucesso!',
        'Embrião criado com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao criar embrião:', error);
      Alert.alert('Erro', 'Não foi possível criar o embrião. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [selectedHaras?.id, formData, router]);

  // Renderizar campo de entrada
  const renderInput = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    icon: keyof typeof Feather.glyphMap,
    multiline = false,
    keyboardType: 'default' | 'email-address' | 'numeric' = 'default',
    rightIcon?: keyof typeof Feather.glyphMap,
    onRightIconPress?: () => void
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabel}>
        <Feather name={icon} size={16} color={Theme.colors.primary[600]} />
        <Text style={styles.inputLabelText}>{label}</Text>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, rightIcon && styles.inputWithRightIcon]}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.neutral[400]}
          value={formData[field]}
          onChangeText={(value) => updateField(field, value)}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          keyboardType={keyboardType}
        />
        {rightIcon && (
          <TouchableOpacity style={styles.rightIconButton} onPress={onRightIconPress}>
            <Feather name={rightIcon} size={20} color={Theme.colors.primary[600]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Renderizar seletor de técnica
  const renderTechniqueSelector = () => {
    const techniques = [
      'FIV - Fertilização in vitro',
      'TE - Transferência de embriões',
      'ICSI - Injeção intracitoplasmática',
      'OPU - Punção de oócitos',
    ];

    return (
      <View style={styles.inputContainer}>
        <View style={styles.inputLabel}>
          <Feather name="zap" size={16} color={Theme.colors.primary[600]} />
          <Text style={styles.inputLabelText}>Técnica Utilizada *</Text>
        </View>
        <View style={styles.techniqueContainer}>
          {techniques.map((technique) => (
            <TouchableOpacity
              key={technique}
              style={[
                styles.techniqueOption,
                formData.technique === technique && styles.techniqueOptionSelected,
              ]}
              onPress={() => updateField('technique', technique)}
            >
              <Text style={[
                styles.techniqueText,
                formData.technique === technique && styles.techniqueTextSelected,
              ]}>
                {technique}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>Novo Embrião</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <Text style={styles.headerSubtitle}>
          Registrar novo embrião no sistema
        </Text>
      </LinearGradient>

      {/* Formulário */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Identificação */}
        <PremiumCard
          title="Identificação"
          icon="tag"
          iconColor={Theme.colors.primary[600]}
          delay={0}
        >
          {renderInput(
            'Código do Embrião *',
            'code',
            'Ex: EMB006',
            'hash',
            false,
            'default',
            'refresh-cw',
            generateCode
          )}
          
          {renderInput(
            'Data de Criação *',
            'creationDate',
            'AAAA-MM-DD',
            'calendar'
          )}
        </PremiumCard>

        {/* Informações do Pai */}
        <PremiumCard
          title="Informações do Pai"
          icon="user"
          iconColor={Theme.colors.primary[600]}
          delay={200}
        >
          {renderInput(
            'Nome do Pai *',
            'fatherName',
            'Ex: Apollo Don Steel',
            'user'
          )}
          
          {renderInput(
            'Registro do Pai *',
            'fatherRegistration',
            'Ex: P250402',
            'bookmark'
          )}
          
          {renderInput(
            'ID do Pai (opcional)',
            'fatherId',
            'ID interno do sistema',
            'hash'
          )}
        </PremiumCard>

        {/* Informações da Mãe */}
        <PremiumCard
          title="Informações da Mãe"
          icon="heart"
          iconColor={Theme.colors.success[600]}
          delay={400}
        >
          {renderInput(
            'Nome da Mãe *',
            'motherName',
            'Ex: Lady Holland Jeck',
            'heart'
          )}
          
          {renderInput(
            'Registro da Mãe *',
            'motherRegistration',
            'Ex: P174830',
            'bookmark'
          )}
          
          {renderInput(
            'ID da Mãe (opcional)',
            'motherId',
            'ID interno do sistema',
            'hash'
          )}
        </PremiumCard>

        {/* Informações do Procedimento */}
        <PremiumCard
          title="Dados do Procedimento"
          icon="settings"
          iconColor={Theme.colors.warning[600]}
          delay={600}
        >
          {renderTechniqueSelector()}
          
          {renderInput(
            'Veterinário Responsável *',
            'veterinarian',
            'Ex: Dr. José Silva',
            'user'
          )}
          
          {renderInput(
            'Clínica/Laboratório *',
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
          delay={800}
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
              • Após a criação, o embrião ficará com status "Congelado"
            </Text>
            <Text style={styles.infoText}>
              • Para utilizar o embrião, será necessário ativá-lo com uma receptora
            </Text>
            <Text style={styles.infoText}>
              • Certifique-se de que todas as informações estão corretas
            </Text>
            <Text style={styles.infoText}>
              • O código do embrião deve ser único no sistema
            </Text>
          </View>
        </View>

        {/* Espaçamento para o botão flutuante */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão de criação */}
      <TouchableOpacity
        style={[styles.createButton, loading && styles.createButtonDisabled]}
        onPress={handleCreateEmbryo}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            loading 
              ? [Theme.colors.neutral[400], Theme.colors.neutral[500]]
              : [Theme.colors.primary[500], Theme.colors.primary[600]]
          }
          style={styles.createButtonGradient}
        >
          <Feather 
            name={loading ? "clock" : "plus"} 
            size={20} 
            color="#ffffff" 
          />
          <Text style={styles.createButtonText}>
            {loading ? 'Criando...' : 'Criar Embrião'}
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
  inputWrapper: {
    position: 'relative',
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
  inputWithRightIcon: {
    paddingRight: 50,
  },
  rightIconButton: {
    position: 'absolute',
    right: Theme.spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  techniqueContainer: {
    // Styled inline
  },
  techniqueOption: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  techniqueOptionSelected: {
    borderColor: Theme.colors.primary[600],
    backgroundColor: Theme.colors.primary[50],
  },
  techniqueText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[700],
  },
  techniqueTextSelected: {
    color: Theme.colors.primary[700],
    fontWeight: Theme.typography.weights.semibold as any,
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
  createButton: {
    position: 'absolute',
    bottom: Theme.spacing.lg,
    left: Theme.spacing.lg,
    right: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.lg,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: Theme.typography.sizes.base,
    fontWeight: Theme.typography.weights.bold as any,
    marginLeft: Theme.spacing.sm,
  },
});

export default CriarEmbriaoScreen;
