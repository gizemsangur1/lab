import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../FirebaseConfig";
import { calculateAge, formatDate } from "../../actions/generalFunctions";
import Icon from 'react-native-vector-icons/Ionicons';
import apJson from "../../json/ap.json";
import cilvJson from "../../json/cilv.json";
import tjpJson from "../../json/tjp.json";

export default function ViewPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const getIndicator = (value, type) => {
    const limits = type === "Ap" ? apJson : type === "Cilv" ? cilvJson : tjpJson;
    if (value < limits.min) {
      return { icon: "arrow-down-outline", color: "red" };
    } else if (value > limits.max) {
      return { icon: "arrow-up-outline", color: "green" };
    } else {
      return { icon: "arrow-forward-outline", color: "blue" };
    }
  };

  const handleSearch = async () => {
    try {
      const testCollection = collection(firestore, "patientTestResults");
      const userInfoCollection = collection(firestore, "userInfo");
      const querySnapshot = await getDocs(testCollection);

      const patients = querySnapshot.docs.map((doc) => doc.data());

      const enrichedPatients = await Promise.all(
        patients.map(async (patient) => {
          const userQuery = query(
            userInfoCollection,
            where("UID", "==", patient.patientUID)
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userInfo = userSnapshot.docs[0].data();
            patient.dateofbirth = userInfo.dateofbirth;
            patient.patientSurname = userInfo.patientSurname; // Soyadı ekleniyor
          }

          return patient;
        })
      );

      const filtered = enrichedPatients.filter(
        (patient) =>
          (patient.patientName &&
            patient.patientName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (patient.patientSurname &&
            patient.patientSurname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );

      setFilteredPatients(filtered);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Search by name..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Ara</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => {
            const age = calculateAge(patient.dateofbirth);

            return (
              <View key={index} style={styles.patientItem}>
                <Text style={styles.patientName}>
                  Name: {patient.patientName}
                </Text>
                <Text style={styles.patientInfo}>
                  Date of Test: {formatDate(patient.dateofTest)}
                </Text>
                <Text style={styles.patientInfo}>Age: {age}</Text>
                <View style={styles.table}>
                  <View style={styles.row}>
                    <Text style={styles.headerText}>Test Results:</Text>
                    <Text style={styles.headerText}>Ap</Text>
                    <Text style={styles.headerText}>Cilv</Text>
                    <Text style={styles.headerText}>Tjp</Text>
                  </View>
                  {patient.results &&
                  Array.isArray(patient.results) &&
                  patient.results.length > 0 ? (
                    patient.results.map((result, resultIndex) => (
                      <View key={resultIndex} style={styles.testResultContainer}>
                        {Object.entries(result).map(([key, value]) => {
                          const indicator = getIndicator(value, key);
                          return (
                            <View style={styles.row} key={key}>
                              <Text style={styles.testResultItem}>
                                {key}: {value || "N/A"}
                              </Text>
                              <Icon
                                name={indicator.icon}
                                size={20}
                                color={indicator.color}
                                style={{ marginLeft: 10 }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.patientInfo}>No test results available.</Text>
                  )}

                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noResultsText}>No results found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  textInput: {
    width: "80%",
    height: 45,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  searchButton: {
    width: "80%",
    height: 45,
    marginTop: 15,
    borderRadius: 7,
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    marginTop: 15,
  },
  patientItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  patientInfo: {
    fontSize: 16,
    color: "#555",
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  table: {
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cellText: {
    fontSize: 14,
    color: "#555",
  },
});  