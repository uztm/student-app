import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Octicons } from '@expo/vector-icons'; // Import Octicons icons
import HomeScreen from './screens/HomeSreen';
import AnalyticsComponent from './screens/Analitics';
import SignInScreen from './screens/SignInScreen';
import SettingsScreen from './screens/SettingsScreen';

// New Screens
function CoursesScreen() {
  return (
    <View style={styles.container}>
      <Text>Courses Screen</Text>
    </View>
  );
}

function AnalyticsScreen() { 
  return (
    <View style={styles.container}>
      <AnalyticsComponent/>
    </View>
  );
}

const users = [
  {  name: 'Bekzod', username: 'tmBekzod', password: '1225', verification: '550055' },
  { name: 'Farrux', username: 'khalid', password: '1930', verification: '193005' },
  { name: 'Timurbek', username: 'Timurbek', password: '199505', verification: '123456' },
  { name: 'Aflotun', username: 'aflotun', password: '123456', verification: '123456' },
  { name: '123', username: '123', password: '123', verification: '550055' },
  { name: 'Azamat', username: 'azamat', password: 'azamat2005@', verification: '777777' },
  { name: 'Odilbek', username: 'Pdp2022', password: 'pdp2022', verification: '777777' },
  // Add more users if needed
];

const Tab = createBottomTabNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null); // To store the signed-in user data

  // Function to handle successful sign-in
  const handleSignIn = (userData) => {
    setIsSignedIn(true);
    setUser(userData);
  };

  // Check if the user is signed in, if not, show the SignInScreen
  if (!isSignedIn) {
    return <SignInScreen users={users} onSignIn={handleSignIn} />;
  }

  // If the user is signed in, show the main tab navigator
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Courses') {
              iconName = 'book'; // Assuming you have an icon for courses
            } else if (route.name === 'Analytics') {
              iconName = 'graph'; // Assuming you have an icon for analytics
            } else if (route.name === 'Settings') {
              iconName = 'apps';
            }

            // Set active and non-active icon colors
            iconColor = focused ? '#5730FB' : '#777A7D';

            // Adjust the icon size based on the height you want for the tab bar
            const iconSize = focused ? 28 : 22;

            // Return your Octicons icon here with the specified color and size
            return <Octicons name={iconName} size={iconSize} color={iconColor} />;
          },
          tabBarStyle: {
            backgroundColor: '#FFFFFF', // Add a background color if needed
            height: 95, // Set the desired height for the tab bar
            paddingBottom: 35,
            paddingTop: 15
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{
          headerTitle: ' ',
          headerLeft: () => (
            <View style={{ paddingLeft: 20 }}>
              {user && <Text style={{ fontWeight: '700', fontSize: 18 }}>{user.name}</Text>}
            </View>
          ),
          headerRight: () => (
            <View style={{ paddingRight: 20 }}>
              <Octicons name="bell" size={24} color="#5730FB" />
            </View>
          ),
        }} />
        <Tab.Screen name="Courses" component={CoursesScreen} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
