import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { HomePlaceholderScreen } from "@/screens/HomePlaceholderScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { colors } from "@/theme/colors";

// Dev-only delay so the loading screen can be reviewed during onboarding polish.
const DEV_LOADING_DELAY_MS = 5000;

export function AppRoot() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [loadingDelayDone, setLoadingDelayDone] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingDelayDone(true);
    }, DEV_LOADING_DELAY_MS);

    return () => clearTimeout(timeout);
  }, []);

  if (!fontsLoaded || !loadingDelayDone) {
    return <LoadingScreen fontsLoaded={fontsLoaded} />;
  }

  return (
    <View style={styles.root}>
      {showOnboarding ? (
        <OnboardingScreen onEnter={() => setShowOnboarding(false)} />
      ) : (
        <HomePlaceholderScreen />
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
