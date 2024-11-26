import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

export default function BloodTestResults() {
  const navigation = useNavigation();

  const TestResults = [
    {
      id: 6,
      date: "12.11.2024",
    },
    {
      id: 5,
      date: "12.10.2024",
    },
    {
      id: 4,
      date: "03.09.2024",
    },
    {
      id: 3,
      date: "01.06.2024",
    },
    {
      id: 2,
      date: "03.04.2024",
    },

    {
      id: 1,
      date: "12.01.2024",
    },
  ];
  return (
    <ScrollView style={styles.scrollView}>
      {TestResults.map((item, index) => {
        return (
          <View style={styles.view}>
            <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("BloodTest", { date: item.date, id: item.id })
            }
          >
            <Text style={{fontSize:20,fontWeight:"bold"}}>Blood Test Results</Text>
          </TouchableOpacity>
          </View>
          
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: "100%",
  },
  view:{
    flex:1,
    backgroundColor:"#E2F1E7",
    margin:5,
    padding:10,
    borderRadius:"7px",
  }
});
