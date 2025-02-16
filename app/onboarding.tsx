import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Index: undefined;
  Home: undefined;
  Onboarding: undefined;
  MainPage: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnboardingProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function Onboarding({ setIsLoggedIn }: OnboardingProps) {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const preferences = ['Vegan', 'Vegetarian', 'Pescatarian', 'Gluten-Free', 'Keto', 'Low-Carb'];
  const allergies = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Wheat'];

  const handlePreferenceToggle = (pref: string) => {
    setSelectedPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleAllergyToggle = (allergy: string) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Save preferences
      const preferencesDoc = doc(db, 'users', user.uid, 'AllAboutUser', 'preferences');
      await setDoc(preferencesDoc, {
        foodPreferences: selectedPreferences,
        allergies: selectedAllergies,
      });

      // Update profile to mark onboarding as completed
      const profileDoc = doc(db, 'users', user.uid, 'AllAboutUser', 'profile');
      await setDoc(profileDoc, { onboardingCompleted: true }, { merge: true });

      // Set logged in state to true
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Food Preferences</Text>
      <View style={styles.buttonContainer}>
        {preferences.map((pref) => (
          <TouchableOpacity 
            key={pref}
            style={[
              styles.preferenceButton,
              selectedPreferences.includes(pref) && styles.selectedButton
            ]}
            onPress={() => handlePreferenceToggle(pref)}
          >
            <Text style={[
              styles.buttonText,
              selectedPreferences.includes(pref) && styles.selectedButtonText
            ]}>
              {pref}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>Allergies</Text>
      <View style={styles.buttonContainer}>
        {allergies.map((allergy) => (
          <TouchableOpacity 
            key={allergy}
            style={[
              styles.allergyButton,
              selectedAllergies.includes(allergy) && styles.selectedAllergyButton
            ]}
            onPress={() => handleAllergyToggle(allergy)}
          >
            <Text style={[
              styles.buttonText,
              selectedAllergies.includes(allergy) && styles.selectedButtonText
            ]}>
              {allergy}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preferenceButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  allergyButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF5252',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  selectedAllergyButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});