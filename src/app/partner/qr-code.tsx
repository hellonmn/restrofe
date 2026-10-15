import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PackIcon } from "@/components/pack-icon";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";
import { useRestaurant } from "@/context/restaurant";

const TABLES = ["Table 01", "Table 02", "Table 03", "Table 04", "Main Counter"];

export default function PartnerQRCodeScreen() {
  const router = useRouter();
  const { activeRestaurant, account, logVisit } = useRestaurant();

  const [selectedTable, setSelectedTable] = useState("Table 01");
  const [testSimulating, setTestSimulating] = useState(false);

  const handleShare = () => {
    fire("light");
    Share.share({
      message: `Restrofe In-Restaurant Payment QR for ${activeRestaurant.name} (${selectedTable}) - Scan & Pay at table to earn wallet coins! Linked to: ${account.upiId}`,
    }).catch(() => {});
  };

  const handleSimulatePayment = () => {
    fire("success");
    setTestSimulating(true);

    const testAmount = Math.floor(Math.random() * 400) + 450;
    logVisit({
      customerName: "Sample Diner (Live QR)",
      phone: "+91 98200*****",
      amount: testAmount,
      tableNumber: selectedTable.replace("Table ", "T-"),
      status: "Verified",
      method: "Restrofe QR",
    });

    setTimeout(() => {
      setTestSimulating(false);
      Alert.alert(
        "QR Payment Confirmed! 💳",
        `Simulated ₹${testAmount} paid at ${selectedTable}. Verified in your visits and dashboard revenue logs.`,
        [{ text: "View in Dashboard", onPress: () => router.push("/partner" as any) }]
      );
    }, 600);
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
          <Text style={styles.headerTitle}>Scan to Pay QR</Text>
          <Text style={styles.headerSub}>In-restaurant table payment standee</Text>
        </View>
        <PressableScale haptic="light" style={styles.shareBtn} onPress={handleShare}>
          <PackIcon name="share" size={18} color={COLORS.primary} />
        </PressableScale>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Table Selector */}
        <Text style={styles.sectionLabel}>Select Table or Standee</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tableSelectorRow}
        >
          {TABLES.map((t) => {
            const isSel = t === selectedTable;
            return (
              <PressableScale
                key={t}
                haptic="select"
                style={[styles.tableChip, isSel && styles.tableChipActive]}
                onPress={() => setSelectedTable(t)}
              >
                <Text style={[styles.tableChipText, isSel && styles.tableChipTextActive]}>
                  {t}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>

        {/* Printable Standee Card Preview */}
        <View style={[styles.standeeCard, SHADOW.lg]}>
          {/* Top Brand Banner */}
          <View style={styles.standeeTop}>
            <View style={styles.brandRow}>
              <Text style={styles.brandText}>
                Restr<Text style={{ color: COLORS.primary }}>o</Text>fe
              </Text>
              <View style={styles.tablePill}>
                <Text style={styles.tablePillText}>{selectedTable}</Text>
              </View>
            </View>
            <Text style={styles.standeeRestaurantName}>
              {activeRestaurant.name}
            </Text>
          </View>

          {/* QR Code Canvas Representation */}
          <View style={styles.qrContainer}>
            <View style={styles.qrGraphic}>
              {/* Corner Positional Markers */}
              <View style={[styles.qrCorner, { top: 12, left: 12 }]}>
                <View style={styles.qrCornerInner} />
              </View>
              <View style={[styles.qrCorner, { top: 12, right: 12 }]}>
                <View style={styles.qrCornerInner} />
              </View>
              <View style={[styles.qrCorner, { bottom: 12, left: 12 }]}>
                <View style={styles.qrCornerInner} />
              </View>

              {/* Center Restrofe Mini Logo */}
              <View style={styles.qrCenterBadge}>
                <Text style={{ fontSize: 18 }}>🍽️</Text>
              </View>

              {/* Simulated QR data grid dots */}
              <View style={styles.qrGridDots}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrPixel,
                      i % 3 === 0 && { opacity: 0.15 },
                      i % 7 === 0 && { backgroundColor: COLORS.primary },
                    ]}
                  />
                ))}
              </View>
            </View>

            <Text style={styles.scanInstruction}>
              SCAN WITH ANY UPI APP OR CAMERA
            </Text>
            <Text style={styles.payoutDetail}>
              Direct Settlement: {account.upiId}
            </Text>
          </View>

          {/* Bottom Incentive Strip (Slide 04/06 of Pitch Deck) */}
          <View style={styles.standeeBottom}>
            <View style={styles.perkItem}>
              <PackIcon name="flash" size={14} color={COLORS.primary} />
              <Text style={styles.perkText}>Instant Bill Pay</Text>
            </View>
            <Text style={styles.perkDot}>•</Text>
            <View style={styles.perkItem}>
              <PackIcon name="ticket" size={14} color={COLORS.green} />
              <Text style={styles.perkText}>Auto-Applied Offers</Text>
            </View>
            <Text style={styles.perkDot}>•</Text>
            <View style={styles.perkItem}>
              <PackIcon name="star" size={14} color={COLORS.star} />
              <Text style={styles.perkText}>Earn Coins</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <PressableScale
            haptic="medium"
            style={[styles.primaryActionBtn, SHADOW.md]}
            onPress={handleShare}
          >
            <PackIcon name="share" size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Share / Save Standee</Text>
          </PressableScale>

          <PressableScale
            haptic="medium"
            style={[styles.testQrBtn, SHADOW.sm]}
            onPress={handleSimulatePayment}
          >
            <PackIcon name="bolt" size={18} color={COLORS.primary} />
            <Text style={styles.testQrText}>
              {testSimulating ? "Simulating..." : "Test Customer Scan"}
            </Text>
          </PressableScale>
        </View>

        {/* How it works card */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>How In-Restaurant QR Works</Text>
          {[
            {
              num: "1",
              title: "Display on table standees",
              desc: "Print this standee and place on table counters.",
            },
            {
              num: "2",
              title: "Customer scans & reviews bill",
              desc: "Diner scans QR with phone camera or Restrofe app.",
            },
            {
              num: "3",
              title: "Instant verification",
              desc: `Payments settle directly to ${account.upiId}. Visits log in your analytics instantly.`,
            },
          ].map((step) => (
            <View key={step.num} style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>{step.num}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },
  tableSelectorRow: {
    gap: 8,
    marginBottom: 20,
  },
  tableChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tableChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tableChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  tableChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  standeeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  standeeTop: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  brandText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  tablePill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tablePillText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  standeeRestaurantName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 8,
  },
  qrContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  qrGraphic: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#1C1C1E",
    borderRadius: 16,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  qrCorner: {
    position: "absolute",
    width: 38,
    height: 38,
    borderWidth: 3,
    borderColor: "#1C1C1E",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCornerInner: {
    width: 18,
    height: 18,
    backgroundColor: "#1C1C1E",
    borderRadius: 4,
  },
  qrCenterBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  qrGridDots: {
    position: "absolute",
    width: 160,
    height: 160,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  qrPixel: {
    width: 14,
    height: 14,
    backgroundColor: "#1C1C1E",
    borderRadius: 2,
    margin: 2,
  },
  scanInstruction: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 1.2,
    marginTop: 18,
  },
  payoutDetail: {
    fontSize: 11,
    color: COLORS.subtext,
    fontWeight: "600",
    marginTop: 4,
  },
  standeeBottom: {
    backgroundColor: "#FDF4EE",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  perkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  perkText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },
  perkDot: {
    color: COLORS.muted,
  },
  actionRow: {
    marginTop: 20,
    gap: 12,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  testQrBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  testQrText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  guideCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },
  stepDesc: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 2,
    lineHeight: 15,
  },
});
