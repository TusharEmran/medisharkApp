import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StudyPacksCard from '../../components/StudyPacksCard';
import { Colors } from '../../constants/theme';
import { useTheme } from '../theme/ThemeContext';

// Temporary dummy submodules; later can be replaced with API (getCourseLessons)
const DUMMY_SUBMODULES = [
  {
    id: 'sub-1',
    title: 'Chapter-wise MCQ Practice',
    description: 'Practice by chapters with detailed explanations.',
  },
  {
    id: 'sub-2',
    title: 'Full Mock Tests',
    description: 'Simulated full-length admission tests.',
  },
  {
    id: 'sub-3',
    title: 'Past Year Questions',
    description: 'Previous years question sets for revision.',
  },
];

const SubmodulePacks: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string }>();
  const courseTitle = params.title ?? 'Submodules';
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

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
          {courseTitle}
        </Text>

        {/* Spacer to balance back button for centered title */}
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {DUMMY_SUBMODULES.map((sub) => (
          <StudyPacksCard
            key={sub.id}
            title={sub.title}
            subtitle={sub.description}
            meta="12 lessons • 3h 20min"
            thumbnail="medisharkcourse.webp"
            onPress={() => {
              router.push({
                pathname: '/lesssonPacks/SubmoduleDetail',
                params: {
                  title: sub.title,
                  description: sub.description,
                },
              });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 0,
    color: Colors.light.surfaceDarkText,
  },
  rightSpacer: {
    width: 32,
  },
  listContainer: {
    paddingBottom: 120,
  },
});

export default SubmodulePacks;
