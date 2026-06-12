import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";

export function HomePlaceholderScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>SafeHour</Text>
      <Text style={styles.body}>Home screen placeholder.</Text>
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
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    letterSpacing: typography.subheadingLetterSpacing,
    marginTop: 12,
  },
});
