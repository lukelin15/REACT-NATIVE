import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  TouchableOpacity,
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

export default function MainPage() {
  const [toTop, setToTop] = useState(false); // Track if it's at the top
  const [isVisible, setIsVisible] = useState(false); // Track visibility of the content
  const { height } = Dimensions.get('window');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const initialPosition: Position = { x: 0, y: height - 100 }; // Initial position at the bottom
  const halfHeightPosition: Position = { x: 0, y: height / 2 - 10 }; // Position halfway up the screen
  const position = useRef(new Animated.ValueXY(initialPosition)).current;
  const titlePosition = useRef(new Animated.Value(0)).current; // To animate title position

  const MIN_DRAG_THRESHOLD = 100; // Minimum drag distance to reveal the content

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
    Animated.timing(position, {
      toValue: halfHeightPosition,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setToTop(true); // Mark as halfway up
      setIsVisible(true); // Show the content
    });
  };

  // Snaps the view back to the bottom and hides the content
  const snapToBottom = (initialPosition: Position) => {
    Animated.timing(position, {
      toValue: initialPosition,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      setToTop(false); // Mark as at the bottom
      setIsVisible(false); // Hide the content
    });

    Animated.timing(titlePosition, {
      toValue: 0, // Center the title
      duration: 300,
      useNativeDriver: true,
    }).start();
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

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.title, { transform: [{ translateY: titlePosition }] }]}
      >
        Groceries Shopping List
      </Animated.Text>

      <Animated.View
        style={[styles.draggable, { height }, position.getLayout()]}
        {...parentResponder.panHandlers}
      >
        <Text style={styles.dragHandle}>_____________</Text>

        {/* Only show the items when the content is visible */}
        {isVisible && (
          <ScrollView style={styles.scroll}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.lorem}>
              Welcome to our Grocery Shopping List Recommendation System! This app helps you optimize your grocery shopping by providing recommendations based on your shopping list.
            </Text>

            {/* Buttons for SignIn and Sign Up */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.SignInButton}
                onPress={navigateToSignIn}
              >
                <Text style={styles.SignInText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={navigateToSignUp}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Animated.View>

      {/* Tip text at the bottom */}
      {!isVisible && <Text style={styles.tip}>Drag up!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
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
  },
  dragHandle: {
    fontSize: 18,
    color: '#fff',
    height: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 60,
  },
  scroll: {
    width: '100%',
    padding: 20,
  },
  welcome: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  lorem: {
    fontSize: 20,
    marginBottom: 70,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  },
  signUpButton: {
    backgroundColor: '#000000',
    paddingVertical: 20,
    fontWeight: 'bold',
    flex: 1,
    alignItems: 'center',
    borderRadius: 50,
  },
  SignInText: {
    color: '#4CAF50',
    fontSize: 18,
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 18,
  },
  tip: {
    position: 'absolute',
    bottom: 20,
    fontSize: 16,
    color: '#fff',
  },
});
