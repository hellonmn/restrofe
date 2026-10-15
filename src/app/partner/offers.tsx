import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PackIcon } from "@/components/pack-icon";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";
import { PartnerOffer, useRestaurant } from "@/context/restaurant";

export default function PartnerOffersScreen() {
  const router = useRouter();
  const { offers, addOffer, toggleOffer, deleteOffer } = useRestaurant();

  const [modalVisible, setModalVisible] = useState(false);

  // New Offer Form State
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [minSpend, setMinSpend] = useState("299");
  const [kind, setKind] = useState<PartnerOffer["kind"]>("stacked");
  const [value, setValue] = useState("30");
  const [stackedValue, setStackedValue] = useState("20");
  const [typeTag, setTypeTag] = useState<PartnerOffer["typeTag"]>("Special");

  const openCreateModal = () => {
    fire("light");
    setCode("");
    setTitle("");
    setDesc("");
    setMinSpend("299");
    setKind("stacked");
    setValue("30");
    setStackedValue("20");
    setTypeTag("Special");
    setModalVisible(true);
  };

  const handleSaveOffer = () => {
    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode || !title.trim()) {
      fire("medium");
      Alert.alert("Missing Fields", "Please enter offer code and title.");
      return;
    }

    const minNum = parseInt(minSpend.replace(/\D/g, ""), 10) || 199;
    const valNum = parseInt(value.replace(/\D/g, ""), 10) || 20;
    const stackedNum = kind === "stacked" ? parseInt(stackedValue.replace(/\D/g, ""), 10) || 20 : undefined;

    const newOffer: PartnerOffer = {
      code: formattedCode,
      title: title.trim(),
      desc: desc.trim() || `Valid on bills above ₹${minNum}`,
      min: minNum,
      kind,
      value: valNum,
      stackedValue: stackedNum,
      icon: kind === "stacked" ? "flame" : "ticket",
      active: true,
      typeTag,
      expiresAt: "Active Promotion",
    };

    addOffer(newOffer);
    fire("success");
    setModalVisible(false);
  };

  const handleDeleteOffer = (codeToDelete: string) => {
    fire("medium");
    Alert.alert("Remove Offer", `Delete coupon code "${codeToDelete}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          fire("success");
          deleteOffer(codeToDelete);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <PressableScale
          haptic="light"
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <PackIcon name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>Offers & Deals</Text>
          <Text style={styles.headerSub}>Published deals show directly to diners</Text>
        </View>
        <PressableScale
          haptic="medium"
          style={styles.createTopBtn}
          onPress={openCreateModal}
        >
          <PackIcon name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.createTopText}>New Deal</Text>
        </PressableScale>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Pitch Deck Concept Banner */}
        <View style={[styles.conceptCard, SHADOW.sm]}>
          <View style={styles.conceptIcon}>
            <PackIcon name="ticket" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.conceptTitle}>Team Offer Concepts</Text>
            <Text style={styles.conceptDesc}>
              Stackable discounts (e.g. 30%+20%), Friday reward days, and loyalty visit streaks drive repeat diners to your restaurant.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Your Active Promotions ({offers.length})
        </Text>

        {offers.map((offer) => (
          <View
            key={offer.code}
            style={[
              styles.offerCard,
              SHADOW.sm,
              !offer.active && styles.offerCardInactive,
            ]}
          >
            <View style={styles.offerTop}>
              <View style={styles.tagWrap}>
                <View style={styles.badgeTag}>
                  <Text style={styles.badgeTagText}>{offer.typeTag || "Special"}</Text>
                </View>
                {offer.kind === "stacked" && (
                  <View style={[styles.badgeTag, { backgroundColor: "#FFF0EB" }]}>
                    <Text style={[styles.badgeTagText, { color: COLORS.primary }]}>
                      STACKED DISCOUNT
                    </Text>
                  </View>
                )}
              </View>

              <Switch
                value={offer.active}
                onValueChange={() => {
                  fire("select");
                  toggleOffer(offer.code);
                }}
                trackColor={{ false: "#D1D1D6", true: COLORS.greenSoft }}
                thumbColor={offer.active ? COLORS.green : "#f4f3f4"}
              />
            </View>

            <View style={styles.offerContentRow}>
              <View style={styles.codePill}>
                <Text style={styles.codeText}>{offer.code}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerDesc}>{offer.desc}</Text>
                <Text style={styles.offerMeta}>Min spend: ₹{offer.min}</Text>
              </View>
            </View>

            <View style={styles.offerFooter}>
              <Text
                style={[
                  styles.statusText,
                  { color: offer.active ? COLORS.green : COLORS.muted },
                ]}
              >
                {offer.active ? "🟢 Live in Diner App" : "⏸️ Paused (Hidden from Diners)"}
              </Text>

              <PressableScale
                haptic="medium"
                onPress={() => handleDeleteOffer(offer.code)}
                style={styles.deleteBtn}
              >
                <PackIcon name="trash" size={14} color={COLORS.red} />
                <Text style={styles.deleteText}>Delete</Text>
              </PressableScale>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Create Offer Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publish New Promotion</Text>
              <PressableScale
                haptic="light"
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <PackIcon name="cross" size={20} color={COLORS.text} />
              </PressableScale>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Offer Kind Selector */}
              <Text style={styles.fieldLabel}>Promotion Type</Text>
              <View style={styles.kindSelector}>
                {[
                  { id: "stacked", label: "30% + 20% Stacked" },
                  { id: "flat", label: "Flat ₹ OFF" },
                  { id: "percent", label: "% Discount" },
                ].map((k) => (
                  <PressableScale
                    key={k.id}
                    haptic="select"
                    style={[styles.kindBtn, kind === k.id && styles.kindBtnActive]}
                    onPress={() => setKind(k.id as any)}
                  >
                    <Text
                      style={[styles.kindBtnText, kind === k.id && styles.kindBtnTextActive]}
                    >
                      {k.label}
                    </Text>
                  </PressableScale>
                ))}
              </View>

              {/* Coupon Code */}
              <Text style={styles.fieldLabel}>Coupon Code *</Text>
              <TextInput
                value={code}
                onChangeText={(t) => setCode(t.toUpperCase())}
                placeholder="e.g. BURGER50"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="characters"
                style={styles.input}
              />

              {/* Title */}
              <Text style={styles.fieldLabel}>Offer Title *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={
                  kind === "stacked"
                    ? "e.g. 30% + 20% Mega Diner Deal"
                    : "e.g. Flat ₹100 OFF on ₹1,000 Bill"
                }
                placeholderTextColor={COLORS.muted}
                style={styles.input}
              />

              {/* Discount Value Inputs */}
              {kind === "stacked" ? (
                <View style={styles.rowInputs}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Base Discount (%)</Text>
                    <TextInput
                      value={value}
                      onChangeText={setValue}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: "900", marginHorizontal: 8, alignSelf: "center", marginTop: 20 }}>
                    +
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Stacked Extra (%)</Text>
                    <TextInput
                      value={stackedValue}
                      onChangeText={setStackedValue}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={styles.fieldLabel}>
                    {kind === "flat" ? "Discount Amount (₹)" : "Discount (%)"}
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={setValue}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              )}

              {/* Minimum Spend */}
              <Text style={styles.fieldLabel}>Minimum Bill Amount (₹)</Text>
              <TextInput
                value={minSpend}
                onChangeText={setMinSpend}
                placeholder="e.g. 499"
                keyboardType="numeric"
                style={styles.input}
              />

              {/* Tag / Category */}
              <Text style={styles.fieldLabel}>Tag on Card</Text>
              <View style={styles.tagPickerRow}>
                {(["Special", "Visit Streak", "Friday Deal", "Birthday"] as const).map(
                  (t) => (
                    <PressableScale
                      key={t}
                      haptic="select"
                      style={[styles.tagPickerChip, typeTag === t && styles.tagPickerActive]}
                      onPress={() => setTypeTag(t)}
                    >
                      <Text
                        style={[
                          styles.tagPickerText,
                          typeTag === t && styles.tagPickerTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </PressableScale>
                  )
                )}
              </View>

              <PressableScale
                haptic="success"
                style={[styles.publishBtn, SHADOW.lg]}
                onPress={handleSaveOffer}
              >
                <Text style={styles.publishBtnText}>Publish Offer to App</Text>
              </PressableScale>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  createTopBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  createTopText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  conceptCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  conceptIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  conceptTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  conceptDesc: {
    fontSize: 11,
    color: COLORS.subtext,
    lineHeight: 16,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
  },
  offerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offerCardInactive: {
    opacity: 0.6,
  },
  offerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tagWrap: {
    flexDirection: "row",
    gap: 6,
  },
  badgeTag: {
    backgroundColor: "#F0ECE6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.subtext,
  },
  offerContentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  codePill: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  codeText: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.primary,
  },
  offerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  offerDesc: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 2,
  },
  offerMeta: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 4,
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5EFE9",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteText: {
    fontSize: 11,
    color: COLORS.red,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 6,
  },
  kindSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  kindBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kindBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  kindBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.subtext,
  },
  kindBtnTextActive: {
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  rowInputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagPickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
  },
  tagPickerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagPickerActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  tagPickerText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  tagPickerTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  publishBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
