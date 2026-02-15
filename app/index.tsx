import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { Button, Input } from '@/components/ui';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const { user, loading, login, isAuthenticated } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!hasSeen) {
        router.replace('/onboarding');
      } else {
        setCheckingOnboarding(false);
      }
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !checkingOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, checkingOnboarding]);

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError('Please enter a valid phone number');
      return;
    }
    
    try {
      setAuthError('');
      await login(phoneNumber, pin);
    } catch (error: any) {
      setAuthError('Something went wrong. Please try again.');
    }
  };

  if (loading || checkingOnboarding) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="chatbubble-ellipses" size={40} color={colors.primary} />
              </View>
              <Text style={styles.title}>Super Message</Text>
              <Text style={styles.subtitle}>Clean. Simple. Secure.</Text>
            </View>
            
            <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.formCard}>
              <Text style={styles.formTitle}>Welcome</Text>
              <Text style={styles.formSubtitle}>Enter your phone number to start.</Text>
              
              <View style={styles.form}>
                <Input
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="e.g. 08012345678"
                  keyboardType="phone-pad"
                  leftIcon={<Ionicons name="call-outline" size={20} color={colors.textTertiary} />}
                />
                
                <View style={{ height: spacing.lg }} />
                
                <Input
                  label="Password (6-digit PIN, optional)"
                  value={pin}
                  onChangeText={setPin}
                  placeholder="Set a simple PIN"
                  keyboardType="number-pad"
                  maxLength={6}
                  secureTextEntry
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />}
                />
                
                {authError ? (
                  <Animated.Text entering={FadeIn} style={styles.errorText}>
                    {authError}
                  </Animated.Text>
                ) : null}
                
                <View style={{ height: spacing.xl }} />
                
                <Button 
                  variant="primary" 
                  onPress={handleLogin} 
                  style={styles.mainButton}
                  loading={loading}
                >
                  Start Messaging
                </Button>
                
                <Text style={styles.footerText}>
                  By continuing, you agree to our simple rules.
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  formCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '600',
  },
  formSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
  },
  mainButton: {
    height: 56,
    borderRadius: borderRadius.lg,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  footerText: {
    ...typography.tiny,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 16,
  },
});
