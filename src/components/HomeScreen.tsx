import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export function HomeScreenComponent({ onNavigateMenu }: { onNavigateMenu: () => void }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.tag}>TABLE DINE-IN</Text>
        <Text style={styles.title}>Welcome to Restrofe</Text>
        <Text style={styles.sub}>Scan table QR codes, order instantly to kitchen, and collect loyalty stamps.</Text>
        <TouchableOpacity style={styles.btn} onPress={onNavigateMenu}>
          <Text style={styles.btnText}>Open Bean Theory Cafe Menu →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F2' },
  content: { padding: 16 },
  card: { backgroundColor: '#171717', borderRadius: 24, padding: 20, gap: 8 },
  tag: { backgroundColor: '#F4512A', color: '#FFFFFF', fontSize: 10, fontWeight: '900', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  sub: { color: '#77716A', fontSize: 12, lineHeight: 16 },
  btn: { backgroundColor: '#F4512A', borderRadius: 16, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
});
