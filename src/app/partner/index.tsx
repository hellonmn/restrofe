import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PackIcon } from "@/components/pack-icon";
import { COLORS, PressableScale, SHADOW, fire } from "@/components/restro-ui";
import { useRestaurant } from "@/context/restaurant";

export default function PartnerDashboard() {
  const router = useRouter();
  const {
    activeRestaurant,
    toggleStoreStatus,
    visits,
    reviews,
    offers,
    account,
  } = useRestaurant();

  const isOpen = activeRestaurant.isOpen ?? true;

  const totalQrRevenue = visits.reduce((sum, v) => sum + v.amount, 0);
  const activeOffersCount = offers.filter((o) => o.active).length;

  const handleToggleStatus = (val: boolean) => {
    fire("select");
    toggleStoreStatus(val);
  };

  const navTo = (path: string) => {
    fire("light");
    router.push(path as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.partnerBadge}>
            <PackIcon name="restaurant" size={14} color={COLORS.primary} />
            <Text style={styles.partnerBadgeText}>RESTROFE PARTNER</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {activeRestaurant.name}
          </Text>
        </View>

        <PressableScale
          haptic="medium"
          style={styles.switchModeBtn}
          onPress={() => router.replace("/(tabs)" as any)}
        >
          <PackIcon name="exit" size={16} color={COLORS.primary} />
          <Text style={styles.switchModeText}>Diner App</Text>
        </PressableScale>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Restaurant Status Card */}
        <View style={[styles.statusCard, SHADOW.md]}>
          <Image
            source={{ uri: activeRestaurant.image }}
            style={styles.restaurantHero}
          />
          <View style={styles.statusContent}>
            <View style={styles.statusTopRow}>
              <View>
                <View style={styles.liveTagRow}>
                  <View
                    style={[
                      styles.liveDot,
                      { backgroundColor: isOpen ? COLORS.green : COLORS.red },
                    ]}
                  />
                  <Text
                    style={[
                      styles.liveTagText,
                      { color: isOpen ? COLORS.green : COLORS.red },
                    ]}
                  >
                    {isOpen ? "LIVE • OPEN FOR DINERS" : "STORE OFFLINE"}
                  </Text>
                </View>
                <Text style={styles.statusSub}>
                  {isOpen
                    ? "Accepting Table QR payments & orders"
                    : "Turn on to show as Open in Diner App"}
                </Text>
              </View>

              <Switch
                value={isOpen}
                onValueChange={handleToggleStatus}
                trackColor={{ false: "#D1D1D6", true: COLORS.greenSoft }}
                thumbColor={isOpen ? COLORS.green : "#f4f3f4"}
              />
            </View>

            <View style={styles.restaurantMetaRow}>
              <View style={styles.metaItem}>
                <PackIcon name="star" size={14} color={COLORS.star} />
                <Text style={styles.metaText}>{activeRestaurant.rating} ({activeRestaurant.reviews})</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{activeRestaurant.price}</Text>
              <Text style={styles.metaDot}>•</Text>
              <PressableScale
                haptic="light"
                onPress={() =>
                  router.push({
                    pathname: "/restaurant/[id]",
                    params: { id: activeRestaurant.id },
                  } as any)
                }
              >
                <Text style={styles.previewLinkText}>View Diner Page →</Text>
              </PressableScale>
            </View>
          </View>
        </View>

        {/* Analytics Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, SHADOW.sm]}>
            <View style={[styles.metricIconWrap, { backgroundColor: COLORS.primarySoft }]}>
              <PackIcon name="marker" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.metricValue}>{visits.length}</Text>
            <Text style={styles.metricLabel}>{"Today's Visits"}</Text>
          </View>

          <View style={[styles.metricCard, SHADOW.sm]}>
            <View style={[styles.metricIconWrap, { backgroundColor: COLORS.greenSoft }]}>
              <PackIcon name="card" size={18} color={COLORS.green} />
            </View>
            <Text style={styles.metricValue}>₹{totalQrRevenue}</Text>
            <Text style={styles.metricLabel}>QR Revenue</Text>
          </View>

          <View style={[styles.metricCard, SHADOW.sm]}>
            <View style={[styles.metricIconWrap, { backgroundColor: "#FFF4E5" }]}>
              <PackIcon name="star" size={18} color="#FF9900" />
            </View>
            <Text style={styles.metricValue}>{activeRestaurant.rating}</Text>
            <Text style={styles.metricLabel}>Avg. Rating</Text>
          </View>

          <View style={[styles.metricCard, SHADOW.sm]}>
            <View style={[styles.metricIconWrap, { backgroundColor: "#EEF1FF" }]}>
              <PackIcon name="ticket" size={18} color="#5B6CF0" />
            </View>
            <Text style={styles.metricValue}>{activeOffersCount}</Text>
            <Text style={styles.metricLabel}>Active Offers</Text>
          </View>
        </View>

        {/* Subscription Notice Pill (Pitch Deck Slide 10) */}
        <View style={styles.subscriptionBanner}>
          <View style={styles.subBannerLeft}>
            <Text style={styles.subBannerTitle}>
              🎉 {account.subscriptionTier} ({account.trialDaysLeft} days left)
            </Text>
            <Text style={styles.subBannerSub}>
              Zero commission on table QR payments during your free month!
            </Text>
          </View>
          <PressableScale
            haptic="select"
            style={styles.subManageBtn}
            onPress={() => navTo("/partner/account")}
          >
            <Text style={styles.subManageText}>Manage</Text>
          </PressableScale>
        </View>

        {/* Admin Modules Grid */}
        <Text style={styles.sectionTitle}>Restaurant Tools</Text>

        <View style={styles.toolsGrid}>
          {/* Tool 1: Menu Management */}
          <PressableScale
            haptic="light"
            style={[styles.toolCard, SHADOW.sm]}
            onPress={() => navTo("/partner/menu")}
          >
            <View style={[styles.toolIcon, { backgroundColor: "#FFF2EC" }]}>
              <PackIcon name="utensils" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.toolTitle}>Manage Menu</Text>
            <Text style={styles.toolDesc}>
              Add dishes, edit prices, set veg/non-veg & stock status
            </Text>
            <View style={styles.toolActionRow}>
              <Text style={styles.toolActionText}>Open Catalog</Text>
              <PackIcon name="chevron-forward" size={14} color={COLORS.primary} />
            </View>
          </PressableScale>

          {/* Tool 2: Offers & Promotions */}
          <PressableScale
            haptic="light"
            style={[styles.toolCard, SHADOW.sm]}
            onPress={() => navTo("/partner/offers")}
          >
            <View style={[styles.toolIcon, { backgroundColor: "#EBF9F3" }]}>
              <PackIcon name="ticket" size={24} color={COLORS.green} />
            </View>
            <Text style={styles.toolTitle}>Create Offers</Text>
            <Text style={styles.toolDesc}>
              Publish 30%+20% discounts, bill deals & Friday specials
            </Text>
            <View style={styles.toolActionRow}>
              <Text style={[styles.toolActionText, { color: COLORS.green }]}>
                {activeOffersCount} Active
              </Text>
              <PackIcon name="chevron-forward" size={14} color={COLORS.green} />
            </View>
          </PressableScale>

          {/* Tool 3: QR Code & Dine-in */}
          <PressableScale
            haptic="light"
            style={[styles.toolCard, SHADOW.sm]}
            onPress={() => navTo("/partner/qr-code")}
          >
            <View style={[styles.toolIcon, { backgroundColor: "#F3F0FF" }]}>
              <PackIcon name="flash" size={24} color="#7952DE" />
            </View>
            <Text style={styles.toolTitle}>Table QR Code</Text>
            <Text style={styles.toolDesc}>
              Generate & print table QR standees for customer Scan & Pay
            </Text>
            <View style={styles.toolActionRow}>
              <Text style={[styles.toolActionText, { color: "#7952DE" }]}>View QR</Text>
              <PackIcon name="chevron-forward" size={14} color="#7952DE" />
            </View>
          </PressableScale>

          {/* Tool 4: Analytics & Reviews */}
          <PressableScale
            haptic="light"
            style={[styles.toolCard, SHADOW.sm]}
            onPress={() => navTo("/partner/analytics")}
          >
            <View style={[styles.toolIcon, { backgroundColor: "#FFF9E6" }]}>
              <PackIcon name="receipt" size={24} color="#D97706" />
            </View>
            <Text style={styles.toolTitle}>Visits & Reviews</Text>
            <Text style={styles.toolDesc}>
              Recorded visits, diner feedback & manager response
            </Text>
            <View style={styles.toolActionRow}>
              <Text style={[styles.toolActionText, { color: "#D97706" }]}>
                {reviews.length} Reviews
              </Text>
              <PackIcon name="chevron-forward" size={14} color="#D97706" />
            </View>
          </PressableScale>

          {/* Tool 5: Edit Restaurant Listing */}
          <PressableScale
            haptic="light"
            style={[styles.toolCard, SHADOW.sm]}
            onPress={() => navTo("/partner/list-restaurant")}
          >
            <View style={[styles.toolIcon, { backgroundColor: "#E6F4FE" }]}>
              <PackIcon name="edit" size={24} color="#0284C7" />
            </View>
            <Text style={styles.toolTitle}>Listing Profile</Text>
            <Text style={styles.toolDesc}>
              Update photos, address, cuisines & timings
            </Text>
            <View style={styles.toolActionRow}>
              <Text style={[styles.toolActionText, { color: "#0284C7" }]}>Edit Info</Text>
              <PackIcon name="chevron-forward" size={14} color="#0284C7" />
            </View>
          </PressableScale>

          {/* Tool 6: Account & Payout System */}
          <PressableScale
            haptic="light"
            style={[styles.toolCard, SHADOW.sm]}
            onPress={() => navTo("/partner/account")}
          >
            <View style={[styles.toolIcon, { backgroundColor: "#FCE7F3" }]}>
              <PackIcon name="wallet" size={24} color="#BE185D" />
            </View>
            <Text style={styles.toolTitle}>Account & Payout</Text>
            <Text style={styles.toolDesc}>
              Bank details, UPI ID, FSSAI & Subscription plan
            </Text>
            <View style={styles.toolActionRow}>
              <Text style={[styles.toolActionText, { color: "#BE185D" }]}>Settings</Text>
              <PackIcon name="chevron-forward" size={14} color="#BE185D" />
            </View>
          </PressableScale>
        </View>

        {/* Recent Visit & Payment Records */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent In-Restaurant Visits</Text>
          <PressableScale
            haptic="select"
            onPress={() => navTo("/partner/analytics")}
          >
            <Text style={styles.seeAllText}>See all →</Text>
          </PressableScale>
        </View>

        <View style={[styles.recentVisitsCard, SHADOW.sm]}>
          {visits.slice(0, 3).map((v, index) => {
            const visitTime = new Date(v.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <View
                key={v.id}
                style={[
                  styles.visitRow,
                  index < 2 && styles.visitRowBorder,
                ]}
              >
                <View style={styles.visitTablePill}>
                  <Text style={styles.visitTableText}>{v.tableNumber || "QR"}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.visitName}>{v.customerName}</Text>
                  <Text style={styles.visitSub}>
                    {v.method} • {visitTime}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.visitAmount}>₹{v.amount}</Text>
                  <View style={styles.statusVerifiedPill}>
                    <Text style={styles.statusVerifiedText}>{v.status}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Customer Reviews Preview */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Customer Feedback</Text>
          <PressableScale
            haptic="select"
            onPress={() => navTo("/partner/analytics")}
          >
            <Text style={styles.seeAllText}>Respond ({reviews.length}) →</Text>
          </PressableScale>
        </View>

        {reviews.length > 0 && (
          <View style={[styles.reviewPreviewCard, SHADOW.sm]}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewUser}>{reviews[0].customerName}</Text>
                <Text style={styles.reviewDate}>{reviews[0].date}</Text>
              </View>
              <View style={styles.reviewRatingPill}>
                <Text style={styles.reviewRatingText}>{reviews[0].rating}</Text>
                <PackIcon name="star" size={11} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.reviewBody}>{reviews[0].text}</Text>
            {reviews[0].reply ? (
              <View style={styles.reviewReplyWrap}>
                <Text style={styles.reviewReplyTitle}>Your Reply:</Text>
                <Text style={styles.reviewReplyText}>{reviews[0].reply}</Text>
              </View>
            ) : (
              <PressableScale
                haptic="light"
                style={styles.replyCta}
                onPress={() => navTo("/partner/analytics")}
              >
                <PackIcon name="chat" size={14} color={COLORS.primary} />
                <Text style={styles.replyCtaText}>Write a reply to customer</Text>
              </PressableScale>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: { flex: 1 },
  partnerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  partnerBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  switchModeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  switchModeText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  restaurantHero: {
    width: "100%",
    height: 120,
    backgroundColor: "#F0ECE6",
  },
  statusContent: {
    padding: 16,
  },
  statusTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveTagText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  statusSub: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 2,
  },
  restaurantMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5EFE9",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  metaDot: {
    marginHorizontal: 8,
    color: COLORS.muted,
  },
  previewLinkText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
    marginTop: 2,
  },
  subscriptionBanner: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  subBannerLeft: { flex: 1, marginRight: 10 },
  subBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subBannerSub: {
    fontSize: 11,
    color: "#B4B4BB",
    marginTop: 2,
  },
  subManageBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  subManageText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 22,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  toolCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  toolDesc: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 4,
    lineHeight: 15,
  },
  toolActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5EFE9",
  },
  toolActionText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
  },
  recentVisitsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  visitRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5EFE9",
  },
  visitTablePill: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  visitTableText: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.primary,
  },
  visitName: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  visitSub: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 2,
  },
  visitAmount: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
  },
  statusVerifiedPill: {
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  statusVerifiedText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.green,
  },
  reviewPreviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.muted,
  },
  reviewRatingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  reviewRatingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  reviewBody: {
    fontSize: 13,
    color: COLORS.subtext,
    lineHeight: 18,
    marginTop: 8,
  },
  reviewReplyWrap: {
    backgroundColor: "#F7F5F2",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  reviewReplyTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },
  reviewReplyText: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 2,
  },
  replyCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5EFE9",
  },
  replyCtaText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },
});
