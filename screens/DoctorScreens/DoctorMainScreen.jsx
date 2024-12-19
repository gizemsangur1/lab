import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DoctorMainScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 1. Satır */}
        <View style={styles.row}>
          <View style={styles.item}>
            <TouchableOpacity onPress={() => navigation.navigate("CreateGuide")}>
              <Text>Kılavuz Oluşturma</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <Text>Veri Girişi</Text>
          </View>
        </View>

        {/* 2. Satır */}
        <View style={styles.row}>
          <View style={styles.item}>
          <TouchableOpacity onPress={() => navigation.navigate("ViewPatients")}>
             <Text>Hasta Görüntüleme</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.item}>
            <Text>Tahlilleri Listele</Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
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
});
