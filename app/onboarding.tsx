import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect } from 'react';

type RootStackParamList = {
  onboarding: { uid: string };
  Index: undefined;
};

type OnboardingNavigationProp = StackNavigationProp<RootStackParamList, 'onboarding'>;
type OnboardingRouteProp = RouteProp<RootStackParamList, 'onboarding'>;

const CUISINES = ['Japanese', 'Chinese', 'Mediterranean', 'American', 'Thai', 'Indian', 'Mexican', 'French', 'Italian'];
const ALLERGIES = ['Milk', 'Egg', 'Shellfish', 'Peanut', 'Wheat', 'Fish', 'Tree Nuts', 'Soybeans', 'Sesame'];
const DIETARY = ['Gluten-free', 'Vegetarian', 'Lactose-free', 'Vegan'];

export default function Onboarding({ route }: { route: OnboardingRouteProp }) {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const { uid } = route.params;

  useEffect(() => {
    console.log('Onboarding screen loaded with UID:', route.params?.uid);
  }, []);
  
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [otherCuisine, setOtherCuisine] = useState('');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [otherDietary, setOtherDietary] = useState('');

  const [dynamicPreferences, setDynamicPreferences] = useState<Record<string, any>>({});

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addNewPreference = (key: string, value: any) => {
    setDynamicPreferences(prevPreferences => ({
      ...prevPreferences,
      [key]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const preferences: any = {
        uid,
        cuisinePreferences: [...selectedCuisines, otherCuisine].filter(Boolean),
        foodAllergies: [...selectedAllergies, otherAllergy].filter(Boolean),
        dietaryPreferences: [...selectedDietary, otherDietary].filter(Boolean),
      };

      if (Object.keys(dynamicPreferences).length > 0) {
        preferences.preferences = dynamicPreferences;
      }

      const response = await fetch('http://127.0.0.1:8001//onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save data on the server');
      }

      Alert.alert('Success', 'Your preferences have been saved!');
      navigation.replace('Home');

    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
};



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Onboarding Survey</Text>

      {/* Cuisine Preferences */}
      <Text style={styles.sectionTitle}>1. Preferred Cuisines</Text>
      <View style={styles.buttonContainer}>
        {CUISINES.map((cuisine) => (
          <TouchableOpacity
            key={cuisine}
            style={[styles.choiceButton, selectedCuisines.includes(cuisine) && styles.selectedButton]}
            onPress={() => toggleSelection(cuisine, selectedCuisines, setSelectedCuisines)}
          >
            <Text style={[styles.choiceText, selectedCuisines.includes(cuisine) && styles.selectedText]}>
              {cuisine}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Other Cuisine:</Text>
      <TextInput style={styles.input} placeholder="Enter other cuisine..." value={otherCuisine} onChangeText={setOtherCuisine} />

      {/* Food Allergies */}
      <Text style={styles.sectionTitle}>2. Food Allergies</Text>
      <View style={styles.buttonContainer}>
        {ALLERGIES.map((allergy) => (
          <TouchableOpacity
            key={allergy}
            style={[styles.choiceButton, selectedAllergies.includes(allergy) && styles.selectedButton]}
            onPress={() => toggleSelection(allergy, selectedAllergies, setSelectedAllergies)}
          >
            <Text style={[styles.choiceText, selectedAllergies.includes(allergy) && styles.selectedText]}>
              {allergy}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Other Allergy:</Text>
      <TextInput style={styles.input} placeholder="Enter other allergy..." value={otherAllergy} onChangeText={setOtherAllergy} />

      {/* Dietary Preferences */}
      <Text style={styles.sectionTitle}>3. Dietary Preferences</Text>
      <View style={styles.buttonContainer}>
        {DIETARY.map((diet) => (
          <TouchableOpacity
            key={diet}
            style={[styles.choiceButton, selectedDietary.includes(diet) && styles.selectedButton]}
            onPress={() => toggleSelection(diet, selectedDietary, setSelectedDietary)}
          >
            <Text style={[styles.choiceText, selectedDietary.includes(diet) && styles.selectedText]}>
              {diet}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Other Dietary Preference:</Text>
      <TextInput style={styles.input} placeholder="Enter other dietary preference..." value={otherDietary} onChangeText={setOtherDietary} />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    choiceButton: {
      backgroundColor: '#f0f0f0',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
    },
    selectedButton: {
      backgroundColor: '#4CAF50',
    },
    choiceText: {
      color: '#333',
    },
    selectedText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    label: {
      fontSize: 16,
      marginTop: 10,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 16,
      marginTop: 4,
      backgroundColor: '#f8f8f8',
    },
    submitButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 40,
    },
    submitText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  
