import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import LoginScreen from "./components/loginScreen";
export default function App() {
  return (
    <LoginScreen/>
  );
}
