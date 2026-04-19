import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type Account } from './api';

// Instagram-style mention typeahead: watches a caption string + cursor
// position. When the cursor is inside an active `@word` fragment (word
// character class is [a-zA-Z0-9_]), we surface a list of matching accounts
// from /accounts/search and expose `select(account)` to replace the fragment
// with `@handle ` in the caption.
//
// The caller owns the TextInput value/setter; this hook is pure state
// derivation + debounced network.

type Options = {
  // Cap results shown. Backend limit is 50; 6 fits above the keyboard on
  // most devices without covering the input.
  limit?: number;
  debounceMs?: number;
};

export type MentionState = {
  active: boolean;
  query: string;           // the text after `@` (without the `@` itself)
  results: Account[];
  loading: boolean;
  // Replace the active `@fragment` in the caption with `@handle ` and move
  // the cursor to the end of the insert. Returns { value, cursor } so the
  // caller can setText(value) and setSelection(cursor).
  select: (account: Account) => { value: string; cursor: number };
};

// Given a caption and cursor position, find the active @-fragment if any.
// Returns { start, end, query } where start is the position of the `@`.
export const findActiveMention = (
  value: string,
  cursor: number,
): { start: number; end: number; query: string } | null => {
  if (cursor <= 0) return null;

  // Walk back from the cursor until we hit a non-word char or `@`.
  let i = cursor - 1;
  while (i >= 0 && /[a-zA-Z0-9_]/.test(value[i]!)) i--;
  if (i < 0) return null;
  if (value[i] !== '@') return null;

  // `@` must be at start of string or preceded by whitespace/newline/punct.
  if (i > 0) {
    const prev = value[i - 1]!;
    if (/[a-zA-Z0-9_]/.test(prev)) return null; // email-like "a@b" — don't trigger
  }

  // Walk forward to find the end of the current fragment.
  let end = cursor;
  while (end < value.length && /[a-zA-Z0-9_]/.test(value[end]!)) end++;

  return { start: i, end, query: value.slice(i + 1, cursor) };
};

export const useMentionTypeahead = (
  token: string,
  value: string,
  setValue: (next: string) => void,
  cursor: number,
  opts: Options = {},
): MentionState => {
  const { limit = 6, debounceMs = 180 } = opts;

  const [results, setResults] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  const active = findActiveMention(value, cursor);
  const query = active?.query ?? '';
  const isActive = active !== null;

  // Debounced search. Cancel stale requests by id.
  useEffect(() => {
    if (!isActive || query.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    const myId = ++reqId.current;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.searchAccounts(token, query, { limit });
        if (reqId.current === myId) setResults(res.accounts);
      } catch {
        if (reqId.current === myId) setResults([]);
      } finally {
        if (reqId.current === myId) setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, isActive, token, limit, debounceMs]);

  const select = useCallback(
    (account: Account) => {
      const match = findActiveMention(value, cursor);
      if (!match) return { value, cursor };
      const insert = `@${account.handle} `;
      const next = value.slice(0, match.start) + insert + value.slice(match.end);
      const nextCursor = match.start + insert.length;
      setValue(next);
      return { value: next, cursor: nextCursor };
    },
    [value, cursor, setValue],
  );

  return { active: isActive && query.length > 0, query, results, loading, select };
};
