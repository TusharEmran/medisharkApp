import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useTheme } from '../app/theme/ThemeContext';

export type StudyPacksCardProps = {
  title: string;
  subtitle: string;
  meta: string;
  thumbnail: string;
  isFavorite?: boolean;
  progressPercent?: number; // 0..100, renders a progress bar instead of meta text
  onPress?: () => void;
  onToggleFavorite?: () => void;
};

export const StudyPacksCard: React.FC<StudyPacksCardProps> = ({
  title,
  subtitle,
  meta,
  thumbnail,
  isFavorite = false,
  progressPercent,
  onPress,
  onToggleFavorite,
}) => {
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;
  const clampedProgress =
    typeof progressPercent === 'number'
      ? Math.max(0, Math.min(100, progressPercent))
      : null;
  // Map thumbnail string from API (e.g. 'ug.webp', 'pg.webp', 'gp.webp') to local assets.
  let imageSource: any;

  switch (thumbnail) {
    case 'ug.webp':
      imageSource = require('../assets/images/ug.webp');
      break;
    case 'pg.webp':
      imageSource = require('../assets/images/pg.webp');
      break;
    case 'gp.webp':
      imageSource = require('../assets/images/gp.webp');
      break;
    default:
      imageSource = require('../assets/images/medisharkcourse.webp');
      break;
  }

  return (
    <View style={styles.courseCardShadow}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View style={[styles.courseCard, { backgroundColor: palette.cardBackground }]}>
          <View style={[styles.courseIconCircle, { backgroundColor: palette.accentTealSoft }]}>
            <Image
              source={imageSource}
              style={styles.courseImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.courseContent}>
            <Text
              style={[styles.courseTitle, { color: palette.surfaceDarkText }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              style={[styles.courseBatch, { color: palette.primary }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
            {clampedProgress !== null ? (
              <View style={styles.progressWrap}>
                <Text style={[styles.progressText, { color: palette.mutedText }]} numberOfLines={1}>
                  {`${Math.round(clampedProgress)}% completed`}
                </Text>
                <View style={[styles.progressTrack, { backgroundColor: palette.cardBackgroundSoft }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: palette.primary,
                        width: `${clampedProgress}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : (
              <Text
                style={[styles.courseEnrolledOn, { color: palette.mutedText }]}
                numberOfLines={1}
              >
                {meta}
              </Text>
            )}
          </View>

          {onToggleFavorite && (
            <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#ef4444' : palette.iconMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  courseCardShadow: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  courseIconCircle: {
    width: 120,
    aspectRatio: 16 / 9,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  courseBatch: {
    fontSize: 13,
    marginBottom: 2,
  },
  courseEnrolledOn: {
    fontSize: 12,
  },
  progressWrap: {
    marginTop: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  favoriteButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

export default StudyPacksCard;
