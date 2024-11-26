import React from 'react';
import LoginScreen from './components/loginScreen'; 
import UserMain from './components/userActions/userMain';
import BloodTest from './components/userActions/bloodTestResults';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserMain" component={UserMain} />
        <Stack.Screen name="BloodTest" component={BloodTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
