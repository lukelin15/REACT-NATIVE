import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PushToTalk() {
  const [isListening, setIsListening] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [shimmerAnim] = useState(new Animated.Value(0));
  const [secondaryPulseAnim] = useState(new Animated.Value(1));

  const startAnimations = () => {
    // Reset animations
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    shimmerAnim.setValue(0);
    secondaryPulseAnim.setValue(1);

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Main pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Secondary pulse (delayed)
    Animated.loop(
      Animated.sequence([
        Animated.timing(secondaryPulseAnim, {
          toValue: 1.2,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(secondaryPulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopAnimations = () => {
    pulseAnim.stopAnimation();
    rotateAnim.stopAnimation();
    shimmerAnim.stopAnimation();
    secondaryPulseAnim.stopAnimation();
    
    // Reset to initial values
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
    shimmerAnim.setValue(0);
    secondaryPulseAnim.setValue(1);
  };

  const handlePressIn = () => {
    setIsListening(true);
    startAnimations();
  };

  const handlePressOut = () => {
    setIsListening(false);
    stopAnimations();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.listeningText}>
          {isListening ? "Go ahead, I'm listening" : "Tap to speak"}
        </Text>
        
        <View style={styles.circleContainer}>
          {/* Outer rotating ring */}
          <Animated.View
            style={[
              styles.rotatingRing,
              {
                transform: [
                  { rotate: spin },
                  { scale: secondaryPulseAnim },
                ],
                opacity: isListening ? 0.3 : 0,
              },
            ]}
          />
          
          {/* Main pulse circle */}
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
                opacity: isListening ? 0.3 : 0,
              },
            ]}
          />
          
          {/* Shimmer effect */}
          <Animated.View
            style={[
              styles.shimmerEffect,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            ]}
          />
          
          <LinearGradient
            colors={['#4CAF50', '#45a049', '#388E3C']}
            style={styles.gradientCircle}
          >
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.button}
            >
              <View style={styles.innerCircle}>
                <Animated.View
                  style={[
                    styles.innerShimmer,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.1, 0.4],
                      }),
                    },
                  ]}
                />
              </View>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  listeningText: {
    color: '#333',
    fontSize: 16,
    marginBottom: 40,
    opacity: 0.8,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  rotatingRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4CAF50',
  },
  shimmerEffect: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#fff',
  },
  gradientCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  innerShimmer: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
});
