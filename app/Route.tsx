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
import { deleteAllPersistentCacheIndexes } from 'firebase/firestore';


const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const default_coordinates = "32.8801,-117.2340";

export const computeOptimizedRoute = async (origin: string, destination: string, waypoints: string[]) => {
  if (!origin.trim() || !destination.trim()) {
    Alert.alert('Error', 'Please enter both origin and destination addresses.');
    return;
  }

  const finalOrigin = origin?.trim() ? origin : default_coordinates;

  const storeAddresses = [origin, ...waypoints.filter(wp => wp.trim()), destination];

  const isOriginCoordinates = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(origin);
  const isDestinationCoordinates = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(destination);

  const requestBody = {
    origin: isOriginCoordinates
      ? { location: { latLng: { latitude: parseFloat(origin.split(',')[0]), longitude: parseFloat(origin.split(',')[1]) } } }
      : { address: finalOrigin },  

    destination: isDestinationCoordinates
      ? { location: { latLng: { latitude: parseFloat(destination.split(',')[0]), longitude: parseFloat(destination.split(',')[1]) } } }
      : { address: destination },

    intermediates: waypoints.map(address => {
      const isCoordinate = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(address);
      return isCoordinate
        ? { location: { latLng: { latitude: parseFloat(address.split(',')[0]), longitude: parseFloat(address.split(',')[1]) } } }
        : { address };
    }),

    travelMode: "DRIVE",
    optimizeWaypointOrder: true,
  };

  try {
    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY || '',
        'X-Goog-FieldMask': 'routes.optimizedIntermediateWaypointIndex'
      } as HeadersInit,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API Error Response:", errorText);
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

const Route = () => {
  // Route component implementation
  return null;
};

export default Route;



