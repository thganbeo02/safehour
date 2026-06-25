import { ImageBackground, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

type LoadingScreenProps = {
  fontsLoaded: boolean;
};

export function LoadingScreen({ fontsLoaded }: LoadingScreenProps) {
  return (
    <ImageBackground
        source={require("@/assets/brand/loading-background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Text style={[styles.title, fontsLoaded && styles.boldFont]}>
          SafeHour
        </Text>
        <Text style={[styles.subtitle, fontsLoaded && styles.boldFont]}>
          One safe hour at a time.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 128,
  },
  title: {
    color: colors.navy,
    fontSize: typography.titleSize,
    letterSpacing: typography.headingLetterSpacing,
    textAlign: "center",
  },
  subtitle: {
    color: colors.navy,
    fontSize: typography.subtitleSize,
    letterSpacing: typography.subheadingLetterSpacing,
    textAlign: "center",
  },
  boldFont: {
    fontFamily: fontFamilies.bold,
  },
});
