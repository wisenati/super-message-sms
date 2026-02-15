import React, { useState } from 'react';
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
import { Container, Card, Input } from '@/components/ui';
import { useMessages, Message } from '@/hooks/useMessages';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { format } from 'date-fns';
import { syncSMSToFirebase, simulateIncomingSMS } from '@/lib/sms-sync';
import { useAuth } from '@/hooks/useAuth';

const BankBadge = () => (
  <View style={[styles.badge, styles.bankBadge]}>
    <Ionicons name="card-outline" size={12} color={colors.success} />
    <Text style={styles.badgeText}>BANK</Text>
  </View>
);

const SpamBadge = () => (
  <View style={[styles.badge, styles.spamBadge]}>
    <Ionicons name="warning-outline" size={12} color={colors.error} />
    <Text style={[styles.badgeText, { color: colors.error }]}>SPAM</Text>
  </View>
);

export default function InboxScreen() {
  const { messages, loading } = useMessages();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredMessages = messages.filter((m) =>
    m.sender_number.toLowerCase().includes(search.toLowerCase()) ||
    m.message_text.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulate = async () => {
    if (user) {
      await simulateIncomingSMS(user.uid);
    }
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 50).duration(500)}>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/message/[id]', params: { id: item.id } })}
        activeOpacity={0.7}
      >
        <Card style={[styles.messageCard, item.is_bank && styles.bankCard]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.sender_number.substring(0, 1).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.textContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.sender}>{item.sender_number}</Text>
                <Text style={styles.time}>
                  {format(new Date(item.timestamp), 'HH:mm')}
                </Text>
              </View>
              
              <Text style={styles.preview} numberOfLines={1}>
                {item.message_text}
              </Text>
              
              <View style={styles.footerRow}>
                {item.is_bank && <BankBadge />}
                {item.is_spam && <SpamBadge />}
                {!item.is_bank && !item.is_spam && (
                  <View style={styles.typeTag}>
                    <Text style={styles.typeText}>{item.message_type.toUpperCase()}</Text>
                  </View>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Search messages..."
              value={search}
              onChangeText={setSearch}
              leftIcon={<Ionicons name="search-outline" size={20} color={colors.textTertiary} />}
            />
          </View>
          <TouchableOpacity onPress={handleSimulate} style={styles.simulateButton}>
            <Ionicons name="flash-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No messages yet.</Text>
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
  searchContainer: {
    padding: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  simulateButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100, // Space for tab bar
  },
  messageCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 0,
    borderRadius: borderRadius.lg,
  },
  bankCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sender: {
    ...typography.bodyBold,
    color: colors.text,
  },
  time: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  preview: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.backgroundTertiary,
  },
  bankBadge: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
  },
  spamBadge: {
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 3,
  },
  typeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.backgroundTertiary,
  },
  typeText: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textTertiary,
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
  },
});
