import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Linking
} from 'react-native';

const API_KEY = 'AIzaSyBCBJGPUsnUMWOi35liRxHG3gi7zswtcKs'; 

export default function RoutePlanner() {
  const [addressesText, setAddressesText] = useState(
    "9500 Gilman Dr, La Jolla, CA 92093\n4840 Shawline St, San Diego, CA 92111\n7330 Clairemont Mesa Blvd, San Diego, CA 92111"
  );

  const [routeResult, setRouteResult] = useState<any>(null);

  const computeOptimizedRoute = async () => {
    const storeAddresses = addressesText
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);

    if (storeAddresses.length < 2) {
      Alert.alert('Error', 'Please enter at least two addresses (origin and destination).');
      return;
    }

    const origin = { address: storeAddresses[0] };
    const destination = { address: storeAddresses[storeAddresses.length - 1] };
    const intermediates =
      storeAddresses.length > 2
        ? storeAddresses.slice(1, -1).map(address => ({ address }))
        : [];

    const requestBody = {
      origin,
      destination,
      intermediates,
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
      console.log("Optimized route data:", data);
      setRouteResult(data);

      if (!data.routes || data.routes.length === 0) {
        Alert.alert("Error", "No route found by the API.");
        return;
      }

      const route = data.routes[0];
      const optimizedIndex = route.optimizedIntermediateWaypointIndex;
      if (!optimizedIndex || intermediates.length === 0) {
        console.log("No intermediate waypoints or no optimized index returned; using original addresses.");
        openMapsLink(storeAddresses);
        return;
      }

      const isOutOfRange = optimizedIndex.some((idx: number) => idx < 0 || idx >= intermediates.length);
      if (isOutOfRange) {
        console.warn("Routes API returned an out-of-range index. Skipping reorder.");
        openMapsLink(storeAddresses);
        return;
      }

      const reorderedIntermediates = optimizedIndex.map((i: number) => {
        console.log(`Mapping index ${i} to address:`, intermediates[i].address); 
        return intermediates[i].address;
      });

      const finalAddresses = [
        storeAddresses[0],
        ...reorderedIntermediates,
        storeAddresses[storeAddresses.length - 1]
      ];

      openMapsLink(finalAddresses);


      Alert.alert("Success", "Optimized route retrieved and opened in Google Maps!");
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
    const origin = encodeURIComponent(addresses[0]);
    const destination = encodeURIComponent(addresses[addresses.length - 1]);

    const waypointsArr = addresses.slice(1, -1);
    const waypoints = waypointsArr.map(encodeURIComponent).join("|");

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypointsArr.length > 0) {
      url += `&waypoints=${waypoints}`;
    }

    url += `&travelmode=driving`;

    console.log("Opening maps link:", url);
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Route Planner</Text>
      <Text style={styles.description}>
        Enter a list of store addresses (one per line). The first address is used as the origin, the last as the destination. 
        We'll call the Google Routes API to optimize the waypoints, then open Google Maps with that optimized order.
      </Text>

      <TextInput
        style={styles.textArea}
        multiline
        value={addressesText}
        onChangeText={setAddressesText}
        placeholder="Enter addresses, one per line..."
      />

      <Button title="Compute & Open in Google Maps" onPress={computeOptimizedRoute} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  resultText: { fontSize: 14, color: '#333' },
});



