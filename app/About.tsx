import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export default function About() {
  const currentYear = new Date().getFullYear();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>
            This app is a Grocery Shopping List Recommendation System designed to help you optimize your grocery shopping by providing recommendations based on your shopping list. Using geo-mapping and location services, we ensure you get the best prices and the most convenient locations for your shopping needs.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Development Team</Text>
          <View style={styles.teamContainer}>
            {[
              { name: 'Luke', role: 'UI/UX Designer' },
              { name: 'Matteo', role: 'Backend Developer' },
              { name: 'Yi', role: 'Backend Developer' },
              { name: 'Jessica', role: 'Backend Developer' }
            ].map((member) => (
              <View key={member.name} style={styles.teamMember}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity style={styles.contactItem}>
            <MaterialIcons name="email" size={20} color="#555" />
            <Text style={styles.contactText}>support@groceryapp.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem}>
            <MaterialIcons name="phone" size={20} color="#555" />
            <Text style={styles.contactText}>+1 (555) 123-4567</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>© {currentYear} Grocery Assistant</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  teamContainer: {
    marginTop: 8,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  contactText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 12,
  },
  footer: {
    paddingTop: 24,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 4,
  },
});
