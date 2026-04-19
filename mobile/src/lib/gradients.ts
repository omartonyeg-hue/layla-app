import { gradient } from '../theme/tokens';

// Backend stores a token key on each Event row; the mobile app owns the actual
// color stops. Unknown keys fall back to the gold signature so nothing ever
// renders a flat background.
const map: Record<string, (typeof gradient)[keyof typeof gradient]> = {
  gold: gradient.gold,
  goldShine: gradient.goldShine,
  sunset: gradient.sunset,
  night: gradient.night,
  valet: gradient.valet,
  community: gradient.community,
  sahel: gradient.sahel,
};

export const resolveGradient = (key: string | undefined | null) =>
  (key && map[key]) || gradient.gold;
