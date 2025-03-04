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

export const computeOptimizedRoute = async (origin: string, destination: string, waypoints: string[]) => {
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



