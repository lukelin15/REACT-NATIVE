import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  const [otherPreference, setOtherPreference] = useState('');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [otherCuisine, setOtherCuisine] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);

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

      // Show loading while generating data
      setIsGenerating(true);
      try {
        // await fetch(`http://localhost:8003/api/generate-menu/${user.uid}`, { method: 'POST' });
        // await fetch(`http://localhost:8003/api/generate-categories/${user.uid}`, { method: 'POST' });
        console.log('Data generated successfully');
      } catch (genError) {
        console.error('Error generating data:', genError);
      } finally {
        setIsGenerating(false);
      }

      setIsLoggedIn(true);
      console.log('Available routes:', navigation.getState().routes);
      navigation.replace('Index');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  if (isGenerating) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFE5D9' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 20, color: '#4CAF50' }}>Generating data...</Text>
      </View>
    );
  }

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentStep}/{totalSteps}</Text>
      </View>
    );
  };

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            <Text style={styles.sectionDescription}>
              Select any dietary restrictions or preferences you follow. This helps us recommend suitable food options.
            </Text>
            <View style={styles.selectionCounter}>
              <Text style={styles.counterText}>
                {selectedPreferences.length} selected
              </Text>
            </View>
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
            <TextInput 
              style={styles.input} 
              placeholder="Other dietary preference" 
              value={otherPreference} 
              onChangeText={setOtherPreference} 
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies</Text>
            <Text style={styles.sectionDescription}>
              Let us know about any food allergies you have. We'll make sure to warn you about dishes containing these ingredients.
            </Text>
            <View style={styles.selectionCounter}>
              <Text style={styles.counterText}>
                {selectedAllergies.length} selected
              </Text>
            </View>
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
            <TextInput 
              style={styles.input} 
              placeholder="Other allergy" 
              value={otherAllergy} 
              onChangeText={setOtherAllergy} 
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuisine Preferences</Text>
            <Text style={styles.sectionDescription}>
              Choose your favorite cuisines. We'll prioritize showing you dishes from these culinary traditions.
            </Text>
            <View style={styles.selectionCounter}>
              <Text style={styles.counterText}>
                {selectedCuisines.length} selected
              </Text>
            </View>
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
            <TextInput 
              style={styles.input} 
              placeholder="Other cuisine preference" 
              value={otherCuisine} 
              onChangeText={setOtherCuisine} 
            />
          </View>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      <ScrollView style={styles.scrollContainer}>
        {renderCurrentSection()}
      </ScrollView>
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          onPress={handleNext} 
          style={[styles.nextButton, currentStep === totalSteps && styles.saveButton]}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Save' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5D9',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    padding: 20,
    paddingTop: 50,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFD5C2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    textAlign: 'right',
    marginTop: 5,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  selectionCounter: {
    backgroundColor: '#F0F9F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  counterText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
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
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});

