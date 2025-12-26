import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';
import StudyPacksCard from '../../components/StudyPacksCard';
import { ROOT_COURSES } from '../lesssonPacks/submoduleData';

export default function ExploreScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  const enrolledCourses = ROOT_COURSES;

  const handleOpenSubmodule = (subId: string, title: string) => {
    router.push({
      pathname: '/lesssonPacks/SubmodulePacks',
      params: {
        title,
        parentId: subId,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: palette.tabBackground }]}>
        <View>
          <Text style={[styles.headerTitle, { color: palette.surfaceDarkText }]}>Enrolled Exam Packs</Text>
          <Text style={[styles.headerSubtitle, { color: palette.mutedText }]}>Tap a course to drill into submodules</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Ionicons name="school" size={24} color={palette.primary} />
        </View>
      </View>

      {/* Enrolled submodules as StudyPacks cards */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {enrolledCourses.map((course) => (
          <StudyPacksCard
            key={course.id}
            title={course.title}
            subtitle={course.description}
            meta="Submodules"
            thumbnail="medisharkcourse.webp"
            onPress={() => handleOpenSubmodule(course.id, course.title)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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
