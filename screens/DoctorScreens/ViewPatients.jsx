import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import apJson from "../../json/ap.json";
import cilvJson from "../../json/cilv.json";
import tjpJson from "../../json/tjp.json";
import Icon from "react-native-vector-icons/Ionicons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../FirebaseConfig";

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const checkValueStatus = (value, min, max) => {
  if (value < min)
    return <Icon name="arrow-down-outline" size={20} color="red" />;
  if (value > max)
    return <Icon name="arrow-up-outline" size={20} color="green" />;
  return <Icon name="arrow-forward-outline" size={20} color="blue" />;
};

const compareWithPrevious = (current, previous) => {
  if (previous === null || previous === undefined) return "No previous data";
  if (current > previous) return "Increased";
  if (current < previous) return "Decreased";
  return "Unchanged";
};

const ViewPatients = () => {
  const [jsonData, setJsonData] = useState({ ap: null, cilv: null, tjp: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    setJsonData({ tjp: tjpJson, ap: apJson, cilv: cilvJson });
  }, []);

  const handleSearch = async () => {
    try {
      const testCollection = collection(firestore, "patientTestResults");
      const jsonCollection = collection(firestore, "guides");
      const userInfoCollection = collection(firestore, "userInfo");
      const querySnapshot = await getDocs(testCollection);
      const guidesQuerySnapshot = await getDocs(jsonCollection);
      const guides = guidesQuerySnapshot.docs.map((doc) => doc.data());
      setGuides(guides);

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

  const renderPatientItem = ({ item }) => {
    const ageMonths = calculateAge(item.birthday) * 12;
    const results = item.results[0];
    const previousResults = item.previousResults || {}; // Önceki sonuçlar için varsayılan yapı

    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {`${item.patientName} ${item.patientSurname}`}
        </Text>
        <Text>{`Age: ${ageMonths} months`}</Text>
        {Object.keys(guides).map((source) => {
          const sourceData = guides[source];
          if (!sourceData) return null;

          return (
            <View key={source}>
              <Text style={styles.sourceTitle}>{`Source: ${sourceData.title}`}</Text>
              {Object.keys(results).map((hormone) => {
                const value = parseFloat(results[hormone]);
                const previousValue = parseFloat(previousResults[hormone]);
                const hormoneRanges = guides[source]?.[hormone];

                if (!hormoneRanges) return null;

                return hormoneRanges.map((range, idx) => {
                  if (
                    ageMonths >= range.min_age_month &&
                    (range.max_age_month === null ||
                      ageMonths <= range.max_age_month)
                  ) {
                    const status = checkValueStatus(
                      value,
                      range.min_val,
                      range.max_val
                    );
                    const comparison = compareWithPrevious(value, previousValue);

                    return (
                      <View key={idx} style={styles.row}>
                        <Text>{`${hormone}: ${value}`}</Text>
                        {status}
                        <Text style={styles.comparison}>{` (${comparison})`}</Text>
                      </View>
                    );
                  }
                  return null;
                });
              })}
            </View>
          );
        })}
      </View>
    );
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
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredPatients}
        keyExtractor={(item, index) => `${item.patientUID}-${index}`}
        renderItem={renderPatientItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  comparison: {
    marginLeft: 10,
    fontStyle: "italic",
    color: "#888",
  },
});

export default ViewPatients;
