import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import { Lesson } from "../../components/LessonCard";
import LessonCarousel from "../../components/LessonCarousel";
import { Colors } from "../../constants/theme";
import { getUserProfile, UserProfile } from "../api/userData.api";
import { getExamStats, ExamStats, getExamPackSections, ExamPackSection } from "../api/examPackCategory.api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 380;
const CARD_SPACING = 0;

export default function LessonHomeScreen() {
  const [favorites, setFavorites] = useState(new Set<number>());
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [examPackSections, setExamPackSections] = useState<ExamPackSection[]>([]);
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (e) { }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const s = await getExamStats();
        setStats(s);
      } catch (e) { }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const sections = await getExamPackSections();
        setExamPackSections(sections);
      } catch (e) { }
    };

    loadSections();
  }, []);

  const lessons = [
    {
      id: 1,
      title: "Figma Master Class",
      category: "UI Design",
      lessonCount: 28,
      duration: "6h 30min",
      rating: 4.9,
    },
    {
      id: 2,
      title: "Web Design Fundamentals",
      category: "UX Design",
      lessonCount: 32,
      duration: "8h 30min",
      rating: 4.8,
    },
    {
      id: 3,
      title: "React Native Mastery",
      category: "Mobile Dev",
      lessonCount: 45,
      duration: "12h 15min",
      rating: 4.9,
    },
    {
      id: 4,
      title: "Typography Essentials",
      category: "Graphic Design",
      lessonCount: 18,
      duration: "4h 20min",
      rating: 4.7,
    },
    {
      id: 5,
      title: "Color Theory Pro",
      category: "Design Theory",
      lessonCount: 22,
      duration: "5h 45min",
      rating: 4.8,
    },
    {
      id: 6,
      title: "Animation Principles",
      category: "Motion Design",
      lessonCount: 35,
      duration: "9h 10min",
      rating: 4.9,
    },
    {
      id: 7,
      title: "Prototyping Workshop",
      category: "UX Design",
      lessonCount: 26,
      duration: "7h 00min",
      rating: 4.6,
    },
    {
      id: 8,
      title: "Design Systems",
      category: "UI Design",
      lessonCount: 30,
      duration: "8h 45min",
      rating: 4.9,
    },
    {
      id: 9,
      title: "User Research Methods",
      category: "UX Research",
      lessonCount: 24,
      duration: "6h 15min",
      rating: 4.7,
    },
    {
      id: 10,
      title: "Accessibility Design",
      category: "Web Design",
      lessonCount: 20,
      duration: "5h 30min",
      rating: 4.8,
    },
  ];

  const popularSectionConfig = examPackSections.find(
    (s) => s.key === "popular" && s.enabled
  );
  const otherExamPackSections = examPackSections.filter(
    (s) => s.key !== "popular" && s.enabled
  );

  const handlePressLesson = (lesson: Lesson) => {
    // Navigate to full-screen CourseOverview-style screen instead of overlay
    router.push({
      pathname: "/lesssonPacks/SubmoduleDetail",
      params: {
        title: lesson.title,
        description: `${lesson.category} • ${lesson.lessonCount} lessons`,
      },
    });
  };
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: palette.tabBackground },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, isDarkMode && styles.textLight]}>
              {user ? `Hi, ${user.name.split(" ")[0]}` : "Hi,"}
            </Text>
            <Text style={[styles.subtitle, isDarkMode && styles.textMutedDark]}>Find your exams today!</Text>
          </View>
          <TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user ? user.initials : "CN"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: palette.cardBackgroundSoft }]}>
            <Ionicons
              name="search"
              size={20}
              color="#9ca3af"
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: palette.surfaceDarkText }]}
              placeholder="Search exam packs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={palette.iconMuted}
            />
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: palette.primary }]}>
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Picks Section */}
      <View style={styles.topPicksSection}>
        <View
          style={[
            styles.topPicksCard,
            { backgroundColor: palette.accentTealSoft },
          ]}
        >
          <View style={styles.topPicksContent}>
            <Text style={[styles.topPicksLabel, { color: palette.text }]}>Browse All Exam Packs</Text>
            <View style={styles.lessonCountContainer}>
              <Text style={[styles.lessonCountNumber, { color: palette.text }]}>
                {stats ? `${stats.examsCount}+` : "100+"}
              </Text>
              <Text style={[styles.lessonCountText, { color: palette.text }]}>Exams</Text>
            </View>
            <TouchableOpacity
              style={[styles.exploreButton, { backgroundColor: palette.primary }]}
              onPress={() => {
                // Go to Explore tab when tapping "Explore Exams"
                router.push('/(tabs)/explore');
              }}
            >
              <Text style={[styles.exploreButtonText, { color: palette.accentTealSofter }]}>Explore Exams</Text>
            </TouchableOpacity>
          </View>

          {/* Mini preview cards */}
          <View style={styles.previewCards}>
            <View
              style={[
                styles.previewCard,
                { backgroundColor: palette.cardBackground },
              ]}
            >
              <Text style={[styles.previewCardTitle, { color: palette.text }]}>Categories</Text>
              <View style={styles.previewBadge}>
                <Text style={[styles.previewBadgeText, { color: palette.primaryMuted }]}>
                  {stats ? `${stats.categoriesCount}+` : "10+"}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.previewCard,
                { backgroundColor: palette.cardBackground },
              ]}
            >
              <Text style={[styles.previewCardTitle, { color: palette.text }]}>Lessons</Text>
              <View style={styles.previewBadge}>
                <Text style={[styles.previewBadgeText, { color: palette.primaryMuted }]}>
                  {stats ? `${stats.lessonsCount}+` : "200+"}
                </Text>
              </View>
            </View>

          </View>

          {/* Decorative elements */}
          <View style={styles.decorBubble1} />
          <View style={styles.decorBubble2} />
        </View>
      </View>

      {/* Popular Exam Packs Section (configurable) */}
      {popularSectionConfig && (
        <View style={styles.popularSection}>
          <View style={styles.popularHeader}>
            <Text style={[styles.popularTitle, { color: palette.surfaceDarkText }]}>
              {popularSectionConfig.title}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: palette.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <LessonCarousel
            data={lessons}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onPressLesson={handlePressLesson}
            autoPlayInterval={2000}
          />
        </View>
      )}

      {/* Additional Exam Pack Sections (configurable) */}
      {otherExamPackSections.map((section) => (
        <View key={section.id} style={styles.popularSection}>
          <View style={styles.popularHeader}>
            <Text style={[styles.popularTitle, { color: palette.surfaceDarkText }]}>
              {section.title}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: palette.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <LessonCarousel
            data={lessons}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onPressLesson={handlePressLesson}
            autoPlayInterval={2500}
          />
        </View>
      ))}
    </ScrollView>
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
    paddingBottom: 120,
  },
  header: {
    backgroundColor: Colors.light.tabBackground,
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerDark: {
    backgroundColor: Colors.dark.tabBackground,
    shadowOpacity: 0.3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.surfaceDarkText,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.mutedText,
    marginTop: 4,
  },
  textLight: {
    color: Colors.dark.surfaceDarkText,
  },
  textMutedDark: {
    color: Colors.dark.mutedText,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.cardBackgroundSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackgroundSoft,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.surfaceDarkText,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  topPicksSection: {
    padding: 8,
  },
  topPicksCard: {
    backgroundColor: Colors.light.accentTealSoft,
    borderRadius: 20,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    minHeight: 170,
  },
  topPicksContent: {
    zIndex: 10,
  },
  topPicksLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primaryMuted,
    marginBottom: 8,
  },
  lessonCountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 24,
  },
  lessonCountNumber: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.light.primaryMuted,
  },
  lessonCountText: {
    fontSize: 16,
    color: Colors.light.primarySoft,
    marginLeft: 8,
  },
  exploreButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-start",
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: Colors.light.accentTealSofter,
    fontSize: 16,
    fontWeight: "600",
  },
  previewCards: {
    position: "absolute",
    right: 24,
    top: 24,
    gap: 12,
  },
  previewCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 10,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewCardTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0872fcff",
    marginBottom: 6,
  },
  previewBadge: {
    backgroundColor: Colors.light.accentTealSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  previewBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.light.primaryMuted,
  },
  decorBubble1: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    zIndex: -20,
    borderRadius: 60,
    backgroundColor: Colors.light.accentTealSoft,
    opacity: 0.3,
  },
  decorBubble2: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    zIndex: -20,
    backgroundColor: Colors.light.accentEmeraldSoft,
    opacity: 0.3,
  },
  popularSection: {
    paddingHorizontal: 2,
  },
  popularHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.surfaceDarkText,
    paddingLeft: 5
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
    paddingRight: 5
  },
  cardsContainer: {
    gap: CARD_SPACING,
  },
  cardShadow: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    borderRadius: 16,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    overflow: "hidden",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    height: 180,
    backgroundColor: Colors.light.accentTealSoft,
    padding: 24,
    position: "relative",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(153, 246, 228, 0.3)",
  },
  mockInterface: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 12,
    padding: 16,
    marginTop: 48,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mockLines: {
    gap: 8,
    marginBottom: 12,
  },
  line: {
    height: 8,
    backgroundColor: Colors.light.accentTealSoft,
    borderRadius: 4,
  },
  tagContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: Colors.light.accentTealSofter,
    fontSize: 10,
    fontWeight: "600",
  },
  decorCircle1: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(167, 243, 208, 0.3)",
  },
  decorCircle2: {
    position: "absolute",
    top: 32,
    right: 32,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(153, 246, 228, 0.3)",
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 14,
    color: "#6b7280",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.warning,
  },
});
