import React, { useMemo } from 'react';
import { Text, type TextStyle } from 'react-native';
import { color, fontFamily } from '../theme/tokens';

// Renders a caption string with @mentions and #hashtags highlighted and
// tappable. Mentions lookup happens at tap time (via onPressMention) so the
// parser doesn't need to pre-resolve handle → account id.
//
// Regex rules match Instagram's conventions:
// - @handle: 3-20 chars, a-z0-9_, case-insensitive-normalized
// - #tag: 1+ chars a-zA-Z0-9_, must be preceded by start/whitespace/punct
// - Email-like "a@b" doesn't trigger a mention (preceded by word char)

type Token =
  | { kind: 'text'; text: string }
  | { kind: 'mention'; text: string; handle: string }
  | { kind: 'hashtag'; text: string; tag: string };

// Combined regex: mentions OR hashtags.
// Look-behind isn't universal in RN's JS engine, so we include the optional
// preceding boundary char in the capture then re-inject it as plain text.
const TOKEN_RE = /(^|[^a-zA-Z0-9_])(@[a-zA-Z0-9_]{3,20}|#[a-zA-Z0-9_]+)/g;

const parse = (input: string): Token[] => {
  const out: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((m = TOKEN_RE.exec(input)) !== null) {
    const [, boundary, tokenRaw] = m;
    const tokenStart = m.index + boundary.length;
    // Flush intervening text (including the boundary char).
    if (tokenStart > last) {
      out.push({ kind: 'text', text: input.slice(last, tokenStart) });
    }
    if (tokenRaw.startsWith('@')) {
      out.push({ kind: 'mention', text: tokenRaw, handle: tokenRaw.slice(1).toLowerCase() });
    } else {
      out.push({ kind: 'hashtag', text: tokenRaw, tag: tokenRaw.slice(1).toLowerCase() });
    }
    last = tokenStart + tokenRaw.length;
  }
  if (last < input.length) {
    out.push({ kind: 'text', text: input.slice(last) });
  }
  return out;
};

type Props = {
  children: string;
  style?: TextStyle;
  mentionColor?: string;
  hashtagColor?: string;
  onPressMention?: (handle: string) => void;
  onPressHashtag?: (tag: string) => void;
};

export const RichCaption: React.FC<Props> = ({
  children,
  style,
  mentionColor = color.gold[500],
  hashtagColor = color.violet,
  onPressMention,
  onPressHashtag,
}) => {
  const tokens = useMemo(() => parse(children), [children]);
  return (
    <Text style={style}>
      {tokens.map((t, i) => {
        if (t.kind === 'text') {
          return <Text key={i}>{t.text}</Text>;
        }
        if (t.kind === 'mention') {
          return (
            <Text
              key={i}
              onPress={onPressMention ? () => onPressMention(t.handle) : undefined}
              style={{
                color: mentionColor,
                fontWeight: '800',
                fontFamily: fontFamily.body,
              }}
            >
              {t.text}
            </Text>
          );
        }
        return (
          <Text
            key={i}
            onPress={onPressHashtag ? () => onPressHashtag(t.tag) : undefined}
            style={{
              color: hashtagColor,
              fontWeight: '700',
              fontFamily: fontFamily.body,
            }}
          >
            {t.text}
          </Text>
        );
      })}
    </Text>
  );
};

export default RichCaption;
