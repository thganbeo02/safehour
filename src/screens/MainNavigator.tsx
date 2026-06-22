import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import type { IconSvgName } from "@/components/icons";
import { colors } from "@/theme/colors";
import { fontFamilies } from "@/theme/typography";

import { HomeScreen } from "./HomeScreen";
import { ContactsScreen } from "./ContactsScreen";
import { UrgeLogScreen } from "./UrgeLogScreen";
import { ProtectedScreen } from "./ProtectedScreen";
import { SettingsScreen } from "./SettingsScreen";

type TabName = "Home" | "Contacts" | "Urge Log" | "Protected" | "Settings";

interface TabConfig {
  name: TabName;
  icon: IconSvgName;
}

const TABS: TabConfig[] = [
  { name: "Home", icon: "IC_WIND" },
  { name: "Contacts", icon: "IC_PHONE" },
  { name: "Urge Log", icon: "IC_NOTEBOOK_PEN" },
  { name: "Protected", icon: "IC_PIGGY_BANK" },
  { name: "Settings", icon: "IC_CIRCLE_USER_ROUND" },
];

type MainNavigatorProps = {
  onResetOnboarding?: () => void;
  onWipeLocalData?: () => void;
};

export function MainNavigator({
  onResetOnboarding,
  onWipeLocalData,
}: MainNavigatorProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Home");

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "Home":
        return <HomeScreen />;
      case "Contacts":
        return <ContactsScreen />;
      case "Urge Log":
        return <UrgeLogScreen />;
      case "Protected":
        return <ProtectedScreen />;
      case "Settings":
        return (
          <SettingsScreen
            onResetOnboarding={onResetOnboarding}
            onWipeLocalData={onWipeLocalData}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderActiveScreen()}</View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          const tintColor = isActive ? colors.teal : colors.gray;

          return (
            <Pressable
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
              style={styles.tabButton}
            >
              <IconSvgLocal name={tab.icon} size={24} color={tintColor} />
              <Text style={[styles.tabLabel, { color: tintColor }]}>
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.paleTeal,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.medium,
    marginTop: 4,
    textAlign: "center",
  },
});
