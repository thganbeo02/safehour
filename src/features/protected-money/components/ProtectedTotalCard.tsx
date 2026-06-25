import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamilies } from "@/theme/typography";
import { formatCurrency } from "@/lib/formatCurrency";

type ProtectedTotalCardProps = {
  amount: number;
};

export function ProtectedTotalCard({ amount }: ProtectedTotalCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>Protected so far</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amountNum}>{formatCurrency(Math.round(amount))}</Text>
        <Text style={styles.currencyLabel}>VND</Text>
      </View>
      <Text style={styles.footer}>Small steps create a calm path forward.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E8F4F2",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.navy,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 12,
  },
  amountNum: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 44,
  },
  currencyLabel: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
  },
  footer: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
});
