import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import MainPage from './mainPage';
import SignIn from './signin';
import SignUp from './signup'; 
import Index from './index';
import ItemsYouMightNeed from './ItemsYouMightNeed';
import Chat from './Chat';
import Profile from './Profile';
import About from './About';
import PushToTalk from './PushToTalk';
import Map from './map';
import { auth } from '@/lib/firebase'; 
import Onboarding from './onboarding';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Index} />
      <Stack.Screen name="ItemsYouMightNeed" component={ItemsYouMightNeed} />
    </Stack.Navigator>
  );
}


export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);  // User is logged in, navigate to main screen
      } else {
        setIsLoggedIn(false); // User is not logged in, show login/signup
      }
    });

    return () => unsubscribe();  // Clean up the listener on component unmount
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignUp = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    // Show MainPage for users who are not logged in
    return (
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{ headerShown: false }} // Hide header for MainPage
        />
        <Stack.Screen name="SignIn">
          {() => <SignIn onLogin={() => setIsLoggedIn(true)} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
        {() => <SignUp onSignUp={() => setIsLoggedIn(true)} />}
      </Stack.Screen>
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'About') {
            iconName = 'information-circle';
          } else if (route.name === 'Chat') {
            iconName = 'chatbubbles';
          } else if (route.name === 'Talk') {
            iconName = 'mic';
          } else if (route.name === 'Map') {
              iconName = 'map';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f8f8f8',
          borderTopWidth: 0,
          elevation: 50,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Talk" component={PushToTalk} />
      <Tab.Screen name="Map" component={Map} />
    </Tab.Navigator>
  );
  
}
