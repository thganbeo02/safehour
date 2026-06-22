import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { MainNavigator } from "@/screens/MainNavigator";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import {
  completeOnboarding,
  debugReadStorage,
  initializeLocalDatabase,
  isOnboardingCompleted,
  resetOnboardingForDevelopment,
  wipeLocalDataForDevelopment,
} from "@/storage/db";
import { colors } from "@/theme/colors";

// Dev-only delay so the loading screen can be reviewed during onboarding polish.
const DEV_LOADING_DELAY_MS = 5000;

export function AppRoot() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [loadingDelayDone, setLoadingDelayDone] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
    BinancePlex: require("@/assets/fonts/BinancePlex.ttf"),
  });

  useEffect(() => {
    let isMounted = true;

    async function prepareStorage() {
      await initializeLocalDatabase();
      const hasCompletedOnboarding = await isOnboardingCompleted();
      await debugReadStorage();

      if (isMounted) {
        setShowOnboarding(!hasCompletedOnboarding);
        setStorageReady(true);
      }
    }

    prepareStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingDelayDone(true);
    }, DEV_LOADING_DELAY_MS);

    return () => clearTimeout(timeout);
  }, []);

  async function handleOnboardingComplete() {
    await completeOnboarding();
    await debugReadStorage();
    setShowOnboarding(false);
  }

  async function handleDevelopmentReset() {
    await resetOnboardingForDevelopment();
    await debugReadStorage();
    setShowOnboarding(true);
  }

  async function handleDevelopmentWipe() {
    await wipeLocalDataForDevelopment();
    await debugReadStorage();
    setShowOnboarding(true);
  }

  if (!fontsLoaded || !loadingDelayDone || !storageReady) {
    return <LoadingScreen fontsLoaded={fontsLoaded} />;
  }

  return (
    <View style={styles.root}>
      {showOnboarding ? (
        <OnboardingScreen onEnter={handleOnboardingComplete} />
      ) : (
        <MainNavigator
          onResetOnboarding={handleDevelopmentReset}
          onWipeLocalData={handleDevelopmentWipe}
        />
      )}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
});
