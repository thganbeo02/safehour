import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";
import { AddProtectionEntrySheet } from "../components/AddProtectionEntrySheet";
import { InfoModal } from "../components/InfoModal";
import { ProtectedTotalCard } from "../components/ProtectedTotalCard";
import { RecentHistorySection } from "../components/RecentHistorySection";
import { WhereKeptSection } from "../components/WhereKeptSection";
import { useProtectedMoney } from "../hooks/useProtectedMoney";

const PlusIcon = ({ color }: { color: string }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

export function ProtectedScreen() {
  const {
    totalProtected,
    displayedTotalProtected,
    entries,
    loadData,
    saveEntry,
  } = useProtectedMoney();
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [whereKeptExpanded, setWhereKeptExpanded] = useState(true);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const whereKeptRows = entries
    .filter((entry) => entry.kind !== "debt_repaid")
    .reduce<{ destination: string; amount: number }[]>(
      (rows, entry) => {
        const existing = rows.find(
          (row) => row.destination === entry.destination,
        );

        if (existing) {
          existing.amount += entry.amount_protected;
          return rows;
        }

        rows.push({
          destination: entry.destination,
          amount: entry.amount_protected,
        });
        return rows;
      },
      [],
    )
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const visibleHistoryEntries = showAllHistory ? entries : entries.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.titleBlock}>
          <Text style={styles.mainTitle}>Money Protected</Text>
          <Text style={styles.mainSubtitle}>
            Money kept out of the loop through saving or debt repayment.
          </Text>
        </View>
        <Pressable
          style={styles.helpButton}
          onPress={() => setInfoModalVisible(true)}
        >
          <Text style={styles.helpText}>?</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProtectedTotalCard amount={displayedTotalProtected} />

        {/* Add Entry Button */}
        <Pressable
          style={styles.addEntryButton}
          onPress={() => setModalVisible(true)}
        >
          <PlusIcon color={colors.navy} />
          <Text style={styles.addEntryText}>Add protection entry</Text>
        </Pressable>

        <WhereKeptSection
          rows={whereKeptRows}
          isExpanded={whereKeptExpanded}
          onToggle={() => setWhereKeptExpanded(!whereKeptExpanded)}
        />

        <RecentHistorySection
          entries={entries}
          visibleEntries={visibleHistoryEntries}
          isExpanded={recentExpanded}
          showAllHistory={showAllHistory}
          onToggleExpanded={() => setRecentExpanded(!recentExpanded)}
          onToggleShowAll={() => setShowAllHistory(!showAllHistory)}
        />
      </ScrollView>

      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />

      <AddProtectionEntrySheet
        visible={modalVisible}
        totalProtected={totalProtected}
        saveEntry={saveEntry}
        onClose={() => setModalVisible(false)}
        onSaved={(previousTotal) => loadData({ animateFrom: previousTotal })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paleTeal,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 48 : 40,
    paddingBottom: 20,
    height: 150,
    backgroundColor: colors.paleTeal,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 16,
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  helpText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    lineHeight: 18,
  },
  contentScroll: {
    backgroundColor: colors.offWhite,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mainTitle: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    letterSpacing: typography.headingLetterSpacing,
    marginBottom: 6,
  },
  mainSubtitle: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
  },
  addEntryButton: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderStyle: "dashed",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  addEntryText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
});
