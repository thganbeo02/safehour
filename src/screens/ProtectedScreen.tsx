import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { useToast } from "react-native-toast-notifications";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import { colors } from "@/theme/colors";
import { fontFamilies, typography } from "@/theme/typography";
import {
  getMoneyProtectedSum,
  getProtectionEntries,
  saveProtectionEntry,
  type ProtectionEntry,
} from "@/storage/db";

interface PlaceOption {
  id: string;
  name: string;
  reachability: "self_held" | "held_by_other";
}

interface LenderOption {
  id: string;
  name: string;
}

// Inline Custom SVG Icons matching the mockup
const BankIcon = ({ color }: { color: string }) => (
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
    <Path d="M3 21h18" />
    <Path d="M19 21v-8" />
    <Path d="M5 21v-8" />
    <Path d="M12 21v-8" />
    <Path d="M3 10h18" />
    <Path d="M12 3L3 10h18z" />
  </Svg>
);

const CashIcon = ({ color }: { color: string }) => (
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
    <Rect x={2} y={6} width={20} height={12} rx={2} />
    <Circle cx={12} cy={12} r={2} />
    <Path d="M6 12h.01M18 12h.01" />
  </Svg>
);

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
  const [totalProtected, setTotalProtected] = useState<number>(0);
  const [entries, setEntries] = useState<ProtectionEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<"saved" | "debt_repaid" | "withdrawal">("saved");
  const [context, setContext] = useState("");

  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [translateAnim] = useState(() => new Animated.Value(0));

  // Stateful selection lists based on the add_sheet design mockup
  const [places, setPlaces] = useState<PlaceOption[]>([
    { id: "bank", name: "In a bank", reachability: "self_held" },
    { id: "cash", name: "As cash", reachability: "self_held" },
  ]);

  const [lenders, setLenders] = useState<LenderOption[]>([
    { id: "credit_card", name: "Credit card" },
    { id: "bank_loan", name: "Bank loan" },
  ]);

  const [selectedPlaceId, setSelectedPlaceId] = useState("bank");
  const [selectedLenderId, setSelectedLenderId] = useState("credit_card");

  // Inline "Add place/lender" State
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceIsTrusted, setNewPlaceIsTrusted] = useState(false);

  const [isAddingLender, setIsAddingLender] = useState(false);
  const [newLenderName, setNewLenderName] = useState("");

  const formatAsYouType = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("en-US").format(parseInt(clean, 10));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const sum = await getMoneyProtectedSum();
      const list = await getProtectionEntries();
      setTotalProtected(sum);
      setEntries(list);
    } catch (error) {
      console.error("Failed to load protected money data", error);
    }
  };

  const handleOpenAddForm = () => {
    setAmount("");
    setKind("saved");
    setSelectedPlaceId("bank");
    setSelectedLenderId("credit_card");
    setIsAddingPlace(false);
    setIsAddingLender(false);
    setContext("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    const numericAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a positive number.");
      return;
    }

    let finalDestination = "";
    let finalReachability: "self_held" | "held_by_other" | null = null;

    if (kind === "saved" || kind === "withdrawal") {
      const p = places.find((x) => x.id === selectedPlaceId);
      if (!p) {
        Alert.alert("Error", "Please select where this money is kept.");
        return;
      }
      finalDestination = p.name;
      finalReachability = p.reachability;
    } else {
      const l = lenders.find((x) => x.id === selectedLenderId);
      if (!l) {
        Alert.alert("Error", "Please select who was repaid.");
        return;
      }
      finalDestination = l.name;
      finalReachability = null;
    }

    // Withdrawal stores amount as negative
    const finalAmount = kind === "withdrawal" ? -numericAmount : numericAmount;

    // Define the toast message verb-first
    let toastMsg = "";
    if (kind === "saved") {
      toastMsg = `Protected · ${amount} VND kept aside`;
    } else if (kind === "debt_repaid") {
      toastMsg = `Protected · ${amount} VND repaid`;
    } else {
      toastMsg = `Protected · ${amount} VND withdrawn`;
    }

    const executeSave = async () => {
      try {
        setIsSaving(true);
        await saveProtectionEntry({
          amount: finalAmount,
          currency: "VND",
          kind,
          destination: finalDestination,
          reachability: finalReachability,
          context: context.trim() || undefined,
        });

        // Swap Save button to "Saved" with check icon (hold for 700ms)
        setIsSaving(false);
        setIsSaved(true);

        setTimeout(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
              toValue: -8,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setModalVisible(false);
            // Reset state
            fadeAnim.setValue(1);
            translateAnim.setValue(0);
            setIsSaved(false);
            loadData();

            // Fire custom slide-in toast from bottom
            setTimeout(() => {
              toast.show(toastMsg, {
                type: "protection_saved",
                animationType: "slide-in",
                duration: 1800,
              });
            }, 100);
          });
        }, 700);

      } catch (error) {
        setIsSaving(false);
        Alert.alert("Error", "Could not save protection entry.");
        console.error(error);
      }
    };

    // If it's a withdrawal from trusted person (held_by_other), trigger friction gate!
    if (kind === "withdrawal" && finalReachability === "held_by_other") {
      Alert.alert(
        "Pause & Contact",
        "This money is held by a trusted person. To protect your recovery, we encourage you to take a breath, pause for 10 minutes, and contact your accountability person before making any fast money movements.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "I have paused & wish to record this withdrawal",
            onPress: executeSave,
          },
        ]
      );
      return;
    }

    await executeSave();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandBox}>
          <View style={styles.logoBox}>
            <IconSvgLocal name="IC_SHIELD_CHECK" size={24} color={colors.white} />
          </View>
          <Text style={styles.brandText}>SafeHour</Text>
        </View>
        <Pressable style={styles.helpButton} onPress={() => setInfoModalVisible(true)}>
          <Text style={styles.helpText}>?</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title and Subtitle */}
        <Text style={styles.mainTitle}>Money Protected</Text>
        <Text style={styles.mainSubtitle}>
          Money kept out of the loop through saving or debt repayment.
        </Text>

        {/* Protected Card */}
        <View style={styles.protectedCard}>
          <Text style={styles.cardHeader}>Protected so far</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountNum}>{formatCurrency(totalProtected)}</Text>
            <Text style={styles.currencyLabel}>VND</Text>
          </View>
          <Text style={styles.cardFooter}>Small steps create a calm path forward.</Text>
        </View>

        {/* Add Entry Button */}
        <Pressable style={styles.addEntryButton} onPress={handleOpenAddForm}>
          <Text style={styles.addEntryText}>+ Add protection entry</Text>
        </Pressable>

        {/* History List or Empty State */}
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <View style={styles.shieldOutline}>
                <IconSvgLocal name="IC_SHIELD_CHECK" size={54} color={colors.gray} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyBody}>
              When you keep money out of the loop — even a small amount — you can record it here.
              No targets, no goals. Just a quiet record of what you've protected.
            </Text>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Protection History</Text>
            {entries.map((item) => {
              const isNegative = item.amount_protected < 0;
              return (
                <View key={item.id} style={styles.historyRow}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyKind}>
                      {item.kind === "saved"
                        ? "Saved"
                        : item.kind === "debt_repaid"
                        ? "Repaid Debt"
                        : "Withdrawal"}
                    </Text>
                    <Text style={styles.historyDestination}>
                      {item.destination}
                      {item.reachability === "held_by_other" ? " (Held by Trusted Person)" : ""}
                    </Text>
                    {item.context ? (
                      <Text style={styles.historyNote}>{item.context}</Text>
                    ) : null}
                    <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text
                      style={[
                        styles.historyAmount,
                        { color: isNegative ? colors.gray : colors.teal },
                      ]}
                    >
                      {isNegative ? "-" : "+"}
                      {formatCurrency(Math.abs(item.amount_protected))}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Info/Help Modal */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <Text style={styles.infoModalTitle}>About Money Protected</Text>
            <Text style={styles.infoModalText}>
              Money Protected helps you log money that is kept safe from gambling or trading.
              {"\n\n"}
              This includes money you set aside from your real income or payments made towards
              debt. There are no targets, break-even percentages, or scoreboards, so you can focus
              on calm, honest, step-by-step progress.
            </Text>
            <Pressable
              style={styles.closeButtonPrimary}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Understood</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Protection Entry Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderTitle}>Add protection</Text>
            <Pressable style={styles.closeFormButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeFormText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.formScroll} keyboardShouldPersistTaps="handled">
            {/* Amount Label */}
            <Text style={styles.amountLabel}>Amount</Text>
            {/* Amount input with border bottom only */}
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.gray}
                value={amount}
                onChangeText={(txt) => setAmount(formatAsYouType(txt))}
              />
              <Text style={styles.amountCurrency}>VND</Text>
            </View>

            {/* What kind Selector */}
            <Text style={styles.fieldLabel}>What kind</Text>
            <View style={styles.kindSelectorContainer}>
              <Pressable
                style={[
                  styles.kindBtn,
                  kind === "saved" && styles.kindBtnActive,
                ]}
                onPress={() => setKind("saved")}
              >
                <Text
                  style={[
                    styles.kindBtnText,
                    kind === "saved" && styles.kindBtnTextActive,
                  ]}
                >
                  Set aside
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.kindBtn,
                  kind === "debt_repaid" && styles.kindBtnActive,
                ]}
                onPress={() => setKind("debt_repaid")}
              >
                <Text
                  style={[
                    styles.kindBtnText,
                    kind === "debt_repaid" && styles.kindBtnTextActive,
                  ]}
                >
                  Repaid debt
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.kindBtn,
                  kind === "withdrawal" && styles.kindBtnActive,
                ]}
                onPress={() => setKind("withdrawal")}
              >
                <Text
                  style={[
                    styles.kindBtnText,
                    kind === "withdrawal" && styles.kindBtnTextActive,
                  ]}
                >
                  Withdraw
                </Text>
              </Pressable>
            </View>

            {/* Where it's kept OR Who did you repay lists */}
            {kind === "saved" || kind === "withdrawal" ? (
              <>
                <Text style={styles.fieldLabel}>Where it's kept</Text>
                <View style={styles.placesBox}>
                  {places.map((place) => {
                    const isSelected = selectedPlaceId === place.id;
                    return (
                      <Pressable
                        key={place.id}
                        style={[styles.placeRow, isSelected && styles.placeRowSelected]}
                        onPress={() => setSelectedPlaceId(place.id)}
                      >
                        {place.id === "bank" ? (
                          <BankIcon color={isSelected ? colors.teal : colors.gray} />
                        ) : (
                          <CashIcon color={isSelected ? colors.teal : colors.gray} />
                        )}
                        <Text style={[styles.placeLabel, isSelected && styles.placeLabelSelected]}>
                          {place.name}
                          {place.reachability === "held_by_other" ? " (Trusted Person)" : ""}
                        </Text>
                        {isSelected && (
                          <IconSvgLocal name="IC_COMPLETE" size={16} color={colors.teal} />
                        )}
                      </Pressable>
                    );
                  })}

                  {/* Inline custom place adding */}
                  {isAddingPlace ? (
                    <View style={styles.addCustomRow}>
                      <TextInput
                        style={styles.addCustomInput}
                        placeholder="e.g. Kept with Sister"
                        placeholderTextColor={colors.gray}
                        value={newPlaceName}
                        onChangeText={setNewPlaceName}
                        autoFocus
                      />
                      <View style={styles.trustedPersonToggle}>
                        <Text style={styles.trustedPersonToggleText}>Held by trusted person?</Text>
                        <Pressable
                          style={[styles.smallToggle, newPlaceIsTrusted && styles.smallToggleActive]}
                          onPress={() => setNewPlaceIsTrusted(!newPlaceIsTrusted)}
                        >
                          <Text
                            style={[
                              styles.smallToggleText,
                              newPlaceIsTrusted && styles.smallToggleTextActive,
                            ]}
                          >
                            {newPlaceIsTrusted ? "Yes" : "No"}
                          </Text>
                        </Pressable>
                      </View>
                      <View style={styles.addCustomActions}>
                        <Pressable
                          style={styles.addCustomBtnCancel}
                          onPress={() => {
                            setIsAddingPlace(false);
                            setNewPlaceName("");
                            setNewPlaceIsTrusted(false);
                          }}
                        >
                          <Text style={styles.addCustomBtnCancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={styles.addCustomBtnConfirm}
                          onPress={() => {
                            if (!newPlaceName.trim()) return;
                            const newId = `custom_${Date.now()}`;
                            const newPlaceObj: PlaceOption = {
                              id: newId,
                              name: newPlaceName.trim(),
                              reachability: newPlaceIsTrusted ? "held_by_other" : "self_held",
                            };
                            setPlaces([...places, newPlaceObj]);
                            setSelectedPlaceId(newId);
                            setIsAddingPlace(false);
                            setNewPlaceName("");
                            setNewPlaceIsTrusted(false);
                          }}
                        >
                          <Text style={styles.addCustomBtnConfirmText}>Add</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.placeRow}
                      onPress={() => {
                        setIsAddingPlace(true);
                        setNewPlaceName("");
                        setNewPlaceIsTrusted(false);
                      }}
                    >
                      <PlusIcon color={colors.teal} />
                      <Text style={styles.addPlaceLabel}>Add a place</Text>
                    </Pressable>
                  )}
                </View>
                <Text style={styles.disclaimerCopy}>
                  Bank and cash to start. You can add your own, like money kept with someone you
                  trust.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Who was repaid</Text>
                <View style={styles.placesBox}>
                  {lenders.map((lender) => {
                    const isSelected = selectedLenderId === lender.id;
                    return (
                      <Pressable
                        key={lender.id}
                        style={[styles.placeRow, isSelected && styles.placeRowSelected]}
                        onPress={() => setSelectedLenderId(lender.id)}
                      >
                        <BankIcon color={isSelected ? colors.teal : colors.gray} />
                        <Text style={[styles.placeLabel, isSelected && styles.placeLabelSelected]}>
                          {lender.name}
                        </Text>
                        {isSelected && (
                          <IconSvgLocal name="IC_COMPLETE" size={16} color={colors.teal} />
                        )}
                      </Pressable>
                    );
                  })}

                  {/* Inline custom lender adding */}
                  {isAddingLender ? (
                    <View style={styles.addCustomRow}>
                      <TextInput
                        style={styles.addCustomInput}
                        placeholder="e.g. Credit Card, Friend loan"
                        placeholderTextColor={colors.gray}
                        value={newLenderName}
                        onChangeText={setNewLenderName}
                        autoFocus
                      />
                      <View style={styles.addCustomActions}>
                        <Pressable
                          style={styles.addCustomBtnCancel}
                          onPress={() => {
                            setIsAddingLender(false);
                            setNewLenderName("");
                          }}
                        >
                          <Text style={styles.addCustomBtnCancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={styles.addCustomBtnConfirm}
                          onPress={() => {
                            if (!newLenderName.trim()) return;
                            const newId = `custom_${Date.now()}`;
                            const newLenderObj: LenderOption = {
                              id: newId,
                              name: newLenderName.trim(),
                            };
                            setLenders([...lenders, newLenderObj]);
                            setSelectedLenderId(newId);
                            setIsAddingLender(false);
                            setNewLenderName("");
                          }}
                        >
                          <Text style={styles.addCustomBtnConfirmText}>Add</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.placeRow}
                      onPress={() => {
                        setIsAddingLender(true);
                        setNewLenderName("");
                      }}
                    >
                      <PlusIcon color={colors.teal} />
                      <Text style={styles.addPlaceLabel}>Add a lender</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}

            {/* Context/Notes Input */}
            <Text style={styles.fieldLabel}>Note (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={3}
              placeholder="Add any extra details here..."
              placeholderTextColor={colors.gray}
              value={context}
              onChangeText={setContext}
            />

          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.formFooter}>
            <Pressable
              style={[
                styles.saveButton,
                (isNaN(parseFloat(amount.replace(/,/g, ""))) || parseFloat(amount.replace(/,/g, "")) <= 0 || isSaving || isSaved) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isNaN(parseFloat(amount.replace(/,/g, ""))) || parseFloat(amount.replace(/,/g, "")) <= 0 || isSaving || isSaved}
            >
              {isSaved ? (
                <View style={styles.savedButtonLabelContainer}>
                  <Svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.teal}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M20 6L9 17l-5-5" />
                  </Svg>
                  <Text style={[styles.saveButtonText, { color: colors.teal }]}>
                    Saved
                  </Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    paddingTop: Platform.OS === "ios" ? 64 : 40,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  brandBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 22,
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
    lineHeight: 22,
    marginBottom: 28,
  },
  protectedCard: {
    backgroundColor: "#E8F4F2",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.navy,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
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
  cardFooter: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  addEntryButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderStyle: "dashed",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  addEntryText: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 20,
  },
  emptyIconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldOutline: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
    marginBottom: 12,
    textAlign: "center",
  },
  emptyBody: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  historyContainer: {
    marginTop: 8,
  },
  historyTitle: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    marginBottom: 16,
  },
  historyRow: {
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyLeft: {
    flex: 1,
    paddingRight: 12,
  },
  historyKind: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    marginBottom: 2,
  },
  historyDestination: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    marginBottom: 4,
  },
  historyNote: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
  historyDate: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 11,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAmount: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 50, 94, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  infoModalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.paleTeal,
  },
  infoModalTitle: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  infoModalText: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  closeButtonPrimary: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 44 : 24,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  formHeaderTitle: {
    fontSize: 32,
    fontFamily: fontFamilies.bold,
    color: colors.navy,
  },
  closeFormButton: {
    padding: 4,
  },
  closeFormText: {
    fontSize: 24,
    fontFamily: fontFamilies.regular,
    color: colors.navy,
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.navy,
    paddingBottom: 8,
    marginBottom: 24,
  },
  amountInput: {
    fontSize: 36,
    fontFamily: fontFamilies.medium,
    color: colors.navy,
    flex: 1,
    padding: 0,
  },
  amountCurrency: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fontFamilies.regular,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    marginBottom: 10,
    marginTop: 16,
  },
  kindSelectorContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  kindBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  kindBtnActive: {
    borderWidth: 1.5,
    borderColor: colors.teal,
    backgroundColor: "#E8F4F2",
  },
  kindBtnText: {
    fontSize: 14,
    color: colors.navy,
    fontFamily: fontFamilies.regular,
  },
  kindBtnTextActive: {
    color: colors.teal,
    fontFamily: fontFamilies.regular,
  },
  placesBox: {
    borderWidth: 1,
    borderColor: colors.paleTeal,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    marginBottom: 14,
  },
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.paleTeal,
  },
  placeRowSelected: {
    backgroundColor: "#F9FAFB",
  },
  placeLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.navy,
    fontFamily: fontFamilies.regular,
  },
  placeLabelSelected: {
    fontFamily: fontFamilies.regular,
    color: colors.teal,
  },
  addPlaceLabel: {
    fontSize: 15,
    color: colors.teal,
    fontFamily: fontFamilies.regular,
  },
  addCustomRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.paleTeal,
    backgroundColor: "#F9FAFB",
  },
  addCustomInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.navy,
    marginBottom: 10,
  },
  trustedPersonToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  trustedPersonToggleText: {
    fontSize: 13,
    color: colors.gray,
    fontFamily: fontFamilies.regular,
  },
  smallToggle: {
    borderWidth: 1,
    borderColor: colors.paleTeal,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.white,
  },
  smallToggleActive: {
    borderColor: colors.teal,
    backgroundColor: "#E8F4F2",
  },
  smallToggleText: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: fontFamilies.regular,
  },
  smallToggleTextActive: {
    color: colors.teal,
    fontFamily: fontFamilies.regular,
  },
  addCustomActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  addCustomBtnCancel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addCustomBtnCancelText: {
    fontSize: 13,
    color: colors.gray,
    fontFamily: fontFamilies.regular,
  },
  addCustomBtnConfirm: {
    backgroundColor: colors.teal,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  addCustomBtnConfirmText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: fontFamilies.regular,
  },
  disclaimerCopy: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
    paddingLeft: 2,
    marginBottom: 24,
    fontFamily: fontFamilies.regular,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.paleTeal,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    color: colors.navy,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  formFooter: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: colors.paleTeal,
    paddingTop: 12,
  },
  saveButton: {
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  saveButtonText: {
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
  },
  savedButtonLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  saveButtonDisabled: {
    opacity: 0.35,
  },
});
