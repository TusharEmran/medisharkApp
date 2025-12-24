import React, { useEffect, useState, useRef } from 'react';
import { Slot, Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { AppState, AppStateStatus } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import AnimatedSplash from './splash';

export default function RootLayout() {
    const [showSplash, setShowSplash] = useState(true);
    const [appStateChanged, setAppStateChanged] = useState(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        // Prevent the native splash from auto-hiding so our animated splash can run
        ExpoSplashScreen.preventAutoHideAsync().catch(() => { });
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        setAppStateChanged(true);
        appState.current = nextAppState;
    };

    const handleFinish = async () => {
        try {
            await ExpoSplashScreen.hideAsync();
        } catch (e) {
        }
        setShowSplash(false);
    };

    return (
        <ThemeProvider>
            {showSplash && !appStateChanged ? (
                <AnimatedSplash onFinish={handleFinish} />
            ) : (
                <ThemedStack />
            )}
        </ThemeProvider>
    );
}

function ThemedStack() {
    const { isDarkMode } = useTheme();

    return (
        <Stack
            screenOptions={{
                animation: 'slide_from_right',
                headerShown: false,
                contentStyle: {
                    backgroundColor: isDarkMode ? '#020617' : '#ffffff',
                },
            }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="lesssonPacks/AllExamPacks"
                options={{
                    animation: 'none',
                }}
            />
            <Stack.Screen name="lesssonPacks/SubmodulePacks" />
            <Stack.Screen name="lesssonPacks/SubmoduleDetail" />
        </Stack>
    );
}
