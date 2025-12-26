
import { Platform } from 'react-native';

const tintColorLight = '#2563eb';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // App design tokens (light)
    primary: '#2563eb',   
    primarySoft: '#3b82f6',   
    primaryMuted: '#1d4ed8', 
    accentTealSoft: '#dbeafe',  
    accentTealSofter: '#eff6ff', 
    accentEmeraldSoft: '#0c67d7ff', 
    tabBackground: '#ffffff',
    cardBackground: '#ffffff',
    cardBackgroundSoft: '#f3f4f6',
    surfaceDarkText: '#1f2937',
    mutedText: '#6b7280',
    subtleText: '#4b5563',
    borderSubtle: '#e5e7eb',
    iconMuted: '#9ca3af',
    warning: '#f59e0b',
    greenPrimary:"#10b981"
  },
  dark: {
    text: '#E5E7EB',
    background: '#020617',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // App design tokens (dark)
    primary: '#60a5fa',            // blue-400
    primarySoft: '#3b82f6',        // blue-500
    primaryMuted: '#1e3a8a',       // blue-900
    accentTealSoft: '#0b1220',     // deep blue surface
    accentTealSofter: '#00092cff',
    accentEmeraldSoft: '#1e3a8a',  // blue-900
    cardBackground: '#000721ff',
    tabBackground: '#020617',
    cardBackgroundSoft: '#0b1120',
    surfaceDarkText: '#f9fafb',
    mutedText: '#9ca3af',
    subtleText: '#6b7280',
    borderSubtle: '#1f2937',
    iconMuted: '#9ca3af',
    warning: '#f59e0b',
    greenPrimary: "#10b981",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
