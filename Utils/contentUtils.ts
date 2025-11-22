import { IVODRatings } from "@/types/api/content.types";

export function generateGradientColors(hexColor: string): string[] {
  // HEX → RGB
  const hex = hexColor.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // RGB → HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h /= 6;
    }

    return { h, s, l };
  };

  // HSL → RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const rgbToHex = ({ r, g, b }: { r: number, g: number, b: number }) =>
    `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  const baseHSL = rgbToHsl(r, g, b);

  // Brighten
  const color1 = hslToRgb(baseHSL.h, Math.min(1, baseHSL.s * 1.4), Math.min(1, baseHSL.l + 0.25)); // strong bright
  const color2 = hslToRgb(baseHSL.h, baseHSL.s, Math.min(1, baseHSL.l + 0.1));                     // slight bright

  // Transparent black variants
  const lightBlack = '#00000030';   // ~18% opacity
  const mediumBlack = '#00000080';  // ~50% opacity

  return [
    rgbToHex(color1),
    rgbToHex(color2),
    hexColor,
    lightBlack,
    mediumBlack
  ];
}





export const subtractYears = (date: Date, years: number): Date => {
  date.setFullYear(date.getFullYear() - years);
  return date;
};

export function getWatchTag(type: string, live?: boolean): string {
  if (live && type === 'exclusive') {
    return 'live-watch-exclusive';
  }

  if (!live && type === 'exclusive') {
    return 'video-watch-exclusive';
  }

  if (!live && type === 'premium') {
    return 'video-watch-premium';
  }

  return '';
}

export function formatRatingStats(data: IVODRatings): Record<string, number> {
  const result: Record<string, number> = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    total: 0,
  };

  // Set total
  if (data.totalStats.length > 0) {
    result.total = data.totalStats[0].totalRatingsDocuments;
  }

  // Fill rates 1 to 5
  for (const stat of data.groupStats) {
    const rateKey = String(stat.rate);
    if (["1", "2", "3", "4", "5"].includes(rateKey)) {
      result[rateKey] = stat.count;
    }
  }

  return result;
}