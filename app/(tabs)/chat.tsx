import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Container, Card, Avatar } from '@/components/ui';
import { useUsers, UserProfile } from '@/hooks/useUsers';
import Animated, { FadeInLeft } from 'react-native-reanimated';

export default function ChatsScreen() {
  const { users, loading } = useUsers();
  const router = useRouter();

  const renderItem = ({ item, index }: { item: UserProfile; index: number }) => (
    <Animated.View entering={FadeInLeft.delay(index * 50).duration(500)}>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/chat/[userId]', params: { userId: item.uid } })}
        activeOpacity={0.7}
      >
        <Card style={styles.chatCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.avatarContainer}>
              <Avatar
                size="lg"
                name={item.displayName || item.phoneNumber || 'User'}
                style={styles.avatar}
              />
              {item.status === 'online' && <View style={styles.onlineDot} />}
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.displayName || item.phoneNumber || 'User'}</Text>
              <Text style={styles.status} numberOfLines={1}>
                {item.status === 'online' ? 'Online' : 'Offline'}
              </Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Chat with other users</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No other users found.</Text>
            </View>
          }
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    opacity: 0.6,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  chatCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 0,
    borderRadius: borderRadius.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    backgroundColor: colors.backgroundTertiary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 2,
  },
  status: {
    ...typography.caption,
    color: colors.textSecondary,
    opacity: 0.8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    opacity: 0.5,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
