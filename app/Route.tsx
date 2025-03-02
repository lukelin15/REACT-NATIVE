import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const API_KEY = 'AIzaSyBCBJGPUsnUMWOi35liRxHG3gi7zswtcKs';

export default function RoutePlanner() {
  const [origin, setOrigin] = useState("9500 Gilman Dr, La Jolla, CA 92093");
  const [destination, setDestination] = useState("7330 Clairemont Mesa Blvd, San Diego, CA 92111");
  const [waypoints, setWaypoints] = useState(["4840 Shawline St, San Diego, CA 92111"]);
  const [routeResult, setRouteResult] = useState<any>(null);

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const removeWaypoint = (index: number) => {
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(newWaypoints);
  };

  const updateWaypoint = (text: string, index: number) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = text;
    setWaypoints(newWaypoints);
  };

  const computeOptimizedRoute = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Error', 'Please enter both origin and destination addresses.');
      return;
    }

    const storeAddresses = [origin, ...waypoints.filter(wp => wp.trim()), destination];

    const requestBody = {
      origin: { address: origin },
      destination: { address: destination },
      intermediates: waypoints
        .filter(wp => wp.trim())
        .map(address => ({ address })),
      travelMode: "DRIVE",
      optimizeWaypointOrder: true,
    };

    try {
      const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'routes.optimizedIntermediateWaypointIndex'
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setRouteResult(data);

      if (!data.routes || data.routes.length === 0) {
        Alert.alert("Error", "No route found by the API.");
        return;
      }

      const route = data.routes[0];
      const optimizedIndex = route.optimizedIntermediateWaypointIndex;
      
      if (!optimizedIndex || waypoints.length === 0) {
        openMapsLink(storeAddresses);
        return;
      }

      const filteredWaypoints = waypoints.filter(wp => wp.trim());
      const reorderedIntermediates = optimizedIndex.map((i: number) => filteredWaypoints[i]);
      const finalAddresses = [origin, ...reorderedIntermediates, destination];

      openMapsLink(finalAddresses);
      Alert.alert("Success", "Optimized route opened in Google Maps!");
    } catch (error) {
      console.error('Error fetching optimized route:', error);
      Alert.alert('Error', 'Failed to fetch optimized route.');
    }
  };

  const openMapsLink = (addresses: string[]) => {
    if (addresses.length < 2) {
      Alert.alert("Error", "Not enough addresses to form a route.");
      return;
    }

    const encodedAddresses = addresses.map(encodeURIComponent);
    const encodedOrigin = encodedAddresses[0];
    const encodedDestination = encodedAddresses[encodedAddresses.length - 1];
    const encodedWaypoints = encodedAddresses.slice(1, -1).join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDestination}`;
    if (encodedWaypoints) {
      url += `&waypoints=${encodedWaypoints}`;
    }
    url += `&travelmode=driving`;

    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Planner</Text>
        <Text style={styles.subtitle}>Optimize your shopping route</Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="location-on" size={20} color="#4CAF50" />
            <Text style={styles.label}>Starting Point</Text>
          </View>
          <TextInput
            style={styles.input}
            value={origin}
            onChangeText={setOrigin}
            placeholder="Enter starting address..."
          />
        </View>

        {waypoints.map((waypoint, index) => (
          <View key={index} style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="add-location" size={20} color="#4CAF50" />
              <Text style={styles.label}>Stop {index + 1}</Text>
              <TouchableOpacity 
                onPress={() => removeWaypoint(index)}
                style={styles.removeButton}
              >
                <MaterialIcons name="remove-circle-outline" size={20} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={waypoint}
              onChangeText={(text) => updateWaypoint(text, index)}
              placeholder="Enter stop address..."
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addWaypoint}>
          <MaterialIcons name="add-circle-outline" size={20} color="#4CAF50" />
          <Text style={styles.addButtonText}>Add Another Stop</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="location-on" size={20} color="#4CAF50" />
            <Text style={styles.label}>Final Destination</Text>
          </View>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            placeholder="Enter destination address..."
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.computeButton} 
        onPress={computeOptimizedRoute}
      >
        <MaterialIcons name="map" size={24} color="#fff" />
        <Text style={styles.computeButtonText}>Optimize & Open in Maps</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
  },
  inputSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginLeft: 8,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  removeButton: {
    padding: 4,
  },
  computeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  computeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});



