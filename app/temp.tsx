import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';


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
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  const [otherPreference, setOtherPreference] = useState('');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [otherCuisine, setOtherCuisine] = useState('');

  const preferences = ['Vegan', 'Vegetarian', 'Pescatarian', 'Gluten-Free', 'Lactose-Free', 'Low-Carb','Low-Sodium'];
  const allergies = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Wheat'];
  const cuisines = ['Japanese', 'Chinese', 'Mediterranean', 'American', 'Thai', 'Indian', 'Mexican', 'French', 'Italian','Korean','Vietnamese','Spanish','Middle Eastern'];

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList((prev: string[]) => prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]);
  };
  
  useEffect(() => {
    const fetchLocation = async () => {
      setLocation(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        setPermissionStatus('denied');
        return;
      }

      setPermissionStatus('granted');

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);


  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const preferencesDoc = doc(db, 'users', user.uid, 'AllAboutUser', 'preferences');
      await setDoc(preferencesDoc, {
        dietaryPreferences: [...selectedPreferences, otherPreference].filter(Boolean),
        foodAllergies: [...selectedAllergies, otherAllergy].filter(Boolean),
        cuisinePreferences: [...selectedCuisines, otherCuisine].filter(Boolean),
        location: permissionStatus === 'granted' ? location : null, 
      });

      const profileDoc = doc(db, 'users', user.uid, 'AllAboutUser', 'profile');
      await setDoc(profileDoc, { onboardingCompleted: true }, { merge: true });

      setIsLoggedIn(true);
      console.log('Available routes:', navigation.getState().routes);
      navigation.replace('Index');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Onboarding Survey</Text>
        <Text style={styles.description}>
          Tell us about your dietary needs and preferences to help us recommend the best food options for you.
        </Text>
      </View>

      {/* Display User Location */}
      {location && (
        <Text style={styles.locationText}>
          📍 Your Location: {location.latitude}, {location.longitude}
        </Text>
      )}

      {/* Dietary Preferences Section */}
      <Text style={styles.sectionTitle}>Dietary Preferences</Text>
      <View style={styles.buttonContainer}>
        {preferences.map((pref) => (
          <TouchableOpacity 
            key={pref}
            style={[styles.button, selectedPreferences.includes(pref) && styles.selectedButton]}
            onPress={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)}
          >
            <Text style={[styles.buttonText, selectedPreferences.includes(pref) && styles.selectedText]}>
              {pref}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Other dietary preference" value={otherPreference} onChangeText={setOtherPreference} />

      {/* Allergies Section */}
      <Text style={styles.sectionTitle}>Allergies</Text>
      <View style={styles.buttonContainer}>
        {allergies.map((allergy) => (
          <TouchableOpacity 
            key={allergy}
            style={[styles.button, selectedAllergies.includes(allergy) && styles.selectedButton]}
            onPress={() => toggleSelection(allergy, selectedAllergies, setSelectedAllergies)}
          >
            <Text style={[styles.buttonText, selectedAllergies.includes(allergy) && styles.selectedText]}>
              {allergy}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Other allergy" value={otherAllergy} onChangeText={setOtherAllergy} />

      {/* Cuisine Preferences Section */}
      <Text style={styles.sectionTitle}>Cuisine Preferences</Text>
      <View style={styles.buttonContainer}>
        {cuisines.map((cuisine) => (
          <TouchableOpacity 
            key={cuisine}
            style={[styles.button, selectedCuisines.includes(cuisine) && styles.selectedButton]}
            onPress={() => toggleSelection(cuisine, selectedCuisines, setSelectedCuisines)}
          >
            <Text style={[styles.buttonText, selectedCuisines.includes(cuisine) && styles.selectedText]}>
              {cuisine}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Other cuisine preference" value={otherCuisine} onChangeText={setOtherCuisine} />

      {/* Save Button */}
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
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
  locationButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

