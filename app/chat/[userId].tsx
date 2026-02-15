import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Avatar } from '@/components/ui';
import { useChatRoom, ChatMessage } from '@/hooks/useChatRoom';
import { useAuth } from '@/hooks/useAuth';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { format } from 'date-fns';

export default function ChatRoomScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user } = useAuth();
  const { messages, sendMessage, setTyping, otherUserTyping, deleteMessage } = useChatRoom(userId);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
      setTyping(false);
    }
  };

  const onType = (text: string) => {
    setInputText(text);
    if (text.length > 0) {
      setTyping(true);
    } else {
      setTyping(false);
    }
  };

  const handleLongPress = (message: ChatMessage) => {
    if (message.sender_id === user?.uid) {
      Alert.alert(
        'Delete Message',
        'Do you want to delete this message?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteMessage(message.id) },
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender_id === user?.uid;
    return (
      <Animated.View
        entering={isMe ? SlideInRight : SlideInLeft}
        style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}
      >
        <TouchableOpacity
          onLongPress={() => handleLongPress(item)}
          activeOpacity={0.8}
          style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMe && { color: colors.background + 'AA' }]}>
              {item.timestamp ? format(new Date(item.timestamp), 'HH:mm') : ''}
            </Text>
            {isMe && (
              <Ionicons
                name={item.status === 'delivered' ? "checkmark-done" : "checkmark"}
                size={12}
                color={colors.background + 'AA'}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Chat',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {otherUserTyping && (
        <Animated.View entering={FadeIn} style={styles.typingIndicator}>
          <Text style={styles.typingText}>Typing...</Text>
        </Animated.View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={onType}
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="send" size={20} color={inputText.trim() ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messageList: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  messageWrapper: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    position: 'relative',
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: colors.backgroundSecondary,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    ...typography.body,
    fontSize: 15,
  },
  myMessageText: {
    color: colors.background,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    ...typography.tiny,
    color: colors.textTertiary,
    opacity: 0.7,
  },
  typingIndicator: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  typingText: {
    ...typography.small,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
