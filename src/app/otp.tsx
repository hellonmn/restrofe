import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useCart } from "@/context/cart";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";

const LENGTH = 4;
const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useCart();

  const phone = String(Array.isArray(params.phone) ? params.phone[0] : params.phone ?? "");

  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  // resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = (value: string) => {
    if (value.length !== LENGTH || verifying) return;
    setVerifying(true);

    // DEMO: any 4-digit code is accepted.
    // Replace this with a real API call that verifies the OTP on your backend.
    setTimeout(() => {
      fire("success");
      login(phone);
      router.replace("/");
    }, 600);
  };

  const onChange = (t: string) => {
    const digits = t.replace(/\D/g, "").slice(0, LENGTH);
    if (digits.length > code.length) fire("select");
    setCode(digits);
    if (digits.length === LENGTH) verify(digits);
  };

  const resend = () => {
    if (seconds > 0) return;
    fire("success");
    setCode("");
    setSeconds(RESEND_SECONDS);
    inputRef.current?.focus();
  };

  const goBack = () => {
    fire("light");
    if (router.canGoBack()) router.back();
  };

  const pretty = phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : "your number";

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
            <Ionicons name="chatbubble-ellipses-outline" size={30} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.sub}>
            Enter the 4-digit code sent to{"\n"}
            <Text style={styles.phone}>{pretty}</Text>
          </Text>

          {/* boxes (tap anywhere to focus the hidden input) */}
          <Pressable onPress={() => inputRef.current?.focus()}>
            <Animated.View style={[styles.boxes, { transform: [{ translateX: shake }] }]}>
              {Array.from({ length: LENGTH }).map((_, i) => {
                const char = code[i] ?? "";
                const active = i === code.length && !verifying;
                return (
                  <View
                    key={i}
                    style={[
                      styles.box,
                      active && styles.boxActive,
                      !!char && styles.boxFilled,
                    ]}
                  >
                    <Text style={styles.boxText}>{char}</Text>
                  </View>
                );
              })}
            </Animated.View>
          </Pressable>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={onChange}
            keyboardType="number-pad"
            maxLength={LENGTH}
            autoFocus
            caretHidden
            style={styles.hiddenInput}
          />

          {verifying ? (
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
              <Text style={[styles.status, { color: COLORS.green }]}>Verifying…</Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              {seconds > 0 ? (
                <Text style={styles.status}>Resend code in 0:{String(seconds).padStart(2, "0")}</Text>
              ) : (
                <Pressable onPress={resend} hitSlop={10}>
                  <Text style={[styles.status, styles.resend]}>Resend OTP</Text>
                </Pressable>
              )}
            </View>
          )}

          <Text style={styles.demo}>Demo mode: enter any 4 digits to continue.</Text>
        </View>

        <View style={styles.footer}>
          <PressableScale
            haptic="none"
            scaleTo={0.98}
            onPress={() => {
              if (code.length === LENGTH) verify(code);
              else {
                fire("medium");
                Animated.sequence([
                  Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
                  Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
                  Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
                  Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
                ]).start();
              }
            }}
            style={[styles.btn, code.length === LENGTH ? SHADOW.lg : styles.btnOff]}
          >
            <Text style={styles.btnText}>Verify & continue</Text>
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
  sub: { fontSize: 14.5, color: COLORS.subtext, marginTop: 8, lineHeight: 22 },
  phone: { fontWeight: "800", color: COLORS.text },

  boxes: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  box: {
    width: "22%",
    aspectRatio: 1,
    maxHeight: 74,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.md,
  },
  boxActive: { borderColor: COLORS.primary },
  boxFilled: { backgroundColor: COLORS.primarySoft, borderColor: "#FFB596" },
  boxText: { fontSize: 28, fontWeight: "900", color: COLORS.text },

  hiddenInput: { position: "absolute", opacity: 0, height: 1, width: 1 },

  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 22 },
  status: { marginLeft: 6, fontSize: 14, fontWeight: "600", color: COLORS.subtext },
  resend: { color: COLORS.primary, fontWeight: "800", marginLeft: 0 },
  demo: { marginTop: 14, fontSize: 12, color: COLORS.muted },

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