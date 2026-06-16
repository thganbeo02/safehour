import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

type HomePlaceholderScreenProps = {
  onResetOnboarding?: () => void;
};

export function HomePlaceholderScreen({
  onResetOnboarding,
}: HomePlaceholderScreenProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>SafeHour</Text>
      <Text style={styles.body}>Home screen placeholder.</Text>
      {__DEV__ && onResetOnboarding ? (
        <Pressable style={styles.resetButton} onPress={onResetOnboarding}>
          <Text style={styles.resetButtonText}>Reset onboarding</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: colors.offWhite,
  },
  title: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 36,
    letterSpacing: typography.headingLetterSpacing,
  },
  body: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    letterSpacing: typography.subheadingLetterSpacing,
    marginTop: 12,
  },
  resetButton: {
    borderColor: colors.navy,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 28,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  resetButtonText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
  },
});
