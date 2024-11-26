import React from 'react'
import { Text, View } from 'react-native';

export default function BloodTest({route}) {
  const { id } = route.params;
  return (
	<View>
    <Text>User ID: {id}</Text>
  </View>
  )
}
