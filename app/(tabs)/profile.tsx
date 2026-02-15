import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Container, Avatar, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { auth, database } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (user) {
      await logout();
      router.replace('/');
    }
  };

  const UserInfoItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <Container safeArea style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(1000)} style={styles.profileHeader}>
          <Avatar
            size="xxl"
            name={user?.phoneNumber || 'User'}
            style={styles.avatar}
          />
          <Text style={styles.displayName}>{user?.phoneNumber || 'User'}</Text>
          
          <View style={styles.statusBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <UserInfoItem icon="call-outline" label="Phone Number" value={user?.phoneNumber || '...'} />
          <UserInfoItem icon="calendar-outline" label="Joined" value="Just now" />
          <UserInfoItem icon="shield-checkmark-outline" label="Security" value="Active" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.menuText}>Privacy</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <Button
          variant="ghost"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={{ color: colors.error }}
        >
          Sign Out
        </Button>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  avatar: {
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  displayName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    opacity: 0.6,
    marginBottom: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    ...typography.tiny,
    color: colors.success,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.smallBold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    opacity: 0.6,
  },
  infoValue: {
    ...typography.captionBold,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.md,
    marginHorizontal: spacing.xl,
  },
});
