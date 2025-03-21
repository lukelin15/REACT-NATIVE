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
import Onboarding from './Onboarding';
import Route from './Route';
import CategoryPage from './CategoryPage';
import Cart from './Cart';
import AllMenu from './AllMenu';
import CartIcon from '../components/CartIcon';
import { CartProvider } from '../lib/CartContext';
import { auth, db } from '@/lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <CartIcon />,
      })}
    >
      <Stack.Screen name="Home" component={Index} />
      <Stack.Screen name="ItemsYouMightNeed" component={ItemsYouMightNeed} />
      <Stack.Screen 
        name="CategoryPage" 
        component={CategoryPage} 
        options={({ route }) => ({ 
          title: (route.params as { category?: string })?.category || 'Shop by Category' 
        })}
      />
      <Stack.Screen 
        name="Cart" 
        component={Cart} 
        options={{
          title: 'Your Cart'
        }}
      />
      <Stack.Screen 
        name="AllMenu" 
        component={AllMenu} 
        options={{
          title: "Today's Special"
        }}
      />
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid, 'AllAboutUser', 'profile'));
          const userData = userDoc.data();
          setIsLoggedIn(userData?.onboardingCompleted ?? false);
        } catch (error) {
          console.error('Error checking user profile:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isLoggedIn) {
    return (
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SignIn">
          {() => <SignIn onLogin={() => setIsLoggedIn(true)} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {() => <SignUp onSignUp={() => setIsLoggedIn(true)} />}
        </Stack.Screen>
        <Stack.Screen 
          name="Onboarding" 
          options={{ headerShown: false }}
        >
          {() => <Onboarding setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <CartProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <CartIcon />,
          tabBarIcon: ({ color, size }) => {
            let iconName: "home" | "information-circle" | "person-circle" | "chatbubbles" |'map'| "mic" = "home";
    
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Chat':
                iconName = 'chatbubbles';
                break;
              case 'Talk':
                iconName = 'mic';
                break;
              case 'About':
                iconName = 'information-circle';
                break;
              case 'Profile':
                iconName = 'person-circle';
                break;
              case 'Route':
                iconName = 'map';
                break;
            }
    
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: '#f8f8f8',
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            height: 65,
            paddingBottom: 10,
          },
          
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 5,
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
        <Tab.Screen name="Profile" component={Profile}/>
        <Tab.Screen name="About" component={About} />
      </Tab.Navigator>
    </CartProvider>
  );
}
