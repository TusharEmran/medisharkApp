import React from "react";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";
import LessonCard, { Lesson } from "./LessonCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 380;

export type LessonCarouselProps = {
  data: Lesson[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onPressLesson: (lesson: Lesson) => void;
  autoPlayInterval?: number;
};

const LessonCarousel: React.FC<LessonCarouselProps> = ({
  data,
  favorites,
  onToggleFavorite,
  onPressLesson,
  autoPlayInterval = 3000,
}) => {
  return (
    <Carousel
      width={CARD_WIDTH}
      height={280}
      data={data}
      loop
      autoPlay
      autoPlayInterval={autoPlayInterval}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 120,
      }}
      renderItem={({ item }) => (
        <LessonCard
          lesson={item}
          isFavorite={favorites.has(item.id)}
          onToggleFavorite={onToggleFavorite}
          onPress={onPressLesson}
        />
      )}
    />
  );
};

export default LessonCarousel;
