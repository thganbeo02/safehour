import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { colors } from "@/theme/colors";
import { fontFamilies } from "@/theme/typography";
import { formatCurrency } from "@/lib/formatCurrency";

import { SectionChevron } from "./SectionChevron";

export type WhereKeptRow = {
  destination: string;
  amount: number;
};

type WhereKeptSectionProps = {
  rows: WhereKeptRow[];
  isExpanded: boolean;
  onToggle: () => void;
};

const BankIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 21h18" />
    <Path d="M19 21v-8" />
    <Path d="M5 21v-8" />
    <Path d="M12 21v-8" />
    <Path d="M3 10h18" />
    <Path d="M12 3L3 10h18z" />
  </Svg>
);

const CashIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2} y={6} width={20} height={12} rx={2} />
    <Circle cx={12} cy={12} r={2} />
    <Path d="M6 12h.01M18 12h.01" />
  </Svg>
);

const HandIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 11.5 10.5 8a2.1 2.1 0 0 1 3 0l.5.5" />
    <Path d="M12 10.5 14.5 8a2.1 2.1 0 0 1 3 0 2.1 2.1 0 0 1 0 3l-5.6 5.6a4 4 0 0 1-5.6 0L3 13.3" />
    <Path d="M2 14h4" />
    <Path d="M18 11h4" />
  </Svg>
);

export function WhereKeptSection({ rows, isExpanded, onToggle }: WhereKeptSectionProps) {
  return (
    <View style={styles.section}>
      <Pressable style={styles.header} onPress={onToggle}>
        <Text style={styles.title}>Where it’s kept</Text>
        <SectionChevron isOpen={isExpanded} />
      </Pressable>
      {isExpanded ? (
        <View style={styles.body}>
          {rows.length === 0 ? (
            <Text style={styles.emptyText}>
              Add a saved amount to see where protected money is kept.
            </Text>
          ) : (
            rows.map((row) => {
              const iconColor = colors.navy;
              const isCash = row.destination.toLowerCase().includes("cash");
              const isBank = row.destination.toLowerCase().includes("bank");

              return (
                <View key={row.destination} style={styles.row}>
                  <View style={styles.left}>
                    {isBank ? (
                      <BankIcon color={iconColor} />
                    ) : isCash ? (
                      <CashIcon color={iconColor} />
                    ) : (
                      <HandIcon color={iconColor} />
                    )}
                    <Text style={styles.label}>{row.destination}</Text>
                  </View>
                  <Text style={styles.amount}>{formatCurrency(row.amount)} VND</Text>
                </View>
              );
            })
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A8A8A8",
    marginBottom: 16,
    overflow: "hidden",
  },
  header: {
    minHeight: 44,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: "#CFCFCF",
  },
  emptyText: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: {
    minHeight: 36,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 12,
  },
  label: {
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
  },
  amount: {
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
  },
});
