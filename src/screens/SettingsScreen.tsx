import { Pressable, StyleSheet, Text, View } from "react-native";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

type SettingsScreenProps = {
  onResetOnboarding?: () => void;
  onWipeLocalData?: () => void;
};

export function SettingsScreen({
  onResetOnboarding,
  onWipeLocalData,
}: SettingsScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSvgLocal name="IC_CIRCLE_USER_ROUND" size={48} color={colors.teal} />
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure boundaries and preferences</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Boundaries</Text>
        <Text style={styles.cardBody}>
          This application is designed specifically for recovery. It contains no trading journals, market tickers, or profit projections to guarantee a trigger-free experience.
        </Text>
      </View>

      {__DEV__ ? (
        <View style={styles.devActions}>
          <Text style={styles.devSectionTitle}>Developer Tools</Text>
          {onResetOnboarding ? (
            <Pressable style={styles.resetButton} onPress={onResetOnboarding}>
              <Text style={styles.resetButtonText}>Reset Onboarding</Text>
            </Pressable>
          ) : null}
          {onWipeLocalData ? (
            <Pressable style={styles.resetButton} onPress={onWipeLocalData}>
              <Text style={styles.resetButtonText}>Wipe Local Data</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    letterSpacing: typography.headingLetterSpacing,
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    letterSpacing: typography.subheadingLetterSpacing,
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    marginBottom: 10,
  },
  cardBody: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  devActions: {
    gap: 12,
    alignItems: "stretch",
  },
  devSectionTitle: {
    color: colors.gray,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: "center",
  },
  resetButton: {
    borderColor: colors.navy,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  resetButtonText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
});
