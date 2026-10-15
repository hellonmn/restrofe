import React, { useState } from "react";
import {
  Alert,
  Image,
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
import { COLORS, PressableScale, SHADOW, VegBadge, fire } from "@/components/restro-ui";
import { useRestaurant } from "@/context/restaurant";
import { IMG, MenuItem } from "@/constants/catalog";

const PRESET_IMAGES = [
  { label: "Burger", uri: IMG.burger },
  { label: "Pizza", uri: IMG.pizza },
  { label: "Pasta", uri: IMG.pasta },
  { label: "Coffee", uri: IMG.coffee },
  { label: "Fries", uri: IMG.fries },
  { label: "Dessert", uri: IMG.dessert },
  { label: "Salad", uri: IMG.salad },
  { label: "Noodles", uri: IMG.noodles },
];

export default function PartnerMenuScreen() {
  const router = useRouter();
  const { menus, addMenuItem, updateMenuItem, deleteMenuItem } = useRestaurant();

  const categories = Object.keys(menus);
  const [selectedCat, setSelectedCat] = useState<string>(categories[0] || "Burgers");

  // Modal State for Add / Edit Dish
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formVeg, setFormVeg] = useState(true);
  const [formImg, setFormImg] = useState(IMG.burger);

  const currentItems = menus[selectedCat] || [];

  const openAddModal = () => {
    fire("light");
    setEditingId(null);
    setFormName("");
    setFormPrice("");
    setFormDesc("");
    setFormVeg(true);
    setFormImg(IMG.burger);
    setModalVisible(true);
  };

  const openEditModal = (item: MenuItem) => {
    fire("light");
    setEditingId(item.id);
    setFormName(item.name);
    setFormPrice(String(item.price));
    setFormDesc(item.desc);
    setFormVeg(item.veg);
    setFormImg(item.image || IMG.burger);
    setModalVisible(true);
  };

  const handleSaveDish = () => {
    if (!formName.trim() || !formPrice.trim()) {
      fire("medium");
      Alert.alert("Missing Fields", "Please enter dish name and price.");
      return;
    }

    const priceNum = parseInt(formPrice.replace(/\D/g, ""), 10) || 99;

    if (editingId) {
      updateMenuItem(selectedCat, editingId, {
        name: formName.trim(),
        price: priceNum,
        desc: formDesc.trim() || "Prepared fresh with signature ingredients.",
        veg: formVeg,
        image: formImg,
      });
      fire("success");
    } else {
      addMenuItem(selectedCat, {
        name: formName.trim(),
        price: priceNum,
        desc: formDesc.trim() || "Prepared fresh with signature ingredients.",
        veg: formVeg,
        image: formImg,
      });
      fire("success");
    }

    setModalVisible(false);
  };

  const handleDeleteDish = (id: string, name: string) => {
    fire("medium");
    Alert.alert("Delete Item", `Are you sure you want to remove "${name}" from your menu?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          fire("success");
          deleteMenuItem(selectedCat, id);
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
          <Text style={styles.headerTitle}>Menu & Dish Manager</Text>
          <Text style={styles.headerSub}>Updates reflect live on diner app</Text>
        </View>
        <PressableScale
          haptic="medium"
          style={styles.addDishTopBtn}
          onPress={openAddModal}
        >
          <PackIcon name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addDishTopText}>Add Dish</Text>
        </PressableScale>
      </View>

      {/* Category Horizontal Selector */}
      <View style={styles.catWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {categories.map((cat) => {
            const isSel = cat === selectedCat;
            const count = (menus[cat] || []).length;
            return (
              <PressableScale
                key={cat}
                haptic="select"
                style={[styles.catChip, isSel && styles.catChipActive]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text style={[styles.catChipText, isSel && styles.catChipTextActive]}>
                  {cat} ({count})
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      {/* Dish List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionTitle}>
            {selectedCat} Items ({currentItems.length})
          </Text>
          <Text style={styles.hintLive}>🟢 Synchronized with Diners</Text>
        </View>

        {currentItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <PackIcon name="utensils" size={48} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>No dishes in this category</Text>
            <Text style={styles.emptySub}>
              {'Tap "Add Dish" to list your first item for ' + selectedCat + '.'}
            </Text>
            <PressableScale
              haptic="medium"
              style={[styles.addFirstBtn, SHADOW.md]}
              onPress={openAddModal}
            >
              <Text style={styles.addFirstText}>Add Dish to {selectedCat}</Text>
            </PressableScale>
          </View>
        ) : (
          currentItems.map((item) => (
            <View key={item.id} style={[styles.dishCard, SHADOW.sm]}>
              <Image source={{ uri: item.image }} style={styles.dishImage} />

              <View style={styles.dishBody}>
                <View style={styles.dishRowTop}>
                  <VegBadge veg={item.veg} />
                  <Text style={styles.dishName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>

                <Text style={styles.dishDesc} numberOfLines={2}>
                  {item.desc}
                </Text>

                <View style={styles.dishBottomRow}>
                  <Text style={styles.dishPrice}>₹{item.price}</Text>

                  <View style={styles.actionsRow}>
                    <PressableScale
                      haptic="light"
                      style={styles.actionIconBtn}
                      onPress={() => openEditModal(item)}
                    >
                      <PackIcon name="edit" size={16} color={COLORS.primary} />
                    </PressableScale>

                    <PressableScale
                      haptic="medium"
                      style={[styles.actionIconBtn, { marginLeft: 8 }]}
                      onPress={() => handleDeleteDish(item.id, item.name)}
                    >
                      <PackIcon name="trash" size={16} color={COLORS.red} />
                    </PressableScale>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add / Edit Dish Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Dish" : `Add Dish to ${selectedCat}`}
              </Text>
              <PressableScale
                haptic="light"
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <PackIcon name="cross" size={20} color={COLORS.text} />
              </PressableScale>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Dish Name */}
              <Text style={styles.fieldLabel}>Dish Name *</Text>
              <TextInput
                value={formName}
                onChangeText={setFormName}
                placeholder="e.g. Crispy Paneer Burger"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
              />

              {/* Price */}
              <Text style={styles.fieldLabel}>Price (₹) *</Text>
              <TextInput
                value={formPrice}
                onChangeText={setFormPrice}
                placeholder="e.g. 179"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                style={styles.input}
              />

              {/* Description */}
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                value={formDesc}
                onChangeText={setFormDesc}
                placeholder="Short tasty description..."
                placeholderTextColor={COLORS.muted}
                multiline
                numberOfLines={3}
                style={[styles.input, { height: 70, textAlignVertical: "top" }]}
              />

              {/* Veg Toggle */}
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchTitle}>Pure Veg Item</Text>
                  <Text style={styles.switchSub}>
                    {formVeg ? "Marked as Pure Veg (Green badge)" : "Non-Veg (Red badge)"}
                  </Text>
                </View>
                <Switch
                  value={formVeg}
                  onValueChange={setFormVeg}
                  trackColor={{ false: "#E2374433", true: COLORS.greenSoft }}
                  thumbColor={formVeg ? COLORS.green : COLORS.red}
                />
              </View>

              {/* Preset Image Selection */}
              <Text style={styles.fieldLabel}>Select Photo Preset</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                {PRESET_IMAGES.map((preset) => {
                  const isImgSel = formImg === preset.uri;
                  return (
                    <PressableScale
                      key={preset.label}
                      haptic="select"
                      style={[styles.presetImgWrap, isImgSel && styles.presetImgActive]}
                      onPress={() => setFormImg(preset.uri)}
                    >
                      <Image source={{ uri: preset.uri }} style={styles.presetImg} />
                      <Text style={[styles.presetLabel, isImgSel && styles.presetLabelActive]}>
                        {preset.label}
                      </Text>
                    </PressableScale>
                  );
                })}
              </ScrollView>

              <PressableScale
                haptic="success"
                style={[styles.saveModalBtn, SHADOW.lg]}
                onPress={handleSaveDish}
              >
                <Text style={styles.saveModalBtnText}>
                  {editingId ? "Update Dish" : "Publish Dish to App"}
                </Text>
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
    color: COLORS.green,
    fontWeight: "700",
  },
  addDishTopBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addDishTopText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  catWrap: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  catScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  catChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  hintLive: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.green,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.subtext,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
  },
  addFirstBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 18,
  },
  addFirstText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  dishCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F0ECE6",
  },
  dishBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  dishRowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dishName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  dishDesc: {
    fontSize: 11,
    color: COLORS.subtext,
    lineHeight: 15,
    marginVertical: 4,
  },
  dishBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.primary,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F5EFE9",
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
  presetImgWrap: {
    alignItems: "center",
    marginRight: 10,
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  presetImgActive: {
    borderColor: COLORS.primary,
  },
  presetImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.subtext,
    marginTop: 4,
  },
  presetLabelActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  saveModalBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveModalBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
