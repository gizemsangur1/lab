import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { ScrollView, View,StyleSheet, TouchableOpacity, Text } from 'react-native'

export default function BloodTestResults() {
  const navigation=useNavigation();
  return (
    <ScrollView style={styles.scrollView}>
      <TouchableOpacity onPress={() => navigation.navigate("BloodTest", { id: 42 })}>
         <Text>BloodTestResults</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("BloodTest", { id: 43 })}>
         <Text>BloodTestResults</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("BloodTest", { id: 44 })}>
         <Text>BloodTestResults</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("BloodTest", { id: 45 })}>
         <Text>BloodTestResults</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("BloodTest", { id: 46 })}>
         <Text>BloodTestResults</Text>
      </TouchableOpacity>

    </ScrollView>
	
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: "100%",
  },
});
