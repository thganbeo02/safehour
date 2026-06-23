import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import Svg, { Path } from "react-native-svg";

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
    <ToastProvider
      placement="bottom"
      offset={60}
      renderType={{
        protection_saved: (toast) => (
          <View style={styles.toastContainer}>
            <Svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.teal}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M20 6L9 17l-5-5" />
            </Svg>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        ),
      }}
    >
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
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    borderRadius: 12,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  toastText: {
    fontSize: 13,
    color: colors.navy,
    fontFamily: "BinancePlex",
  },
});
