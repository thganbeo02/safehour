import { StyleSheet, Text, View } from "react-native";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

export function ContactsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSvgLocal name="IC_PHONE" size={48} color={colors.teal} />
        <Text style={styles.title}>Accountability</Text>
        <Text style={styles.subtitle}>You don't have to carry this alone</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trusted Support</Text>
        <Text style={styles.cardBody}>
          Set up a close friend, family member, or sponsor whom you can quickly call or message when an urge becomes too strong. Keeping contact breaks the cycle of private isolation.
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
