import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StudyPacksCard from '../../components/StudyPacksCard';
import { Colors } from '../../constants/theme';
import { useTheme } from '../theme/ThemeContext';
import { getAllCourses, Course } from '../api/examPackCategory.api';

const AllExamPacks: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch {
      }
    };
    loadCourses();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>      
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={palette.surfaceDarkText} />
        </TouchableOpacity>

        <Text style={[styles.heading, { color: palette.surfaceDarkText }]} numberOfLines={1}>
          All Exam Packs
        </Text>

        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course) => {
          const isFavorite = favorites.has(course.id);

          return (
            <StudyPacksCard
              key={course.id}
              title={course.title}
              subtitle={course.description}
              meta={`${course.totalLessons} lessons • ${course.progress}% complete`}
              thumbnail={course.thumbnail}
              isFavorite={isFavorite}
              onPress={() => {
                router.push({
                  pathname: '/lesssonPacks/SubmodulePacks',
                  params: { title: course.title },
                });
              }}
              onToggleFavorite={() => toggleFavorite(course.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  rightSpacer: {
    width: 36,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});

export default AllExamPacks;
