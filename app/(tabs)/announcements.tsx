import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Container, Card } from '@/components/ui';
import { useAnnouncements, Announcement } from '@/hooks/useAnnouncements';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { format } from 'date-fns';

export default function AnnouncementsScreen() {
  const { announcements, loading } = useAnnouncements();

  const getIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'alert': return 'alert-circle';
      case 'update': return 'cloud-download';
      case 'promo': return 'gift';
      default: return 'information-circle';
    }
  };

  const getColor = (type: Announcement['type']) => {
    switch (type) {
      case 'alert': return colors.error;
      case 'update': return colors.info;
      case 'promo': return colors.accent;
      default: return colors.primary;
    }
  };

  const renderItem = ({ item, index }: { item: Announcement; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(800)}>
      <Card style={styles.announcementCard}>
        <Card.Content style={styles.cardContent}>
          <View style={[styles.typeIcon, { backgroundColor: getColor(item.type) + '20' }]}>
            <Ionicons name={getIcon(item.type) as any} size={24} color={getColor(item.type)} />
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{format(new Date(item.timestamp), 'MMM d')}</Text>
            </View>
            
            <Text style={styles.content}>{item.content}</Text>
            
            {item.link && (
              <TouchableOpacity onPress={() => Linking.openURL(item.link!)} style={styles.linkButton}>
                <Text style={[styles.linkText, { color: getColor(item.type) }]}>Learn More</Text>
                <Ionicons name="arrow-forward" size={14} color={getColor(item.type)} />
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );

  return (
    <Container safeArea style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News & Alerts</Text>
        <Text style={styles.headerSubtitle}>Important updates for you</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={announcements}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="radio-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No updates yet.</Text>
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
  announcementCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 0,
    borderRadius: borderRadius.lg,
  },
  cardContent: {
    flexDirection: 'row',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  content: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  linkText: {
    ...typography.smallBold,
    marginRight: 4,
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
