import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Easing,
  Platform,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define the stack's parameter list
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  NextScreen: undefined;
};

// Define a reusable type for position objects
type Position = {
  x: number;
  y: number;
};

// Add type definitions
type AnimatedPosition = {
  x: number;
  y: number;
};

// Add this type definition at the top with other types
type FeatureItemProps = {
  icon: string;
  title: string;
  description: string;
};

// Add the FeatureItem component definition before the MainPage component
const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
};

export default function MainPage() {
  const [toTop, setToTop] = useState(false); // Track if it's at the top
  const [isVisible, setIsVisible] = useState(false); // Track visibility of the content
  const { height } = Dimensions.get('window');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const initialPosition: Position = { x: 0, y: height - 100 }; // Initial position at the bottom
  const halfHeightPosition: Position = { x: 0, y: height * 0.3 }; // Position halfway up the screen
  const position = useRef(new Animated.ValueXY(initialPosition)).current;
  const titlePosition = useRef(new Animated.Value(0)).current; // To animate title position

  // Add new animated values for enhanced effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dragHandleRotate = useRef(new Animated.Value(0)).current;

  const MIN_DRAG_THRESHOLD = 100; // Minimum drag distance to reveal the content

  // Add animated values for background circles
  const circle1Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circle2Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circle3Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Function to create infinite floating animation with proper types
  const createFloatingAnimation = (
    animatedValue: Animated.ValueXY,
    startPos: AnimatedPosition,
    amplitude: number
  ) => {
    const randomDuration = 3000 + Math.random() * 2000; // Random duration between 3-5s
    
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: { 
          x: startPos.x + (Math.random() - 0.5) * amplitude * 2,
          y: startPos.y + (Math.random() - 0.5) * amplitude * 2
        },
        duration: randomDuration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: { 
          x: startPos.x + (Math.random() - 0.5) * amplitude,
          y: startPos.y + (Math.random() - 0.5) * amplitude
        },
        duration: randomDuration * 0.8,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    ]).start(() => createFloatingAnimation(animatedValue, startPos, amplitude));
  };

  // Start floating animations
  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    
    // Start positions for each circle with more spread
    const positions = [
      { x: width * 0.3, y: height * 0.3 },
      { x: width * 0.7, y: height * 0.4 },
      { x: width * 0.5, y: height * 0.6 }
    ];
    
    createFloatingAnimation(circle1Position, positions[0], 200);
    createFloatingAnimation(circle2Position, positions[1], 250);
    createFloatingAnimation(circle3Position, positions[2], 180);
  }, []);

  // PanResponder logic to handle the dragging gesture
  const parentResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (e, gestureState) => {
      // Only capture initial panel drags, not scrolls inside content
      return !isVisible && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (e, gestureState) => {
      const touchY = e.nativeEvent.locationY;
      if (Math.abs(gestureState.dy) < Math.abs(gestureState.dx)) {
        return false;
      }
      if (isVisible) {
        return touchY < 50 && Math.abs(gestureState.dy) > 10;
      }
      return !isVisible && Math.abs(gestureState.dy) > 10;
    },

    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (evt, gestureState) => {
      let newY = gestureState.dy/2;

      if (toTop && newY > 0 && isVisible) {
        setIsVisible(false);
      }

      // Prevent dragging up if it's already at the top
      if (toTop && newY < 0) return;
      position.setValue({ x: 0, y: initialPosition.y + newY });

      // Adjust the title's position based on drag
      titlePosition.setValue(newY / 2); // Shifting title up as the section is dragged
    },

    onPanResponderRelease: (evt, gestureState) => {
      // If dragged far enough up, snap to halfway up and show content
      if (gestureState.dy < -MIN_DRAG_THRESHOLD) {
        snapToHalfway();
      } else if (gestureState.dy > MIN_DRAG_THRESHOLD) {
        snapToBottom(initialPosition);
      } else {
        snapToBottom(initialPosition); // Return to the bottom if not dragged enough
      }
    },
  });

  // Snaps the view to halfway up the screen and makes content visible
  const snapToHalfway = () => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: halfHeightPosition,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(titlePosition, {
        toValue: -Dimensions.get('window').height * 0.25,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(dragHandleRotate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToTop(true);
      setIsVisible(true);
    });
  };

  // Snaps the view back to the bottom and hides the content
  const snapToBottom = (initialPosition: Position) => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: initialPosition,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(titlePosition, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(dragHandleRotate, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToTop(false);
    });
  };

  // Close button action
  const closeContent = () => {
    snapToBottom(initialPosition); // Close by snapping to bottom
  };

  // Navigation on button press
  const navigateToSignIn = () => {
    navigation.navigate('SignIn'); // Navigate to SignIn screen
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp'); // Navigate to Sign Up screen
  };

  // Add button animation handlers
  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const spin = dragHandleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background Circles */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle1,
          {
            transform: circle1Position.getTranslateTransform(),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle2,
          {
            transform: circle2Position.getTranslateTransform(),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle3,
          {
            transform: circle3Position.getTranslateTransform(),
          },
        ]}
      />

      <Animated.Text
        style={[
          styles.title,
          {
            transform: [
              { translateY: titlePosition },
              { scale: Animated.add(1, titlePosition.interpolate({
                inputRange: [-100, 0],
                outputRange: [-0.1, 0],
                extrapolate: 'clamp',
              }))},
            ],
          },
        ]}
      >
        SmartCart
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subtitle,
          {
            transform: [
              { translateY: titlePosition },
              { scale: Animated.add(1, titlePosition.interpolate({
                inputRange: [-100, 0],
                outputRange: [-0.1, 0],
                extrapolate: 'clamp',
              }))},
            ],
            opacity: titlePosition.interpolate({
              inputRange: [-100, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        Shop smarter, not harder
      </Animated.Text>

      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { translateY: titlePosition },
              { scale: Animated.add(1, titlePosition.interpolate({
                inputRange: [-100, 0],
                outputRange: [-0.2, 0],
                extrapolate: 'clamp',
              }))},
            ],
            opacity: titlePosition.interpolate({
              inputRange: [-100, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <Text style={styles.icon}>🛒</Text>
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.icon}>💰</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.draggable,
          { height },
          position.getLayout(),
          {
            shadowOpacity: position.y.interpolate({
              inputRange: [height * 0.4, height - 100],
              outputRange: [0.3, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
        {...parentResponder.panHandlers}
      >
        <Animated.View style={[styles.dragHandleContainer, { transform: [{ rotate: spin }] }]}>
          <View style={styles.dragHandle} />
        </Animated.View>

        {isVisible && (
          <Animated.ScrollView
            style={[styles.scroll, { opacity: fadeAnim }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
            bounces={true}
            // Make sure ScrollView handles its own gestures
            keyboardShouldPersistTaps="handled"
            onStartShouldSetResponder={() => true}
            onStartShouldSetResponderCapture={() => true}
            onMoveShouldSetResponder={() => true}
            onMoveShouldSetResponderCapture={() => true}
          >
            <Animated.Text
              style={[
                styles.welcome,
                {
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              Smart Shopping, Made Personal
            </Animated.Text>
            <Animated.Text
              style={[
                styles.subheading,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              Your AI-Powered Grocery Assistant
            </Animated.Text>
            
            {/* Features Section */}
            <View style={styles.featuresContainer}>
              <FeatureItem
                icon="🎯"
                title="Personalized Lists"
                description="Get smart recommendations based on your preferences"
              />
              <FeatureItem
                icon="💡"
                title="Smart Suggestions"
                description="AI-powered recommendations for complementary items"
              />
              <FeatureItem
                icon="💰"
                title="Budget Friendly"
                description="Price comparisons and budget optimization"
              />
              {/* Additional features to make content scrollable */}
              <FeatureItem
                icon="🔄"
                title="Seamless Sync"
                description="Keep your shopping lists synchronized across all your devices"
              />
              <FeatureItem
                icon="📊"
                title="Shopping Analytics"
                description="Track your shopping habits and find ways to optimize your grocery budget"
              />
              <FeatureItem
                icon="🛒"
                title="One-Click Checkout"
                description="Seamlessly purchase all your grocery items directly from your generated shopping list."
              />
              <FeatureItem
                icon="🗺️"
                title="Optimized Shopping Routes"
                description="Plan the fastest route to multiple stores and get your groceries efficiently."
              />

              
              {/* Visual indicator that there's more content */}
              <View style={styles.scrollIndicator}>
                <Text style={styles.scrollIndicatorText}>Scroll for more features</Text>
              </View>
            </View>
          </Animated.ScrollView>
        )}
      </Animated.View>

      {isVisible && (
        <Animated.View
          style={[
            styles.buttonsContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.SignInButton}
            onPress={navigateToSignIn}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.8}
          >
            <Animated.Text style={[styles.SignInText, { transform: [{ scale: scaleAnim }] }]}>
              Sign In
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={navigateToSignUp}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.8}
          >
            <Animated.Text style={[styles.signUpText, { transform: [{ scale: scaleAnim }] }]}>
              Sign Up
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {!isVisible && (
        <Animated.Text
          style={[
            styles.tip,
            {
              opacity: position.y.interpolate({
                inputRange: [height * 0.6, height - 100],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          Drag up!
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#4CAF50',
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: '#4CAF50',
  },
  circle3: {
    width: 250,
    height: 250,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  draggable: {
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 5,
    elevation: 5,
  },
  dragHandleContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
  },
  scroll: {
    width: '100%',
    padding: 20,
    height: '80%', // Ensure there's enough room for scrolling
  },
  welcome: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subheading: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    marginTop: 20,
    paddingBottom: 40, // Extra padding to ensure scrollability
  },
  lorem: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  SignInButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  signUpButton: {
    backgroundColor: '#000000',
    paddingVertical: 20,
    fontWeight: 'bold',
    flex: 1,
    alignItems: 'center',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  SignInText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tip: {
    position: 'absolute',
    bottom: 30,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  featureItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  scrollContent: {
    paddingBottom: 350, // Add padding at bottom to ensure last items are visible
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  scrollIndicatorText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
    fontWeight: '400',
    letterSpacing: 1,
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 24,
    marginHorizontal: 10,
  },
});
