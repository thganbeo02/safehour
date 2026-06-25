import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fontFamilies } from "@/theme/typography";

type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>About Money Protected</Text>
          <Text style={styles.body}>
            Money Protected helps you log money that is kept safe from gambling
            or trading.
            {"\n\n"}
            This includes money you set aside from your real income or payments
            made towards debt. There are no targets, break-even percentages, or
            scoreboards, so you can focus on calm, honest, step-by-step
            progress.
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Understood</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 50, 94, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.paleTeal,
  },
  title: {
    color: colors.navy,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  body: {
    color: colors.gray,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
});
