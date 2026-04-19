import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import { Avatar, Micro } from '../components';
import { api, ApiError, type PostComment } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { haptic } from '../lib/haptics';
import type { CommunityStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CommunityStackParamList, 'Comments'>;

const MAX_COMMENT = 400;

const timeAgo = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const Comments: React.FC<Props> = ({ navigation, route }) => {
  const { postId } = route.params;
  const { token } = useSession();
  const [comments, setComments] = useState<PostComment[] | null>(null);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const load = async () => {
    try {
      const { comments } = await api.listComments(token, postId);
      setComments(comments);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || posting) return;
    setPosting(true);
    setError(null);
    try {
      const { comment } = await api.addComment(token, postId, trimmed);
      setComments((prev) => (prev ? [...prev, comment] : [comment]));
      setText('');
      haptic.success();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color.bg.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: color.stroke.soft,
          }}
        >
          <Pressable
            onPress={() => { haptic.tap(); navigation.goBack(); }}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: color.bg.surface,
              borderWidth: 1, borderColor: color.stroke.soft,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: color.text.primary, fontSize: 18, lineHeight: 20 }}>×</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.violet}>CONVERSATION</Micro>
            <Text style={{ color: color.text.primary, fontSize: 16, fontWeight: '800', marginTop: 2 }}>
              Comments
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 20, gap: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {comments === null ? (
            <View style={{ paddingTop: 24, alignItems: 'center' }}>
              <ActivityIndicator color={color.violet} />
            </View>
          ) : comments.length === 0 ? (
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text style={{ color: color.text.muted, fontSize: 13 }}>Be the first to comment.</Text>
            </View>
          ) : (
            comments.map((c) => (
              <View key={c.id} style={{ flexDirection: 'row', gap: 10 }}>
                <Avatar
                  name={c.author.name ?? 'M'}
                  color={c.author.avatarColor ?? color.gold[500]}
                  size={34}
                />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>
                      {c.author.name ?? 'Member'}
                    </Text>
                    <Text style={{ color: color.text.muted, fontSize: 11 }}>· {timeAgo(c.createdAt)}</Text>
                  </View>
                  <Text
                    style={{
                      color: color.text.primary,
                      fontSize: 14,
                      lineHeight: 20,
                      marginTop: 3,
                      fontFamily: fontFamily.body,
                    }}
                  >
                    {c.text}
                  </Text>
                </View>
              </View>
            ))
          )}
          {error ? <Text style={{ color: color.rose, fontSize: 13 }}>{error}</Text> : null}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 14,
            borderTopWidth: 1,
            borderTopColor: color.stroke.soft,
            backgroundColor: color.bg.base,
          }}
        >
          <TextInput
            value={text}
            onChangeText={(t) => setText(t.slice(0, MAX_COMMENT))}
            placeholder="Add a comment…"
            placeholderTextColor={color.text.muted}
            multiline
            style={{
              flex: 1,
              maxHeight: 100,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: radius.pill,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: text.length > 0 ? color.violet : color.stroke.soft,
              color: color.text.primary,
              fontSize: 14,
              fontFamily: fontFamily.body,
            }}
          />
          <Pressable
            onPress={submit}
            disabled={!text.trim() || posting}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: radius.pill,
              backgroundColor: text.trim() ? color.violet : color.bg.surface,
              borderWidth: 1,
              borderColor: text.trim() ? color.violet : color.stroke.soft,
              opacity: pressed || !text.trim() ? 0.7 : 1,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 72,
            })}
          >
            {posting ? (
              <ActivityIndicator color={color.text.primary} size="small" />
            ) : (
              <Text
                style={{
                  color: text.trim() ? color.text.primary : color.text.muted,
                  fontSize: 12,
                  fontWeight: '800',
                  letterSpacing: 0.6,
                }}
              >
                POST
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Comments;
