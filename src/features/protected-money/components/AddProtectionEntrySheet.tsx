import { useState } from "react";
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
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useToast } from "react-native-toast-notifications";

import { IconSvgLocal } from "@/components/icons/IconSvgLocal";
import { colors } from "@/theme/colors";
import { fontFamilies } from "@/theme/typography";

type ProtectionKind = "saved" | "debt_repaid" | "withdrawal";

type PlaceOption = {
  id: string;
  name: string;
  reachability: "self_held" | "held_by_other";
};

type LenderOption = {
  id: string;
  name: string;
};

type SaveEntryInput = {
  amount: number;
  currency: string;
  kind: ProtectionKind;
  destination: string;
  reachability?: "self_held" | "held_by_other" | null;
  context?: string;
};

type AddProtectionEntrySheetProps = {
  visible: boolean;
  totalProtected: number;
  onClose: () => void;
  onSaved: (previousTotal: number) => void;
  saveEntry: (entry: SaveEntryInput) => Promise<void>;
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

const PlusIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

function formatAsYouType(text: string) {
  const clean = text.replace(/[^0-9]/g, "");
  if (!clean) return "";
  return new Intl.NumberFormat("en-US").format(parseInt(clean, 10));
}

export function AddProtectionEntrySheet({
  visible,
  totalProtected,
  onClose,
  onSaved,
  saveEntry,
}: AddProtectionEntrySheetProps) {
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<ProtectionKind>("saved");
  const [context, setContext] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [translateAnim] = useState(() => new Animated.Value(0));
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
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceIsTrusted, setNewPlaceIsTrusted] = useState(false);
  const [isAddingLender, setIsAddingLender] = useState(false);
  const [newLenderName, setNewLenderName] = useState("");

  function resetForm() {
    setAmount("");
    setKind("saved");
    setSelectedPlaceId("bank");
    setSelectedLenderId("credit_card");
    setIsAddingPlace(false);
    setIsAddingLender(false);
    setContext("");
  }

  async function handleSave() {
    const numericAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a positive number.");
      return;
    }

    let finalDestination = "";
    let finalReachability: "self_held" | "held_by_other" | null = null;

    if (kind === "saved" || kind === "withdrawal") {
      const place = places.find((item) => item.id === selectedPlaceId);
      if (!place) {
        Alert.alert("Error", "Please select where this money is kept.");
        return;
      }
      finalDestination = place.name;
      finalReachability = place.reachability;
    } else {
      const lender = lenders.find((item) => item.id === selectedLenderId);
      if (!lender) {
        Alert.alert("Error", "Please select who was repaid.");
        return;
      }
      finalDestination = lender.name;
    }

    const finalAmount = kind === "withdrawal" ? -numericAmount : numericAmount;
    const toastMsg =
      kind === "saved"
        ? `Protected · ${amount} VND kept aside`
        : kind === "debt_repaid"
          ? `Protected · ${amount} VND repaid`
          : `Protected · ${amount} VND withdrawn`;

    const executeSave = async () => {
      try {
        const previousTotal = totalProtected;
        setIsSaving(true);
        await saveEntry({
          amount: finalAmount,
          currency: "VND",
          kind,
          destination: finalDestination,
          reachability: finalReachability,
          context: context.trim() || undefined,
        });

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
            onClose();
            fadeAnim.setValue(1);
            translateAnim.setValue(0);
            setIsSaved(false);
            resetForm();
            onSaved(previousTotal);

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
        ],
      );
      return;
    }

    await executeSave();
  }

  const saveDisabled =
    isNaN(parseFloat(amount.replace(/,/g, ""))) ||
    parseFloat(amount.replace(/,/g, "")) <= 0 ||
    isSaving ||
    isSaved;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add protection</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.amountLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.gray}
              value={amount}
              onChangeText={(text) => setAmount(formatAsYouType(text))}
            />
            <Text style={styles.amountCurrency}>VND</Text>
          </View>

          <Text style={styles.fieldLabel}>What kind</Text>
          <View style={styles.kindSelectorContainer}>
            {[
              ["saved", "Set aside"],
              ["debt_repaid", "Repaid debt"],
              ["withdrawal", "Withdraw"],
            ].map(([value, label]) => (
              <Pressable
                key={value}
                style={[styles.kindBtn, kind === value && styles.kindBtnActive]}
                onPress={() => setKind(value as ProtectionKind)}
              >
                <Text
                  style={[
                    styles.kindBtnText,
                    kind === value && styles.kindBtnTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

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
                      <Text
                        style={[
                          styles.placeLabel,
                          isSelected && styles.placeLabelSelected,
                        ]}
                      >
                        {place.name}
                        {place.reachability === "held_by_other"
                          ? " (Trusted Person)"
                          : ""}
                      </Text>
                      {isSelected ? (
                        <IconSvgLocal
                          name="IC_COMPLETE"
                          size={16}
                          color={colors.teal}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}

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
                      <Text style={styles.trustedPersonToggleText}>
                        Held by trusted person?
                      </Text>
                      <Pressable
                        style={[
                          styles.smallToggle,
                          newPlaceIsTrusted && styles.smallToggleActive,
                        ]}
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
                            reachability: newPlaceIsTrusted
                              ? "held_by_other"
                              : "self_held",
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
                Bank and cash to start. You can add your own, like money kept
                with someone you trust.
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
                      <Text
                        style={[
                          styles.placeLabel,
                          isSelected && styles.placeLabelSelected,
                        ]}
                      >
                        {lender.name}
                      </Text>
                      {isSelected ? (
                        <IconSvgLocal
                          name="IC_COMPLETE"
                          size={16}
                          color={colors.teal}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}

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

        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, saveDisabled && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saveDisabled}
          >
            {isSaved ? (
              <View style={styles.savedButtonLabelContainer}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.infoBlue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M20 6L9 17l-5-5" />
                </Svg>
                <Text style={[styles.saveButtonText, { color: colors.infoBlue }]}>Saved</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 44 : 24,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: fontFamilies.bold,
    color: colors.navy,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 24,
    fontFamily: fontFamilies.regular,
    color: colors.navy,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    marginTop: 10,
    marginBottom: 4,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.navy,
    marginBottom: 24,
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontFamily: fontFamilies.bold,
    color: colors.navy,
    paddingVertical: 8,
  },
  amountCurrency: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: colors.navy,
    marginLeft: 8,
  },
  fieldLabel: {
    fontSize: 15,
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    marginBottom: 10,
  },
  kindSelectorContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  kindBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  kindBtnActive: {
    backgroundColor: colors.paleTeal,
    borderColor: colors.teal,
  },
  kindBtnText: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: colors.gray,
  },
  kindBtnTextActive: {
    color: colors.teal,
  },
  placesBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    overflow: "hidden",
    marginBottom: 12,
  },
  placeRow: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F1",
    backgroundColor: colors.white,
  },
  placeRowSelected: {
    backgroundColor: "#F0FAF8",
  },
  placeLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: fontFamilies.regular,
    color: colors.gray,
  },
  placeLabelSelected: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
  },
  addPlaceLabel: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.teal,
  },
  addCustomRow: {
    padding: 14,
    gap: 12,
    backgroundColor: "#F8FAFA",
  },
  addCustomInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
  },
  trustedPersonToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trustedPersonToggleText: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
  },
  smallToggle: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  smallToggleActive: {
    borderColor: colors.teal,
    backgroundColor: colors.paleTeal,
  },
  smallToggleText: {
    color: colors.gray,
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
  smallToggleTextActive: {
    color: colors.teal,
  },
  addCustomActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  addCustomBtnCancel: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  addCustomBtnCancelText: {
    color: colors.gray,
    fontFamily: fontFamilies.bold,
    fontSize: 13,
  },
  addCustomBtnConfirm: {
    backgroundColor: colors.teal,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  addCustomBtnConfirmText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 13,
  },
  disclaimerCopy: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  textInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.paleTeal,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.navy,
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    backgroundColor: colors.white,
  },
  textArea: {
    minHeight: 92,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.paleTeal,
    backgroundColor: colors.white,
  },
  saveButton: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.45,
  },
  saveButtonText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  savedButtonLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
