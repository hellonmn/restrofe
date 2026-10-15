import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PackIcon } from "@/components/pack-icon";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";
import { useRestaurant } from "@/context/restaurant";

export default function PartnerAccountScreen() {
  const router = useRouter();
  const { account, updateAccount, activeRestaurant } = useRestaurant();

  const [ownerName, setOwnerName] = useState(account.ownerName);
  const [email, setEmail] = useState(account.email);
  const [phone, setPhone] = useState(account.phone);
  const [bankName, setBankName] = useState(account.bankName);
  const [accountNumber, setAccountNumber] = useState(account.accountNumber);
  const [ifscCode, setIfscCode] = useState(account.ifscCode);
  const [upiId, setUpiId] = useState(account.upiId);
  const [fssai, setFssai] = useState(account.fssaiNumber);
  const [gstin, setGstin] = useState(account.gstin);

  const handleSave = () => {
    fire("success");
    updateAccount({
      ownerName: ownerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim(),
      upiId: upiId.trim(),
      fssaiNumber: fssai.trim(),
      gstin: gstin.trim(),
    });

    Alert.alert(
      "Account Saved! ✅",
      "Your restaurant business and payout details have been updated."
    );
  };

  const handleUpgradePlan = () => {
    fire("medium");
    Alert.alert(
      "Restrofe Pro Plan 🚀",
      "You are currently enjoying your First Month Free Trial with 24 days remaining! Unlimited QR settlements and partner tools are active.",
      [{ text: "Great!" }]
    );
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
          <Text style={styles.headerTitle}>Account & Settlements</Text>
          <Text style={styles.headerSub}>
            Financial accounts, subscription & business details
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subscription Plan Card (Pitch Deck Slide 10) */}
        <View style={[styles.subscriptionCard, SHADOW.md]}>
          <View style={styles.subTopRow}>
            <View>
              <View style={styles.planBadge}>
                <PackIcon name="star" size={12} color="#FFFFFF" />
                <Text style={styles.planBadgeText}>
                  {account.subscriptionTier.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.planTitle}>
                {activeRestaurant.name}
              </Text>
            </View>
            <View style={styles.daysBadge}>
              <Text style={styles.daysVal}>{account.trialDaysLeft}</Text>
              <Text style={styles.daysUnit}>days left</Text>
            </View>
          </View>

          <View style={styles.planDivider} />

          <Text style={styles.planFeaturesHeader}>Included in Your Tier:</Text>
          <View style={styles.featuresList}>
            {[
              "Zero commission on Table QR Code payments",
              "Real-time menu and price catalog synchronization",
              "Unlimited custom promotions & stacked discount creator",
              "Verified customer feedback & owner response tool",
              "Daily auto-settlement to your bank / UPI ID",
            ].map((f, idx) => (
              <View key={idx} style={styles.featureRow}>
                <PackIcon name="check" size={14} color={COLORS.green} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <PressableScale
            haptic="medium"
            style={styles.upgradeBtn}
            onPress={handleUpgradePlan}
          >
            <Text style={styles.upgradeBtnText}>Manage Subscription</Text>
          </PressableScale>
        </View>

        {/* QR Payout & Bank Account */}
        <Text style={styles.sectionTitle}>Direct QR Payout Settings</Text>

        <View style={[styles.formCard, SHADOW.sm]}>
          <Text style={styles.fieldLabel}>Instant Settlement UPI ID *</Text>
          <TextInput
            value={upiId}
            onChangeText={setUpiId}
            placeholder="e.g. restaurant@okhdfcbank"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
          <Text style={styles.fieldHint}>
            Table QR payments made by customers settle directly to this VPA.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>Bank Name</Text>
          <TextInput
            value={bankName}
            onChangeText={setBankName}
            placeholder="e.g. HDFC Bank Ltd"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Account Number</Text>
              <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="502000..."
                placeholderTextColor={COLORS.muted}
                secureTextEntry={false}
                style={styles.input}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>IFSC Code</Text>
              <TextInput
                value={ifscCode}
                onChangeText={(t) => setIfscCode(t.toUpperCase())}
                placeholder="HDFC0001234"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="characters"
                style={styles.input}
              />
            </View>
          </View>
        </View>

        {/* Business & Legal Information */}
        <Text style={styles.sectionTitle}>Business & Tax Info</Text>

        <View style={[styles.formCard, SHADOW.sm]}>
          <Text style={styles.fieldLabel}>Owner / Manager Name</Text>
          <TextInput
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Authorized contact"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Business Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="partner@outlet.in"
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Official Phone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+91..."
                placeholderTextColor={COLORS.muted}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>FSSAI License Number</Text>
          <TextInput
            value={fssai}
            onChangeText={setFssai}
            placeholder="14-digit FSSAI"
            placeholderTextColor={COLORS.muted}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>GSTIN (Optional)</Text>
          <TextInput
            value={gstin}
            onChangeText={(t) => setGstin(t.toUpperCase())}
            placeholder="08AABCT..."
            placeholderTextColor={COLORS.muted}
            autoCapitalize="characters"
            style={styles.input}
          />
        </View>

        {/* Save CTA */}
        <PressableScale
          haptic="success"
          style={[styles.saveBtn, SHADOW.lg]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Save Account Changes</Text>
        </PressableScale>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  subscriptionCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  subTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    alignSelf: "flex-start",
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 8,
  },
  daysBadge: {
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  daysVal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  daysUnit: {
    fontSize: 10,
    color: "#B4B4BB",
    fontWeight: "600",
  },
  planDivider: {
    height: 1,
    backgroundColor: "#3A3A3C",
    marginVertical: 14,
  },
  planFeaturesHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#E5E5EA",
    marginBottom: 8,
  },
  featuresList: {
    gap: 6,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#B4B4BB",
    fontWeight: "500",
  },
  upgradeBtn: {
    backgroundColor: "#2C2C2E",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  upgradeBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 6,
  },
  fieldHint: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 4,
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
  twoCol: {
    flexDirection: "row",
  },
  divider: {
    height: 1,
    backgroundColor: "#F5EFE9",
    marginVertical: 14,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
