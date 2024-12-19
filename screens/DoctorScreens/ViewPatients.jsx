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

export default function ViewPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  const handleSearch = async () => {
	try {
	  const testCollection = collection(firestore, "patientTestResults");
	  const userInfoCollection = collection(firestore, "userInfo");
	  const querySnapshot = await getDocs(testCollection);
  
	  const patients = querySnapshot.docs.map((doc) => doc.data());
  
	  const enrichedPatients = await Promise.all(
		patients.map(async (patient) => {
		  const userQuery = query(userInfoCollection, where("UID", "==", patient.patientUID));
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
		  (patient.patientName && patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
		  (patient.patientSurname && patient.patientSurname.toLowerCase().includes(searchQuery.toLowerCase()))
	  );
  
	  setFilteredPatients(filtered);
	} catch (error) {
	  console.error("Error fetching data: ", error);
	}
  };
  
  const formatDate = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";

    if (dateOfBirth.seconds) {
      const date = new Date(dateOfBirth.seconds * 1000);
      return date.toDateString();
    }

    return dateOfBirth.toString();
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
            // Calculate age
            const calculateAge = (dateOfBirth) => {
              if (!dateOfBirth) return "N/A";
              const birthDate = new Date(dateOfBirth.seconds * 1000);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              return age;
            };

            const age = calculateAge(patient.dateofbirth);

            return (
              <View key={index} style={styles.patientItem}>
                <Text style={styles.patientName}>
                  Name: {patient.patientName}
                </Text>
               {/*  <Text style={styles.patientInfo}>
                  Date of Birth: {formatDate(patient.dateofbirth)}
                </Text> */}
                <Text style={styles.patientInfo}>Date of Test:  {formatDate(patient.dateofTest)}</Text>
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
});
