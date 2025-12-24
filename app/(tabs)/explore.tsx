import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  const enrolledCourses = [
    {
      id: 'c1',
      title: 'Anatomy & Physiology Basics',
      instructor: 'Dr. Sarah Malik',
      progress: 64,
      nextExam: 'Midterm · 24 Dec, 10:00 AM',
    },
    {
      id: 'c2',
      title: 'Clinical Pharmacology',
      instructor: 'Prof. Ahmed Khan',
      progress: 32,
      nextExam: 'Quiz 3 · 28 Dec, 2:00 PM',
    },
    {
      id: 'c3',
      title: 'Medical Ethics & Law',
      instructor: 'Dr. Ayesha Rahman',
      progress: 80,
      nextExam: 'Final Exam · 05 Jan, 9:00 AM',
    },
  ];

  // timer

  const handleOpenExams = () => {
    router.push('/exam/exams');
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: palette.tabBackground }]}>
        <View>
          <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]}>Enrolled Courses</Text>
          <Text style={[styles.headerSubtitle, { color: palette.mutedText }]}>Continue where you left off</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Ionicons name="school" size={24} color={palette.primary} />
        </View>
      </View>

      {/* Questions Scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {enrolledCourses.map(course => (
          <View
            key={course.id}
            style={[styles.questionCard, { backgroundColor: palette.cardBackground }]}
          >
            <View style={styles.questionHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.courseTitle, { color: palette.surfaceDarkText }]}>
                  {course.title}
                </Text>
                <Text style={[styles.courseInstructor, { color: palette.mutedText }]}>
                  {course.instructor}
                </Text>
              </View>
              <View style={styles.progressBadge}>
                <Ionicons name="time-outline" size={16} color={palette.primary} />
                <Text style={[styles.progressText, { color: palette.primary }]}>
                  {course.progress}%
                </Text>
              </View>
            </View>

            <View style={styles.courseMetaRow}>
              <View style={styles.courseMetaItem}>
                <Ionicons name="calendar-outline" size={16} color={palette.iconMuted} />
                <Text style={[styles.metaText, { color: palette.subtleText }]}>
                  {course.nextExam}
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: palette.borderSubtle }]}
                activeOpacity={0.9}
              >
                <Ionicons name="play-outline" size={18} color={palette.primary} />
                <Text style={[styles.secondaryButtonText, { color: palette.primary }]}>Continue Course</Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: palette.primary }]}
                onPress={handleOpenExams}
                activeOpacity={0.9}
              >
                <Ionicons name="document-text-outline" size={18} color={palette.accentTealSofter} />
                <Text
                  style={[styles.submitButtonText, { color: palette.accentTealSofter }]}
                >
                  Exams
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },

  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.cardBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.light.surfaceDarkText },
  headerSubtitle: { marginTop: 4, fontSize: 13, color: Colors.light.mutedText },

  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.accentTealSofter,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: { padding: 20, paddingBottom: 80 },

  questionCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.light.borderSubtle,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  courseInstructor: {
    marginTop: 4,
    fontSize: 13,
  },

  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.light.accentTealSofter,
    gap: 4,
  },

  progressText: {
    fontSize: 13,
    fontWeight: '600',
  },

  courseMetaRow: {
    marginTop: 6,
    paddingVertical: 6,
  },

  courseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    fontSize: 12,
  },

  actionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.borderSubtle,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  submitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  submitButtonText: { color: Colors.light.accentTealSofter, fontWeight: '600', fontSize: 14 },
});
