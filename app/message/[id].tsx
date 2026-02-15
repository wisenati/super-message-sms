import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Container, Card } from '@/components/ui';
import { useMessages } from '@/hooks/useMessages';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { format } from 'date-fns';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages } = useMessages();
  const router = useRouter();

  const message = messages.find((m) => m.id === id);

  if (!message) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Message not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Message Detail',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(800)}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{message.sender_number.substring(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.sender}>{message.sender_number}</Text>
              <Text style={styles.time}>{format(new Date(message.timestamp), 'EEEE, MMMM do, HH:mm')}</Text>
            </View>
          </View>

          {message.is_bank && (
            <View style={styles.bankAlert}>
              <Ionicons name="card" size={20} color={colors.success} />
              <Text style={styles.bankAlertText}>Bank Alert</Text>
            </View>
          )}

          {message.is_spam && (
            <View style={styles.spamAlert}>
              <Ionicons name="warning" size={20} color={colors.error} />
              <Text style={styles.spamAlertText}>Spam Warning</Text>
            </View>
          )}

          <Card style={styles.contentCard}>
            <Card.Content>
              <Text style={styles.messageText}>{message.message_text}</Text>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerInfo}>Type: {message.message_type === 'sms' ? 'SMS Message' : 'In-App Message'}</Text>
            <Text style={styles.footerInfo}>Security: Secure Backup</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    ...typography.h1,
    color: colors.primary,
  },
  headerText: {
    flex: 1,
  },
  sender: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
    opacity: 0.6,
  },
  bankAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  bankAlertText: {
    ...typography.captionBold,
    color: colors.success,
    marginLeft: spacing.sm,
  },
  spamAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  spamAlertText: {
    ...typography.captionBold,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  contentCard: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
  },
  messageText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 28,
  },
  footer: {
    marginTop: spacing.xxl,
    opacity: 0.4,
  },
  footerInfo: {
    ...typography.tiny,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
