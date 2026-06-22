import { StyleSheet, Text, View } from "react-native";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

export function UrgeLogScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSvgLocal name="IC_NOTEBOOK_PEN" size={48} color={colors.teal} />
        <Text style={styles.title}>Urge Log</Text>
        <Text style={styles.subtitle}>Trace and understand your triggers</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mindful Observation</Text>
        <Text style={styles.cardBody}>
          Logging urges takes less than 30 seconds but builds immense awareness. Observe the feeling rise and fall like a wave, and document it to discover your patterns.
        </Text>
      </View>
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
    marginBottom: 40,
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
});
