import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../app/theme/ThemeContext';
import { Colors } from '../constants/theme';

export interface CourseOverviewLesson {
  id: number;
  title: string;
  duration: string;
}

export interface CourseOverviewProps {
  title: string;
  level: string;
  lessonsCount: number;
  rating: number;
  duration: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  price?: string;
  lessons?: CourseOverviewLesson[];
  description?: string;
}

const DEFAULT_LESSONS: CourseOverviewLesson[] = [
  { id: 1, title: 'Introduction to the course', duration: '04:28 min' },
  { id: 2, title: 'Understanding key concepts', duration: '06:12 min' },
  { id: 3, title: 'First practice session', duration: '43:58 min' },
];

export const CourseOverview: React.FC<CourseOverviewProps> = ({
  title,
  level,
  lessonsCount,
  rating,
  duration,
  isFavorite,
  onToggleFavorite,
  onClose,
  price = '$399',
  lessons = DEFAULT_LESSONS,
  description = 'This course will guide you through key concepts with structured lessons and practical examples so you can prepare confidently for your admission exams.',
}) => {
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;
  const [activeTab, setActiveTab] = useState<'lessons' | 'description'>('lessons');

  return (
    <View style={[styles.overlay, { backgroundColor: palette.background }] }>
      <View style={[styles.sheet, { backgroundColor: palette.background }] }>
        <View style={styles.sheetHeaderRow}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="chevron-back" size={22} color={palette.surfaceDarkText} />
          </TouchableOpacity>
          <Text style={[styles.sheetTitle, { color: palette.surfaceDarkText }]}>Course Overview</Text>
          <TouchableOpacity onPress={onToggleFavorite} style={styles.favoritePill}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#ef4444' : palette.iconMuted}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.heroCard, { backgroundColor: palette.cardBackground }] }>
            <View style={[styles.heroImage, { backgroundColor: palette.accentTealSoft }] }>
              <View style={styles.heroPlayButtonOuter}>
                <View style={[styles.heroPlayButtonInner, { backgroundColor: palette.primary }] }>
                  <Ionicons name="play" size={22} color={palette.accentTealSofter} />
                </View>
              </View>
            </View>

            <View style={styles.heroBody}>
              <Text style={[styles.courseTitle, { color: palette.surfaceDarkText }]} numberOfLines={2}>
                {title}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItemRow}>
                  <Ionicons name="time-outline" size={14} color={palette.iconMuted} />
                  <Text style={[styles.metaText, { color: palette.mutedText }]}>{duration}</Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItemRow}>
                  <Ionicons name="book-outline" size={14} color={palette.iconMuted} />
                  <Text style={[styles.metaText, { color: palette.mutedText }]}> 
                    {lessonsCount} lessons
                  </Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItemRow}>
                  <Ionicons name="star" size={14} color={palette.warning} />
                  <Text style={[styles.metaText, { color: palette.surfaceDarkText }]}>{rating.toFixed(1)}</Text>
                </View>
              </View>

              <View style={styles.ctaRow}>
                <View style={[styles.pricePill, { backgroundColor: palette.cardBackgroundSoft }] }>
                  <Text style={[styles.priceText, { color: palette.surfaceDarkText }]}>{price}</Text>
                </View>
                <TouchableOpacity style={[styles.enrollButton, { backgroundColor: palette.primary }] }>
                  <Text style={[styles.enrollButtonText, { color: palette.accentTealSofter }]}>Enroll Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'lessons' && { borderBottomWidth: 2, borderBottomColor: palette.primary },
              ]}
              onPress={() => setActiveTab('lessons')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'lessons'
                    ? { color: palette.primary, fontWeight: '600' }
                    : { color: palette.mutedText },
                ]}
              >
                Lessons
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'description' && { borderBottomWidth: 2, borderBottomColor: palette.primary },
              ]}
              onPress={() => setActiveTab('description')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'description'
                    ? { color: palette.primary, fontWeight: '600' }
                    : { color: palette.mutedText },
                ]}
              >
                Description
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'lessons' ? (
            lessons.map((lesson) => (
              <View key={lesson.id} style={styles.lessonRow}>
                <View style={styles.lessonLeft}>
                  <View style={[styles.lessonPlayCircle, { backgroundColor: palette.cardBackgroundSoft }] }>
                    <Ionicons name="play" size={16} color={palette.primary} />
                  </View>
                  <View>
                    <Text
                      style={[styles.lessonTitle, { color: palette.surfaceDarkText }]}
                      numberOfLines={1}
                    >
                      {lesson.title}
                    </Text>
                    <Text style={[styles.lessonSubtitle, { color: palette.mutedText }] }>
                      {lesson.duration}
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color={palette.iconMuted} />
              </View>
            ))
          ) : (
            <View style={styles.descriptionContainer}>
              <Text style={[styles.descriptionText, { color: palette.mutedText }]}>
                {description}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    zIndex: 50,
    elevation: 50,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 28,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  closeButton: {
    padding: 6,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  favoritePill: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.04)',
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 4,
  },
  heroImage: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlayButtonOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  heroPlayButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBody: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(148,163,184,0.7)',
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 8,
  },
  tabItemActive: {
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 6,
  },
  tabItem: {
    marginRight: 24,
    paddingBottom: 6,
  },
  tabTextActive: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lessonPlayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  lessonSubtitle: {
    fontSize: 12,
  },
  descriptionContainer: {
    marginTop: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  pricePill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
  },
  enrollButton: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrollButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CourseOverview;
