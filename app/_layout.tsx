import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Index from './index';
import About from './About';
import Chat from './Chat';
import PushToTalk from './PushToTalk';
import Map from './map';

const Tab = createBottomTabNavigator();

export default function RootLayout() {
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
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={Index} />
      <Tab.Screen name="About" component={About} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Talk" component={PushToTalk} />
      <Tab.Screen name="Map" component={Map} />
    </Tab.Navigator>
  );
}