import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../FirebaseConfig";
import { calculateAge, formatDate } from "../../actions/generalFunctions";

export default function TestResults() {
  const [user, setUser] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await userTestResults(); 
    setRefreshing(false);
  }, [user]); 

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Kullanıcı bilgisi alınırken hata:", error);
    }
  };

  const userTestResults = async () => {
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
            patient.patientSurname = userInfo.patientSurname;
          }

          return patient;
        })
      );

      const filtered = enrichedPatients.filter(
        (patient) =>
          (patient.patientName &&
            user.name &&
            patient.patientName
              .toLowerCase()
              .includes(user.name.toLowerCase())) ||
          (patient.patientSurname &&
            user.surname &&
            patient.patientSurname
              .toLowerCase()
              .includes(user.surname.toLowerCase()))
      );

      setFilteredPatients(filtered);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user.name && user.surname) {
      userTestResults();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                <Text style={styles.patientInfo}>Test Results:</Text>
                {patient.results &&
                Array.isArray(patient.results) &&
                patient.results.length > 0 ? (
                  patient.results.map((result, resultIndex) => (
                    <View key={resultIndex} style={styles.testResultContainer}>
                      {Object.entries(result).map(([key, value]) => (
                        <Text key={key} style={styles.testResultItem}>
                          {key}: {value || "N/A"}
                        </Text>
                      ))}
                    </View>
                  ))
                ) : (
                  <Text style={styles.patientInfo}>
                    No test results available.
                  </Text>
                )}
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
});
