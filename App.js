import React from 'react';
import LoginScreen from './screens/loginScreen/index'; 
import RegisterScreen from './screens/registerScreen/index'; 
import UserMain from './components/userActions/userMain';
import ViewPatients from './screens/DoctorScreens/ViewPatients';
import DoctorMainScreen from './screens/DoctorScreens/DoctorMainScreen';
import CreateGuide from './screens/DoctorScreens/CreateGuide';
import BloodTests from './components/userActions/bloodTestResults';
import BloodTest from './screens/BloodTest/index';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DoctorScreen">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserMain" component={UserMain} />
        <Stack.Screen name="DoctorScreen" component={DoctorMainScreen} />
        <Stack.Screen name="ViewPatients" component={ViewPatients} />
        <Stack.Screen name="CreateGuide" component={CreateGuide} />
        <Stack.Screen name="BloodTests" component={BloodTests} />
        <Stack.Screen name="BloodTest" component={BloodTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
