import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';

export const SupportCard: React.FC = () => {
  const [faqOpen, setFaqOpen] = useState(false);

  const faqs = [
    { q: 'How do customer bookings get confirmed?', a: 'When a customer books a slot, you receive an instant alert. You can click Accept to confirm or Reschedule to propose a new time.' },
    { q: 'When do I get paid for completed services?', a: 'Direct workshop payments are collected on-site, and online customer payments are remitted weekly to your verified bank account.' },
    { q: 'How do I boost my workshop ranking?', a: 'Maintain a 95%+ response rate, reply to customer reviews promptly, and keep your service catalog & pricing updated.' },
  ];

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@roadmate.app?subject=Vendor%20Partner%20Support%20Request').catch(() => {
      Alert.alert('Contact Support', 'Email support@roadmate.app or call toll-free 1800-ROADMATE');
    });
  };

  const handleReportProblem = () => {
    Alert.alert('Report a Problem', 'Problem report ticket #T-8890 created. Support team will contact you shortly.');
  };

  const handleFeatureRequest = () => {
    Alert.alert('Feature Request', 'Thank you for your feedback! Your feature request has been submitted to the RoadMate product team.');
  };

  return (
    <View style={styles.container}>
      {/* FAQs Collapsible */}
      <TouchableOpacity onPress={() => setFaqOpen(!faqOpen)} style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>❓</Text>
          <View>
            <Text style={styles.title}>Frequently Asked Questions (FAQs)</Text>
            <Text style={styles.sub}>Common queries & partner guidelines</Text>
          </View>
        </View>
        <Text style={styles.arrow}>{faqOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {faqOpen && (
        <View style={styles.faqList}>
          {faqs.map((f, i) => (
            <View key={i} style={styles.faqItem}>
              <Text style={styles.question}>Q: {f.q}</Text>
              <Text style={styles.answer}>{f.a}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Contact Support */}
      <TouchableOpacity onPress={handleContactSupport} style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>📞</Text>
          <View>
            <Text style={styles.title}>Contact Partner Support</Text>
            <Text style={styles.sub}>24/7 dedicated partner helpline</Text>
          </View>
        </View>
        <Text style={styles.arrow}>❯</Text>
      </TouchableOpacity>

      {/* Report Problem */}
      <TouchableOpacity onPress={handleReportProblem} style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>🚨</Text>
          <View>
            <Text style={styles.title}>Report a Technical Problem</Text>
            <Text style={styles.sub}>Submit app issue ticket to engineering</Text>
          </View>
        </View>
        <Text style={styles.arrow}>❯</Text>
      </TouchableOpacity>

      {/* Feature Request */}
      <TouchableOpacity onPress={handleFeatureRequest} style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>💡</Text>
          <View>
            <Text style={styles.title}>Submit Feature Request</Text>
            <Text style={styles.sub}>Suggest new features for RoadMate</Text>
          </View>
        </View>
        <Text style={styles.arrow}>❯</Text>
      </TouchableOpacity>

      {/* App Version Box */}
      <View style={styles.versionBox}>
        <Text style={styles.versionText}>RoadMate Partner App · Version 2.4.0-production</Text>
        <Text style={styles.buildText}>Build #88492 · Backend API Connected (Port 5000)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  sub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  arrow: {
    fontSize: 10,
    color: '#94A3B8',
  },
  faqList: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    gap: 8,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 6,
  },
  question: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  answer: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 15,
  },
  versionBox: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  buildText: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 1,
  },
});
export default SupportCard;
