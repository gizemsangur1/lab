import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserMain() {
	const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.firstrow}>
        <View style={styles.firstRowContent}>
          <Image style={styles.imageContainer} source={require("../../assets/profile.jpg")} />
          <Text style={styles.text}>Name:</Text>
          <Text style={styles.text}>Surname:</Text>
          <Text style={styles.text}>Age:</Text>
          <Text style={styles.text}>Sex:</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* 1. Satır */}
        <View style={styles.row}>
          <View style={styles.item}>
		  	<TouchableOpacity onPress={() => navigation.navigate('BloodTest')}>
            <Text>Tahlilleri görüntüle</Text>
			</TouchableOpacity>
          </View>
          <View style={styles.item}>
            <Text>Kullanıcı Ayarları</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  firstrow: {
    flex:1,
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  firstRowContent: {
    alignItems: "center",
    textAlign:"center"
  },
  text:{
    textAlign:"center",
    fontWeight:"bold",
    fontSize:20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  item: {
    width: "48%",
    height: 200,
    backgroundColor: "#C5D3E8",
    padding: 10,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer:{
    width:100,
    height:100,
    borderRadius:50,
    marginBottom:10
  },
});
