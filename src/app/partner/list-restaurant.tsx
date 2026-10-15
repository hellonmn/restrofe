import React, { useState } from "react";
import {
  Alert,
  Image,
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
import { useRestaurant } from "@/context/restaurant";
import { IMG, Restaurant } from "@/constants/catalog";

const ALL_CUISINES = [
  "Burgers",
  "Pizza",
  "Café",
  "Italian",
  "Pasta",
  "Desserts",
  "Chinese",
  "Healthy",
  "Fast Food",
  "Beverages",
  "Salads",
  "Bakery",
];

const COVER_PRESETS = [
  { label: "Burger Joint", uri: IMG.burger },
  { label: "Pizzeria", uri: IMG.pizza },
  { label: "Bistro & Pasta", uri: IMG.pasta },
  { label: "Specialty Café", uri: IMG.coffee },
  { label: "Asian & Wok", uri: IMG.noodles },
  { label: "Salads & Bowls", uri: IMG.salad },
  { label: "Bakery & Sweets", uri: IMG.dessert },
];

export default function ListRestaurantScreen() {
  const router = useRouter();
  const { activeRestaurant, updateActiveRestaurant, listNewRestaurant } = useRestaurant();

  const [mode, setMode] = useState<"edit" | "new">("edit");

  // Form Fields
  const [name, setName] = useState(activeRestaurant.name);
  const [tagline, setTagline] = useState(activeRestaurant.cuisines.join(", "));
  const [price, setPrice] = useState(activeRestaurant.price || "₹300 for two");
  const [mins, setMins] = useState(String(activeRestaurant.mins || 25));
  const [vegOnly, setVegOnly] = useState(activeRestaurant.veg);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    activeRestaurant.cuisines || ["Burgers"]
  );
  const [address, setAddress] = useState(
    activeRestaurant.address || "MI Road, Jaipur, Rajasthan"
  );
  const [phone, setPhone] = useState(activeRestaurant.phone || "+91 98765 43210");
  const [tablesCount, setTablesCount] = useState(
    String(activeRestaurant.tablesCount || 10)
  );
  const [coverUri, setCoverUri] = useState(activeRestaurant.image || IMG.burger);

  const toggleCuisine = (c: string) => {
    fire("select");
    if (selectedCuisines.includes(c)) {
      if (selectedCuisines.length > 1) {
        setSelectedCuisines((prev) => prev.filter((item) => item !== c));
      }
    } else {
      setSelectedCuisines((prev) => [...prev, c]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      fire("medium");
      Alert.alert("Missing Name", "Please enter a restaurant name.");
      return;
    }

    const minsNum = parseInt(mins.replace(/\D/g, ""), 10) || 20;
    const tablesNum = parseInt(tablesCount.replace(/\D/g, ""), 10) || 10;

    if (mode === "edit") {
      updateActiveRestaurant({
        name: name.trim(),
        tagline: tagline.trim(),
        price: price.trim(),
        mins: minsNum,
        veg: vegOnly,
        cuisines: selectedCuisines,
        address: address.trim(),
        phone: phone.trim(),
        tablesCount: tablesNum,
        image: coverUri,
      });
      fire("success");
      Alert.alert(
        "Listing Updated! 🌟",
        "Your restaurant changes have been saved and are immediately visible to all diners on the Home and Search tabs.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } else {
      const newRest: Restaurant = {
        id: `r-${Date.now()}`,
        name: name.trim(),
        tagline: tagline.trim(),
        image: coverUri,
        mins: minsNum,
        rating: 4.8,
        reviews: "1",
        price: price.trim(),
        distance: "1.0 km",
        cuisines: selectedCuisines,
        offer: "Welcome 20% OFF",
        veg: vegOnly,
        address: address.trim(),
        phone: phone.trim(),
        tablesCount: tablesNum,
        isOpen: true,
      };

      listNewRestaurant(newRest);
      fire("success");
      Alert.alert(
        "Restaurant Listed! 🚀",
        `Congratulations! "${name}" is now live on Restrofe for diners to discover, view menus, and scan to pay.`,
        [{ text: "Go to Dashboard", onPress: () => router.replace("/partner" as any) }]
      );
    }
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
          <Text style={styles.headerTitle}>
            {mode === "edit" ? "Edit Restaurant Profile" : "List New Restaurant"}
          </Text>
          <Text style={styles.headerSub}>
            Appears live on Restrofe customer search & home
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mode Switcher */}
        <View style={styles.modeTabs}>
          <PressableScale
            haptic="select"
            style={[styles.modeTab, mode === "edit" && styles.modeTabActive]}
            onPress={() => setMode("edit")}
          >
            <Text style={[styles.modeTabText, mode === "edit" && styles.modeTabTextActive]}>
              Edit Current ({activeRestaurant.name})
            </Text>
          </PressableScale>

          <PressableScale
            haptic="select"
            style={[styles.modeTab, mode === "new" && styles.modeTabActive]}
            onPress={() => {
              setMode("new");
              setName("");
              setPrice("₹300 for two");
            }}
          >
            <Text style={[styles.modeTabText, mode === "new" && styles.modeTabTextActive]}>
              + List New Outlet
            </Text>
          </PressableScale>
        </View>

        {/* Cover Photo Preview */}
        <Text style={styles.fieldLabel}>Restaurant Cover Photo</Text>
        <View style={styles.coverPreviewCard}>
          <Image source={{ uri: coverUri }} style={styles.coverImg} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
          {COVER_PRESETS.map((p) => {
            const isSel = coverUri === p.uri;
            return (
              <PressableScale
                key={p.label}
                haptic="select"
                style={[styles.presetCard, isSel && styles.presetCardActive]}
                onPress={() => setCoverUri(p.uri)}
              >
                <Image source={{ uri: p.uri }} style={styles.presetThumb} />
                <Text style={[styles.presetText, isSel && styles.presetTextActive]}>
                  {p.label}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>

        {/* Name */}
        <Text style={styles.fieldLabel}>Restaurant Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. The Italian Terrace"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        {/* Tagline */}
        <Text style={styles.fieldLabel}>Tagline / Short Pitch</Text>
        <TextInput
          value={tagline}
          onChangeText={setTagline}
          placeholder="e.g. Authentic Wood-Fired Pizzas & Artisanal Pastas"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        {/* Cost For Two & Timing */}
        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Cost for Two</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. ₹350 for two"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
          </View>
          <View style={{ width: 14 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Prep Time (Mins)</Text>
            <TextInput
              value={mins}
              onChangeText={setMins}
              placeholder="e.g. 25"
              placeholderTextColor={COLORS.muted}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        {/* Pure Veg Switch */}
        <View style={styles.switchBox}>
          <View>
            <Text style={styles.switchTitle}>Pure Veg Restaurant</Text>
            <Text style={styles.switchSub}>Display green Pure Veg badge on listings</Text>
          </View>
          <Switch
            value={vegOnly}
            onValueChange={setVegOnly}
            trackColor={{ false: "#D1D1D6", true: COLORS.greenSoft }}
            thumbColor={vegOnly ? COLORS.green : "#f4f3f4"}
          />
        </View>

        {/* Cuisines */}
        <Text style={styles.fieldLabel}>Cuisine Categories</Text>
        <View style={styles.cuisinesGrid}>
          {ALL_CUISINES.map((c) => {
            const on = selectedCuisines.includes(c);
            return (
              <PressableScale
                key={c}
                haptic="select"
                style={[styles.cuisineChip, on && styles.cuisineChipActive]}
                onPress={() => toggleCuisine(c)}
              >
                <Text style={[styles.cuisineText, on && styles.cuisineTextActive]}>
                  {c} {on ? "✓" : "+"}
                </Text>
              </PressableScale>
            );
          })}
        </View>

        {/* Location & Contact */}
        <Text style={styles.fieldLabel}>Physical Store Address *</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Area, Street, City"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Support Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+91..."
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
          </View>
          <View style={{ width: 14 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Dining Tables</Text>
            <TextInput
              value={tablesCount}
              onChangeText={setTablesCount}
              placeholder="e.g. 12"
              placeholderTextColor={COLORS.muted}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        {/* Save Button */}
        <PressableScale
          haptic="success"
          style={[styles.saveBtn, SHADOW.lg]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>
            {mode === "edit" ? "Save & Update Live Listing" : "Publish Restaurant to Diners"}
          </Text>
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
    color: COLORS.green,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  modeTabs: {
    flexDirection: "row",
    backgroundColor: "#F0ECE6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  modeTabActive: {
    backgroundColor: COLORS.card,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  modeTabTextActive: {
    color: COLORS.primary,
    fontWeight: "900",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 14,
    marginBottom: 6,
  },
  coverPreviewCard: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F0ECE6",
  },
  coverImg: {
    width: "100%",
    height: "100%",
  },
  presetCard: {
    alignItems: "center",
    marginRight: 10,
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  presetCardActive: {
    borderColor: COLORS.primary,
  },
  presetThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  presetText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.subtext,
    marginTop: 4,
  },
  presetTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  input: {
    backgroundColor: COLORS.card,
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
    alignItems: "center",
  },
  switchBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 16,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  switchSub: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 2,
  },
  cuisinesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cuisineChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cuisineChipActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  cuisineText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  cuisineTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
