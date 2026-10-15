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

export default function PartnerAnalyticsScreen() {
  const router = useRouter();
  const { visits, reviews, replyReview, activeRestaurant } = useRestaurant();

  const [activeTab, setActiveTab] = useState<"visits" | "reviews">("visits");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const totalRevenue = visits.reduce((sum, v) => sum + v.amount, 0);
  const avgTicket = visits.length ? Math.round(totalRevenue / visits.length) : 0;

  const handleSendReply = (reviewId: string) => {
    const text = (replyInputs[reviewId] || "").trim();
    if (!text) {
      fire("medium");
      Alert.alert("Empty Reply", "Please type your reply message.");
      return;
    }

    fire("success");
    replyReview(reviewId, text);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
    Alert.alert("Reply Sent! 💬", "Your reply is now published under this review.");
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
          <Text style={styles.headerTitle}>Visits & Analytics</Text>
          <Text style={styles.headerSub}>
            Customer records, QR payments & diner feedback
          </Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <PressableScale
          haptic="select"
          style={[styles.tabItem, activeTab === "visits" && styles.tabItemActive]}
          onPress={() => setActiveTab("visits")}
        >
          <Text style={[styles.tabText, activeTab === "visits" && styles.tabTextActive]}>
            Visits & QR Payments ({visits.length})
          </Text>
        </PressableScale>

        <PressableScale
          haptic="select"
          style={[styles.tabItem, activeTab === "reviews" && styles.tabItemActive]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text style={[styles.tabText, activeTab === "reviews" && styles.tabTextActive]}>
            Reviews & Ratings ({reviews.length})
          </Text>
        </PressableScale>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "visits" ? (
          <>
            {/* Quick KPI stats */}
            <View style={styles.statsRow}>
              <View style={[styles.kpiCard, SHADOW.sm]}>
                <Text style={styles.kpiVal}>₹{totalRevenue}</Text>
                <Text style={styles.kpiLabel}>Settled QR Volume</Text>
              </View>

              <View style={[styles.kpiCard, SHADOW.sm]}>
                <Text style={styles.kpiVal}>{visits.length}</Text>
                <Text style={styles.kpiLabel}>Verified Visits</Text>
              </View>

              <View style={[styles.kpiCard, SHADOW.sm]}>
                <Text style={styles.kpiVal}>₹{avgTicket}</Text>
                <Text style={styles.kpiLabel}>Avg Dine-in Bill</Text>
              </View>
            </View>

            {/* Peak Hours Insights (Slide 08) */}
            <View style={[styles.insightCard, SHADOW.sm]}>
              <View style={styles.insightIcon}>
                <PackIcon name="clock" size={22} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.insightTitle}>Peak Dine-in Hours</Text>
                <Text style={styles.insightDesc}>
                  Most verified QR visits occur between 7:30 PM – 9:45 PM. Consider scheduling Friday specials during this window.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>In-Restaurant Activity Log</Text>

            {visits.map((v) => {
              const dateStr = new Date(v.timestamp).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <View key={v.id} style={[styles.visitCard, SHADOW.sm]}>
                  <View style={styles.visitLeft}>
                    <View style={styles.tableBadge}>
                      <Text style={styles.tableBadgeText}>{v.tableNumber || "QR"}</Text>
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.customerName}>{v.customerName}</Text>
                      <Text style={styles.customerPhone}>
                        {v.phone} • {dateStr}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.amountText}>₹{v.amount}</Text>
                    <View style={styles.verifiedTag}>
                      <PackIcon name="checkmark" size={10} color={COLORS.green} />
                      <Text style={styles.verifiedText}>{v.method}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <>
            {/* Rating Overview */}
            <View style={[styles.ratingBanner, SHADOW.sm]}>
              <View style={styles.ratingLeft}>
                <Text style={styles.bigRatingScore}>{activeRestaurant.rating}</Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <PackIcon
                      key={i}
                      name="star"
                      size={18}
                      color={i < Math.floor(activeRestaurant.rating) ? COLORS.star : "#D1D1D6"}
                    />
                  ))}
                </View>
                <Text style={styles.totalReviewsCount}>
                  Based on {activeRestaurant.reviews} ratings
                </Text>
              </View>

              <View style={styles.ratingNoticeRight}>
                <Text style={styles.ratingNoticeTitle}>Restrofe Verified</Text>
                <Text style={styles.ratingNoticeSub}>
                  Only customers who paid via table QR or ordered can leave verified feedback.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Customer Reviews & Replies</Text>

            {reviews.map((rev) => {
              const currentInput = replyInputs[rev.id] || "";
              return (
                <View key={rev.id} style={[styles.reviewCard, SHADOW.sm]}>
                  <View style={styles.reviewTopRow}>
                    <View>
                      <Text style={styles.revName}>{rev.customerName}</Text>
                      <Text style={styles.revDate}>{rev.date}</Text>
                    </View>
                    <View style={styles.revPill}>
                      <Text style={styles.revPillText}>{rev.rating}</Text>
                      <PackIcon name="star" size={10} color="#FFFFFF" />
                    </View>
                  </View>

                  <Text style={styles.revComment}>{rev.text}</Text>

                  {/* Owner Reply if present */}
                  {rev.reply ? (
                    <View style={styles.ownerReplyBox}>
                      <View style={styles.ownerReplyHeader}>
                        <Text style={styles.ownerReplyLabel}>Owner Response</Text>
                        <Text style={styles.ownerReplyDate}>{rev.replyDate || "Recently"}</Text>
                      </View>
                      <Text style={styles.ownerReplyBody}>{rev.reply}</Text>
                    </View>
                  ) : (
                    <View style={styles.replyComposer}>
                      <TextInput
                        value={currentInput}
                        onChangeText={(t) =>
                          setReplyInputs((prev) => ({ ...prev, [rev.id]: t }))
                        }
                        placeholder="Write a response as restaurant owner..."
                        placeholderTextColor={COLORS.muted}
                        style={styles.replyInput}
                      />
                      <PressableScale
                        haptic="success"
                        style={styles.sendReplyBtn}
                        onPress={() => handleSendReply(rev.id)}
                      >
                        <PackIcon name="arrow-right" size={16} color="#FFFFFF" />
                      </PressableScale>
                    </View>
                  )}
                </View>
              );
            })}
          </>
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F0ECE6",
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    marginVertical: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabItemActive: {
    backgroundColor: COLORS.card,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "900",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kpiVal: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.subtext,
    marginTop: 4,
    textAlign: "center",
  },
  insightCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    marginTop: 14,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  insightDesc: {
    fontSize: 11,
    color: COLORS.subtext,
    lineHeight: 16,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 22,
    marginBottom: 12,
  },
  visitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tableBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  customerPhone: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.green,
  },
  ratingBanner: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingLeft: {
    alignItems: "center",
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: "#F5EFE9",
  },
  bigRatingScore: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: 40,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
    marginVertical: 4,
  },
  totalReviewsCount: {
    fontSize: 11,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  ratingNoticeRight: {
    flex: 1,
    marginLeft: 16,
  },
  ratingNoticeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.green,
  },
  ratingNoticeSub: {
    fontSize: 11,
    color: COLORS.subtext,
    lineHeight: 15,
    marginTop: 2,
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  revName: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  revDate: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  revPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  revPillText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  revComment: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    marginTop: 8,
  },
  ownerReplyBox: {
    backgroundColor: "#F9F6F2",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  ownerReplyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  ownerReplyLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
  },
  ownerReplyDate: {
    fontSize: 10,
    color: COLORS.muted,
  },
  ownerReplyBody: {
    fontSize: 12,
    color: COLORS.subtext,
    lineHeight: 16,
  },
  replyComposer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  replyInput: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.text,
  },
  sendReplyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
