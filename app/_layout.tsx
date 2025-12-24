import React, { useEffect, useState, useRef } from 'react';
import { Slot, Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { AppState, AppStateStatus } from 'react-native';
import { ThemeProvider } from './theme/ThemeContext';
import AnimatedSplash from './splash';

export default function RootLayout() {
    const [showSplash, setShowSplash] = useState(true);
    const [appStateChanged, setAppStateChanged] = useState(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        // Prevent the native splash from auto-hiding so our animated splash can run
        ExpoSplashScreen.preventAutoHideAsync().catch(() => { });

        // Handle app state changes to detect when app resumes from background
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        // Mark that app state has changed (fresh start to background or resume from background)
        setAppStateChanged(true);
        appState.current = nextAppState;
    };

    const handleFinish = async () => {
        try {
            // hide the native splash and then stop showing the animated splash
            await ExpoSplashScreen.hideAsync();
        } catch (e) {
            // ignore
        }
        setShowSplash(false);
    };

    return (
        <ThemeProvider>
            {showSplash && !appStateChanged ? (
                <AnimatedSplash onFinish={handleFinish} />
            ) : (
                <Stack
                    screenOptions={{
                        animation: 'slide_from_right',
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="lesssonPacks/SubmodulePacks" />
                    <Stack.Screen name="lesssonPacks/SubmoduleDetail" />
                </Stack>
            )}
        </ThemeProvider>
    );
}
