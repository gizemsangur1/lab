import React from 'react';
<<<<<<< HEAD
import LoginScreen from './components/loginScreen'; 
=======
import LoginScreen from './screens/loginScreen/index'; 
import RegisterScreen from './screens/registerScreen/index'; 
>>>>>>> gizem
import UserMain from './components/userActions/userMain';
import DoctorScreen from './screens/DoctorScreen';
import BloodTests from './components/userActions/bloodTestResults';
import BloodTest from './screens/BloodTest/index';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
<<<<<<< HEAD
=======
        <Stack.Screen name="Register" component={RegisterScreen} />
>>>>>>> gizem
        <Stack.Screen name="UserMain" component={UserMain} />
        <Stack.Screen name="DoctorScreen" component={DoctorScreen} />
        <Stack.Screen name="BloodTests" component={BloodTests} />
        <Stack.Screen name="BloodTest" component={BloodTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
