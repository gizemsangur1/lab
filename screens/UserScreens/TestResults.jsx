import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../FirebaseConfig";
import Icon from "react-native-vector-icons/Ionicons";

// Yaş hesaplama fonksiyonu
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

// Değer durum kontrol fonksiyonu
const checkValueStatus = (value, min, max) => {
  if (value < min)
    return <Icon name="arrow-down-outline" size={20} color="red" />;
  if (value > max)
    return <Icon name="arrow-up-outline" size={20} color="green" />;
  return <Icon name="arrow-forward-outline" size={20} color="blue" />;
};

const TestResultsTable = () => {
  const [patients, setPatients] = useState([]);
  const [guides, setGuides] = useState([]);

  // Verileri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const testCollection = collection(firestore, "patientTestResults");
        const guidesCollection = collection(firestore, "guides");
        const userInfoCollection = collection(firestore, "userInfo");

        // Rehber verilerini çek
        const guidesSnapshot = await getDocs(guidesCollection);
        const guidesData = guidesSnapshot.docs.map((doc) => doc.data());
        setGuides(guidesData);

        // Hasta verilerini çek
        const testSnapshot = await getDocs(testCollection);
        const patientsData = testSnapshot.docs.map((doc) => doc.data());

        const enrichedPatients = await Promise.all(
          patientsData.map(async (patient) => {
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

        setPatients(enrichedPatients);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>Name</Text>
          <Text style={[styles.cell, styles.headerCell]}>Age (Months)</Text>
          <Text style={[styles.cell, styles.headerCell]}>Hormone</Text>
          <Text style={[styles.cell, styles.headerCell]}>Value</Text>
          <Text style={[styles.cell, styles.headerCell]}>Status</Text>
        </View>

        {patients.map((patient, index) => {
          const ageMonths = calculateAge(patient.dateofbirth) * 12;

          return (
            <View key={index}>
              {patient.results.map((result, idx) => (
                Object.entries(result).map(([hormone, value]) => (
                  <View key={`${index}-${idx}-${hormone}`} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.nameCell]}>
                      {`${patient.patientName} ${patient.patientSurname}`}
                    </Text>
                    <Text style={styles.cell}>{ageMonths}</Text>
                    <Text style={styles.cell}>{hormone}</Text>
                    <Text style={styles.cell}>{value}</Text>
                    <Text style={styles.cell}>
                      {checkValueStatus(value, 0, 100)} {/* Min/Max Değerlerini Değiştir */}
                    </Text>
                  </View>
                ))
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#ddd",
    textAlign: "center",
  },
  nameCell: {
    flex: 2,
    textAlign: "left",
  },
});

export default TestResultsTable;
