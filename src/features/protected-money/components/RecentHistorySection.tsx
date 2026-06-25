import { Pressable, StyleSheet, Text, View } from "react-native";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatRelativeDate } from "@/lib/formatDate";
import type { ProtectionEntry } from "@/storage/db";
import { colors } from "@/theme/colors";
import { fontFamilies } from "@/theme/typography";

import { SectionChevron } from "./SectionChevron";

type RecentHistorySectionProps = {
  entries: ProtectionEntry[];
  visibleEntries: ProtectionEntry[];
  isExpanded: boolean;
  showAllHistory: boolean;
  onToggleExpanded: () => void;
  onToggleShowAll: () => void;
};

export function RecentHistorySection({
  entries,
  visibleEntries,
  isExpanded,
  showAllHistory,
  onToggleExpanded,
  onToggleShowAll,
}: RecentHistorySectionProps) {
  return (
    <View style={styles.section}>
      <Pressable style={styles.header} onPress={onToggleExpanded}>
        <Text style={styles.title}>Recent history</Text>
        <SectionChevron isOpen={isExpanded} />
      </Pressable>
      {isExpanded ? (
        <View style={styles.body}>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.shieldOutline}>
                  <IconSvgLocal
                    name="IC_SHIELD_CHECK"
                    size={42}
                    color={colors.gray}
                  />
                </View>
              </View>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyBody}>
                When you keep money out of the loop, you can record it here.
              </Text>
            </View>
          ) : (
            visibleEntries.map((item) => {
              const isNegative = item.amount_protected < 0;
              const actionLabel =
                item.kind === "saved"
                  ? "Set aside"
                  : item.kind === "debt_repaid"
                    ? "Repaid toward debt"
                    : "Withdrawn";

              return (
                <View key={item.id} style={styles.row}>
                  <View style={styles.left}>
                    <Text style={styles.label}>
                      {actionLabel}, {item.destination}
                    </Text>
                    <Text style={styles.date}>
                      {formatRelativeDate(item.created_at)}
                    </Text>
                  </View>
                  <Text style={[styles.amount, isNegative && styles.negative]}>
                    {isNegative ? "-" : ""}
                    {formatCurrency(Math.abs(item.amount_protected))} VND
                  </Text>
                </View>
              );
            })
          )}

          {entries.length > 3 ? (
            <Pressable style={styles.seeAllButton} onPress={onToggleShowAll}>
              <Text style={styles.seeAllText}>
                {showAllHistory ? "Show less" : "See all history"}
              </Text>
            </Pressable>
          ) : null}
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
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  emptyIconContainer: {
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldOutline: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.paleTeal,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  emptyTitle: {
    color: colors.gray,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyBody: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  date: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    marginTop: 2,
  },
  amount: {
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  negative: {
    color: colors.gray,
  },
  seeAllButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    minHeight: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    alignItems: "center",
    justifyContent: "center",
  },
  seeAllText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 13,
  },
});
