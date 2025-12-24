import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';
import CourseOverview from '../../components/CourseOverview';
import StudyPacksCard from '../../components/StudyPacksCard';
import { getAllCourses, Course } from '../api/examPackCategory.api';

const FILTERS = ['All', 'Medical', 'Dental', 'Engineering', 'University', 'Nursing'];

export default function QuestionBankScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOverview, setShowOverview] = useState(false);

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

  const filteredBanks = courses.filter((course) => {
    const matchesFilter =
      activeFilter === 'All' || course.category === activeFilter;

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.category.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesSearch;
  });

  const selectedBank = courses.find((c) => c.id === selectedCourseId) || null;

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>      
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: palette.surfaceDarkText }]}>Search</Text>
            <Text style={[styles.subtitle, { color: palette.mutedText }]}>Find your admission prep sets</Text>
          </View>
          <View style={[styles.headerBadge, { backgroundColor: palette.accentTealSoft }]}>
            <Ionicons name="help-circle" size={20} color={palette.primaryMuted} />
            <Text style={[styles.headerBadgeText, { color: palette.primaryMuted }]}>Practice</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: palette.cardBackgroundSoft }]}>
            <Ionicons
              name="search"
              size={18}
              color={palette.iconMuted}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search now..."
              placeholderTextColor={palette.iconMuted}
              style={[styles.searchInput, { color: palette.surfaceDarkText }]}
            />
          </View>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip,
                  { borderColor: palette.borderSubtle, backgroundColor: palette.cardBackground },
                  isActive && { backgroundColor: palette.primary, borderColor: palette.primary },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: palette.subtleText },
                    isActive && { color: palette.accentTealSofter },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.surfaceDarkText }]}>Results</Text>
          <Text style={[styles.sectionCount, { color: palette.mutedText }]}>{filteredBanks.length} packs</Text>
        </View>

        {filteredBanks.map((course) => {
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
                setSelectedCourseId(course.id);
                // Navigate to separate submodule screen outside tabs layout,
                // passing the course title for the header
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

      {selectedBank && showOverview && (
        <CourseOverview
          title={selectedBank.title}
          level={selectedBank.level}
          lessonsCount={selectedBank.questionsCount}
          rating={selectedBank.rating}
          duration={selectedBank.duration}
          description={selectedBank.description}
          isFavorite={favorites.has(selectedBank.id)}
          onToggleFavorite={() => toggleFavorite(selectedBank.id)}
          onClose={() => setShowOverview(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  containerDark: {
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  textLight: {
    color: Colors.dark.surfaceDarkText,
  },
  textMutedDark: {
    color: Colors.dark.mutedText,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.surfaceDarkText,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.light.mutedText,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.light.accentTealSoft,
  },
  headerBadgeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primaryMuted,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackgroundSoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.surfaceDarkText,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.borderSubtle,
    backgroundColor: Colors.light.cardBackground,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: Colors.light.subtleText,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.light.accentTealSofter,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.surfaceDarkText,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.light.mutedText,
  },
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
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  courseIconCircle: {
    width: 120,
    aspectRatio: 16 / 9,
    borderRadius: 20,
    backgroundColor: '#ccfbf1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  courseBatch: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 2,
  },
  courseEnrolledOn: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardShadow: {
    width: '100%',
    marginTop: 14,
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    padding: 20,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.surfaceDarkText,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: Colors.light.mutedText,
    marginBottom: 12,
  },
  cardContentColumn: {
    flex: 1,
    paddingRight: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipQuestions: {
    backgroundColor: Colors.light.accentTealSofter,
  },
  chipDifficulty: {
    backgroundColor: Colors.light.primaryMuted,
  },
  chipText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primaryMuted,
  },
  chipTextMuted: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.subtleText,
  },
  chipDifficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.accentTealSofter,
  },
  cardBookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  detailsColumn: {
    flex: 1,
  },
  cardMetaText: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.light.mutedText,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.light.cardBackgroundSoft,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.iconMuted,
    marginRight: 6,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.subtleText,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.surfaceDarkText,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
  favoriteButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
  },
  startButtonText: {
    marginRight: 6,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.accentTealSofter,
  },
});
