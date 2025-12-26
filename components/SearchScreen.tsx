import React from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import StudyPacksCard from "./StudyPacksCard";
import { Colors } from "../constants/theme";

export type SearchCourseResult = {
    id: string | number;
    title: string;
    description: string;
    totalLessons: number;
    progress: number;
    thumbnail: string;
};

export type SearchSubmoduleResult = {
    id: string;
    title: string;
    description: string;
};

type Palette = typeof Colors.light;

type SearchScreenProps = {
    visible: boolean;
    topOffset: number;
    isDarkMode: boolean;
    palette: Palette;
    packResults: SearchCourseResult[];
    submoduleResults: SearchSubmoduleResult[];
    onDismiss: () => void;
    onPressCourse: (course: SearchCourseResult) => void;
    onPressSubmodule: (submodule: SearchSubmoduleResult) => void;
};

export default function SearchScreen({
    visible,
    topOffset,
    isDarkMode,
    palette,
    packResults,
    submoduleResults,
    onDismiss,
    onPressCourse,
    onPressSubmodule,
}: SearchScreenProps) {
    if (!visible) return null;

    return (
        <View style={styles.searchOverlayRoot} pointerEvents="box-none">
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.searchOverlayBackdrop,
                    {
                        // Start dimming below the header/search area only
                        top: topOffset,
                        backgroundColor: isDarkMode ? "#000" : "#fff",
                    },
                ]}
                onPress={onDismiss}
            />

            <View
                style={[
                    styles.searchOverlayContent,
                    { backgroundColor: palette.cardBackground, top: topOffset },
                ]}
                pointerEvents="auto"
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={styles.searchResultsScroll}
                    showsVerticalScrollIndicator={false}
                >
                    {packResults.map((course) => (
                        <StudyPacksCard
                            key={course.id}
                            title={course.title}
                            subtitle={course.description}
                            meta={`${course.totalLessons} lessons  ${course.progress}% complete`}
                            thumbnail={course.thumbnail}
                            onPress={() => {
                                onPressCourse(course);
                            }}
                        />
                    ))}

                    {submoduleResults.map((sub) => (
                        <StudyPacksCard
                            key={sub.id}
                            title={sub.title}
                            subtitle={sub.description}
                            meta={"12 lessons  3h 20min"}
                            thumbnail="medisharkcourse.webp"
                            onPress={() => {
                                onPressSubmodule(sub);
                            }}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchOverlayRoot: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    searchOverlayBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    searchOverlayContent: {
        // Fill remaining screen below header/search
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 0,
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    searchResultsScroll: {
        flex: 1,
        paddingHorizontal: 2,
    },
});
