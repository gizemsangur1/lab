import React from 'react';
import LoginScreen from './screens/loginScreen/index'; 
import RegisterScreen from './screens/registerScreen/index'; 
import UserMain from './screens/UserScreens/UserMainScreen';
import ViewPatients from './screens/DoctorScreens/ViewPatients';
import DoctorMainScreen from './screens/DoctorScreens/DoctorMainScreen';
import CreateGuide from './screens/DoctorScreens/CreateGuide';
import TestResults from './screens/UserScreens/TestResults';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserMain" component={UserMain} />
        <Stack.Screen name="DoctorScreen" component={DoctorMainScreen} />
        <Stack.Screen name="ViewPatients" component={ViewPatients} />
        <Stack.Screen name="CreateGuide" component={CreateGuide} />
        <Stack.Screen name="TestResults" component={TestResults} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
