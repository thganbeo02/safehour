import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

type HomePlaceholderScreenProps = {
  onResetOnboarding?: () => void;
  onWipeLocalData?: () => void;
};

export function HomePlaceholderScreen({
  onResetOnboarding,
  onWipeLocalData,
}: HomePlaceholderScreenProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>SafeHour</Text>
      <Text style={styles.body}>Home screen placeholder.</Text>
      {__DEV__ ? (
        <View style={styles.devActions}>
          {onResetOnboarding ? (
            <Pressable style={styles.resetButton} onPress={onResetOnboarding}>
              <Text style={styles.resetButtonText}>Reset onboarding</Text>
            </Pressable>
          ) : null}
          {onWipeLocalData ? (
            <Pressable style={styles.resetButton} onPress={onWipeLocalData}>
              <Text style={styles.resetButtonText}>Wipe local data</Text>
            </Pressable>
          ) : null}
        </View>
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
  devActions: {
    gap: 12,
    marginTop: 28,
  },
  resetButton: {
    borderColor: colors.navy,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  resetButtonText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
  },
});
