import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const valid = /^[6-9]\d{9}$/.test(phone);

  const onChange = (t: string) => {
    setPhone(t.replace(/\D/g, "").slice(0, 10));
    if (error) setError("");
  };

  const sendOtp = () => {
    if (!valid) {
      fire("medium");
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    fire("success");
    router.push({ pathname: "/otp", params: { phone } } as any);
  };

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <PressableScale haptic="none" scaleTo={0.9} onPress={goBack} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </PressableScale>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.body}>
          <View style={styles.iconBubble}>
            <Ionicons name="phone-portrait-outline" size={30} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>What's your number?</Text>
          <Text style={styles.sub}>
            We'll send you a 4-digit OTP to verify your mobile number.
          </Text>

          <View
            style={[
              styles.inputRow,
              focused && styles.inputRowFocused,
              !!error && styles.inputRowError,
            ]}
          >
            <Text style={styles.flag}>🇮🇳</Text>
            <Text style={styles.code}>+91</Text>
            <View style={styles.sep} />
            <TextInput
              value={phone}
              onChangeText={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Mobile number"
              placeholderTextColor={COLORS.muted}
              keyboardType="number-pad"
              maxLength={10}
              autoFocus
              style={styles.input}
              onSubmitEditing={sendOtp}
            />
            {valid && <Ionicons name="checkmark-circle" size={22} color={COLORS.green} />}
          </View>

          {!!error && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={15} color={COLORS.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <PressableScale
            haptic="none"
            scaleTo={0.98}
            onPress={sendOtp}
            style={[styles.btn, valid ? SHADOW.lg : styles.btnOff]}
          >
            <Text style={styles.btnText}>Send OTP</Text>
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  header: { paddingHorizontal: 20, paddingTop: 8 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },

  body: { flex: 1, paddingHorizontal: 24, paddingTop: 30 },
  iconBubble: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.8,
    marginTop: 22,
  },
  sub: { fontSize: 14.5, color: COLORS.subtext, marginTop: 8, lineHeight: 21 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    marginTop: 28,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  inputRowFocused: { borderColor: COLORS.primary },
  inputRowError: { borderColor: COLORS.red },
  flag: { fontSize: 20 },
  code: { marginLeft: 8, fontSize: 16, fontWeight: "800", color: COLORS.text },
  sep: { width: 1, height: 24, backgroundColor: COLORS.border, marginHorizontal: 12 },
  input: { flex: 1, fontSize: 18, fontWeight: "700", color: COLORS.text, letterSpacing: 1 },

  errorRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  errorText: { marginLeft: 6, fontSize: 13, color: COLORS.red, fontWeight: "600" },

  footer: { paddingHorizontal: 20, paddingBottom: 18, paddingTop: 10 },
  btn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOff: { backgroundColor: "#FFB596" },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
});
