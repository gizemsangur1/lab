import React from 'react'
import { Text, View } from 'react-native';

export default function BloodTest({route}) {
  const {date, id } = route.params;
  return (
	<View>
    <Text>Test ID: {id}</Text>
    <Text>Test Date: {date}</Text>
    
  </View>
  )
}
