import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import Theme from '../../constants/Theme';

export default function Perfil() {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 1, title: 'Dados Pessoais', icon: 'user', color: Theme.colors.primary[600] },
    { id: 2, title: 'Configurações', icon: 'settings', color: Theme.colors.neutral[600] },
    { id: 3, title: 'Notificações', icon: 'bell', color: Theme.colors.warning[600] },
    { id: 4, title: 'Segurança', icon: 'shield', color: Theme.colors.success[600] },
    { id: 5, title: 'Ajuda', icon: 'help-circle', color: Theme.colors.primary[500] },
    { id: 6, title: 'Sobre', icon: 'info', color: Theme.colors.neutral[500] },
  ];

  const handleLogout = () => {
    signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit-3" size={24} color={Theme.colors.primary[50]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: Theme.colors.primary[200] }]}>
              <Feather name="user" size={40} color={Theme.colors.primary[600]} />
            </View>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Feather name="camera" size={16} color={Theme.colors.primary[50]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'usuario@haras.com'}</Text>
            <Text style={styles.userRole}>Administrador</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Cavalos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Prenhas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Baias</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Feather name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Theme.colors.neutral[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appName}>Haras Pro</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
          <Text style={styles.appDescription}>
            Sistema de gestão profissional para haras
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={Theme.colors.error[600]} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.primary[600],
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[50],
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: Theme.colors.primary[50],
    margin: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.neutral[600],
    marginBottom: 4,
  },
  userRole: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.primary[600],
    fontWeight: Theme.typography.weights.medium as any,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Theme.colors.primary[50],
    marginHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Theme.typography.sizes['2xl'],
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
  },
  statLabel: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginTop: 4,
  },
  menuContainer: {
    marginHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary[50],
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  menuTitle: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.primary[700],
    fontWeight: Theme.typography.weights.medium as any,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
  },
  appName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: Theme.typography.weights.bold as any,
    color: Theme.colors.primary[700],
    marginBottom: 4,
  },
  appVersion: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[600],
    marginBottom: 8,
  },
  appDescription: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.neutral[500],
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.error[50],
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  logoutText: {
    fontSize: Theme.typography.sizes.base,
    color: Theme.colors.error[600],
    fontWeight: Theme.typography.weights.medium as any,
    marginLeft: Theme.spacing.sm,
  },
});
