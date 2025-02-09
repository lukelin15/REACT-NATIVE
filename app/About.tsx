import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";

export default function About() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/images/team.png')} style={styles.image} />
        <Text style={styles.title}>About This App</Text>
        <Text style={styles.description}>
          This app is a Grocery Shopping List Recommendation System designed to help you optimize your grocery shopping by providing recommendations based on your shopping list. Using geo-mapping and location services, we ensure you get the best prices and the most convenient locations for your shopping needs.
        </Text>

        <View style={styles.teamSection}>
          <Text style={styles.teamTitle}>Meet The Team</Text>
          <View style={styles.teamList}>
            <Text style={styles.teamMember}>Luke</Text>
            <Text style={styles.teamMember}>Matteo</Text>
            <Text style={styles.teamMember}>Yi</Text>
            <Text style={styles.teamMember}>Jessica</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Get screen width dynamically
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center', // Centers content for better alignment
  },
  image: {
    width: width * 0.9,  // Adjusts dynamically based on screen size
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  teamSection: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E8B57',
    marginBottom: 10,
  },
  teamList: {
    alignItems: 'center',
  },
  teamMember: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  contactButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.6, // Makes button width dynamic
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
