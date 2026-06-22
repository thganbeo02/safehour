import { StyleSheet, Text, View } from "react-native";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSvgLocal name="IC_WIND" size={48} color={colors.teal} />
        <Text style={styles.title}>SafeHour</Text>
        <Text style={styles.subtitle}>One Safe Hour at a Time</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Daily Focus</Text>
        <Text style={styles.cardBody}>
          Every moment you pause during an urge is a moment you protect what remains. Take a breath, connect with your support, and keep moving forward.
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
    fontSize: 36,
    letterSpacing: typography.headingLetterSpacing,
    marginTop: 16,
  },
  subtitle: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 18,
    letterSpacing: typography.subheadingLetterSpacing,
    marginTop: 4,
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
