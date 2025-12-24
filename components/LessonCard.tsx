import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import { useTheme } from "../app/theme/ThemeContext";

export interface Lesson {
  id: number;
  title: string;
  category: string;
  lessonCount: number;
  duration: string;
  rating: number;
}

interface LessonCardProps {
  lesson: Lesson;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onPress?: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isFavorite,
  onToggleFavorite,
  onPress,
}) => {
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  return (
  <View style={styles.cardShadow}>
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(lesson)}
      style={[styles.card, { backgroundColor: palette.accentTealSofter }] }
    >
      <TouchableOpacity
        onPress={() => onToggleFavorite(lesson.id)}
        style={styles.favoriteButton}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "#ef4444" : "#9ca3af"}
        />
      </TouchableOpacity>

      <View style={[styles.cardImageContainer] }>
        <Image
          source={require("../assets/images/medisharkcourse.webp")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: palette.surfaceDarkText }]}>{lesson.title}</Text>
        <Text style={[styles.cardCategory, { color: palette.mutedText }]}>
          {lesson.category} ({lesson.lessonCount} lessons)
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={[styles.durationText, { color: palette.mutedText }]}>{lesson.duration}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={[styles.ratingText, { color: palette.warning }]}>{lesson.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </View>
  );
};

export default LessonCard;

const styles = StyleSheet.create({
  cardShadow: {
    width: 260,
    marginRight: 16,
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
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    height: 135,
    backgroundColor: Colors.light.accentTealSoft,
    padding: 0,
    position: "relative",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
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
    backgroundColor: "#99f6e4",
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
    padding: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.surfaceDarkText,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: Colors.light.mutedText,
    marginBottom: 12,
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
    color: Colors.light.mutedText,
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
