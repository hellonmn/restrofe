import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AddressLabel, useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

type IconName = keyof typeof Ionicons.glyphMap;

const LABELS: { label: AddressLabel; icon: IconName }[] = [
  { label: "Home", icon: "home-outline" },
  { label: "Work", icon: "briefcase-outline" },
  { label: "Other", icon: "location-outline" },
];

const iconFor = (label: AddressLabel): IconName =>
  LABELS.find((l) => l.label === label)?.icon ?? "location-outline";

export default function AddressesScreen() {
  const router = useRouter();
  const { addresses, selectedAddress, addAddress, removeAddress, selectAddress } = useCart();

  const [adding, setAdding] = useState(addresses.length === 0);
  const [label, setLabel] = useState<AddressLabel>("Home");
  const [line, setLine] = useState("");

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const save = () => {
    if (line.trim().length < 3) {
      fire("medium");
      Alert.alert("Address needed", "Please enter your address (area, city).");
      return;
    }
    fire("success");
    addAddress(label, line);
    setLine("");
    setAdding(false);
  };

  const confirmDelete = (id: string, labelText: string) => {
    fire("medium");
    Alert.alert("Delete address", `Remove your ${labelText} address?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeAddress(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <Text style={styles.headerTitle}>Delivery address</Text>
        <View style={{ width: 42 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          {addresses.length > 0 && <Text style={styles.section}>Saved addresses</Text>}

          {addresses.map((a) => {
            const on = selectedAddress?.id === a.id;
            return (
              <PressableScale
                key={a.id}
                haptic="select"
                scaleTo={0.98}
                onPress={() => selectAddress(a.id)}
                style={[styles.card, on && styles.cardOn]}
              >
                <View style={[styles.iconBox, on && { backgroundColor: COLORS.primary }]}>
                  <Ionicons
                    name={iconFor(a.label)}
                    size={20}
                    color={on ? "#fff" : COLORS.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={styles.cardTitle}>{a.label}</Text>
                    {on && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Delivering here</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardLine} numberOfLines={2}>
                    {a.line}
                  </Text>
                </View>
                <Pressable hitSlop={10} onPress={() => confirmDelete(a.id, a.label)}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.muted} />
                </Pressable>
              </PressableScale>
            );
          })}

          {/* Add new */}
          {!adding ? (
            <PressableScale
              haptic="medium"
              scaleTo={0.97}
              onPress={() => setAdding(true)}
              style={styles.addRow}
            >
              <Ionicons name="add-circle" size={22} color={COLORS.primary} />
              <Text style={styles.addRowText}>Add new address</Text>
            </PressableScale>
          ) : (
            <View style={styles.form}>
              <Text style={styles.formTitle}>New address</Text>

              <View style={styles.labelRow}>
                {LABELS.map((l) => {
                  const active = label === l.label;
                  return (
                    <PressableScale
                      key={l.label}
                      haptic="select"
                      scaleTo={0.95}
                      onPress={() => setLabel(l.label)}
                      style={[styles.labelChip, active && styles.labelChipOn]}
                    >
                      <Ionicons
                        name={l.icon}
                        size={16}
                        color={active ? COLORS.primary : COLORS.subtext}
                      />
                      <Text style={[styles.labelText, active && styles.labelTextOn]}>
                        {l.label}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>

              <TextInput
                value={line}
                onChangeText={setLine}
                placeholder="House no., street, area, city"
                placeholderTextColor={COLORS.muted}
                multiline
                style={styles.input}
              />

              <View style={styles.formBtns}>
                <PressableScale
                  haptic="none"
                  scaleTo={0.97}
                  onPress={save}
                  style={[styles.saveBtn, SHADOW.lg]}
                >
                  <Text style={styles.saveText}>Save address</Text>
                </PressableScale>
                {addresses.length > 0 && (
                  <PressableScale
                    haptic="light"
                    scaleTo={0.97}
                    onPress={() => {
                      setAdding(false);
                      setLine("");
                    }}
                    style={styles.cancelBtn}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </PressableScale>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  row: { flexDirection: "row", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text, letterSpacing: -0.3 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },

  section: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    ...SHADOW.md,
  },
  cardOn: { borderColor: COLORS.primary, backgroundColor: "#FFF9F5" },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  cardLine: { fontSize: 13, color: COLORS.subtext, marginTop: 3, lineHeight: 18, paddingRight: 8 },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: COLORS.greenSoft,
  },
  badgeText: { fontSize: 10.5, fontWeight: "800", color: COLORS.green },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#FFB596",
    backgroundColor: COLORS.primarySoft,
    marginTop: 4,
  },
  addRowText: { marginLeft: 8, fontSize: 15, fontWeight: "800", color: COLORS.primary },

  form: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    marginTop: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  formTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text, marginBottom: 14 },
  labelRow: { flexDirection: "row", marginBottom: 14 },
  labelChip: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  labelChipOn: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary },
  labelText: { marginLeft: 6, fontSize: 13.5, fontWeight: "600", color: COLORS.subtext },
  labelTextOn: { color: COLORS.primary, fontWeight: "800" },
  input: {
    minHeight: 86,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: COLORS.text,
    textAlignVertical: "top",
  },
  formBtns: { marginTop: 16 },
  cancelBtn: {
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  cancelText: { fontSize: 14.5, fontWeight: "700", color: COLORS.subtext },
  saveBtn: {
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
