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

export default function MainPage() {
  const [toTop, setToTop] = useState(false); // Track if it's at the top
  const [isVisible, setIsVisible] = useState(false); // Track visibility of the content
  const { height } = Dimensions.get('window');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const initialPosition: Position = { x: 0, y: height - 100 }; // Initial position at the bottom
  const halfHeightPosition: Position = { x: 0, y: height * 0.4 }; // Position halfway up the screen
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
      return false;
    },
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (e, gestureState) => {
      return gestureState.dy < -6 || gestureState.dy > 6; // Allow dragging up or down
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
            showsVerticalScrollIndicator={false}
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
              Welcome
            </Animated.Text>
            <Animated.Text
              style={[
                styles.lorem,
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
              Welcome to SmartCart, our Grocery Shopping List Recommendation System! This app helps you optimize your grocery shopping by providing recommendations based on your shopping list.
            </Animated.Text>
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
    bottom: 20,
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
});
