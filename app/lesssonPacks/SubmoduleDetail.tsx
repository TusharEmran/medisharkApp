import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CourseOverview from '../../components/CourseOverview';

const SubmoduleDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title?: string;
    description?: string;
  }>();

  const title = params.title ?? '';
  const description = params.description ?? '';

  return (
    <View style={styles.container}>
      <CourseOverview
        title={title}
        level="Intermediate"
        lessonsCount={12}
        rating={4.8}
        duration="3h 20min"
        description={description}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onClose={() => router.back()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SubmoduleDetailScreen;
