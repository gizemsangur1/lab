import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../FirebaseConfig";
import Icon from "react-native-vector-icons/Ionicons";
import apData from '../../json/ap.json';
import cilvData from '../../json/cilv.json';
import tjpData from '../../json/tjp.json';

const guides = [
  { name: "A Kılavuzu", data: apData },
  { name: "B Kılavuzu", data: cilvData },
  { name: "C Kılavuzu", data: tjpData },
];

const CompareData = () => {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [igA, setIgA] = useState("");
  const [igM, setIgM] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);

  const handleSearch = async () => {
    try {
      const testCollection = collection(firestore, "patientTestResults");
      const q = query(testCollection, where("patientName", "==", patientName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setPatientData(data);
      } else {
        console.log("No matching documents.");
      }
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    }
  };

  const compareData = () => {
    const ageMonths = parseInt(age, 10);
    const igAValue = parseFloat(igA);
    const igMValue = parseFloat(igM);

    const results = guides.map((guide) => {
      const igARange = getRange(ageMonths, guide.data.IgA);
      const igMRange = getRange(ageMonths, guide.data.IgM);

      return {
        guide: guide.name,
        IgA: igARange ? getComparisonResult(igAValue, igARange) : "N/A",
        IgM: igMRange ? getComparisonResult(igMValue, igMRange) : "N/A",
      };
    });

    setComparisonResults(results);
  };

  useEffect(() => {
    if (patientData.length > 0) {
      compareData();
    }
  }, [patientData]);

  const getRange = (ageMonths, data) => {
    return data.find(
      (range) =>
        ageMonths >= range.min_age_month &&
        (range.max_age_month === null || ageMonths <= range.max_age_month)
    );
  };

  const getComparisonResult = (value, range) => {
    if (value < range.min_val) {
      return "düşük";
    } else if (value > range.max_val) {
      return "yüksek";
    } else {
      return "normal";
    }
  };

  const getArrowIcon = (currentValue, previousValue) => {
    if (currentValue < previousValue) {
      return <Icon name="arrow-down" size={20} color="red" />;
    } else if (currentValue > previousValue) {
      return <Icon name="arrow-up" size={20} color="green" />;
    } else {
      return <Icon name="swap-horizontal" size={20} color="blue" />;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Hasta Adı"
        value={patientName}
        onChangeText={setPatientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Yaş (ay)"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IgA"
        value={igA}
        onChangeText={setIgA}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IgM"
        value={igM}
        onChangeText={setIgM}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Ara</Text>
      </TouchableOpacity>
      <ScrollView>
        {comparisonResults.length > 0 ? (
          comparisonResults.map((result, index) => (
            <View key={index} style={styles.resultContainer}>
              <Text style={styles.resultText}>{result.guide}</Text>
              <Text style={styles.resultText}>IgA: {result.IgA}</Text>
              <Text style={styles.resultText}>IgM: {result.IgM}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noResultsText}>No results available.</Text>
        )}
        {patientData.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Önceki Sonuçlar:</Text>
            {patientData.map((data, index) => (
              <View key={index} style={styles.dataContainer}>
                <Text style={styles.dataText}>Tarih: {data.date}</Text>
                <Text style={styles.dataText}>IgA: {data.IgA}</Text>
                <Text style={styles.dataText}>IgM: {data.IgM}</Text>
                {index > 0 && (
                  <View style={styles.comparisonContainer}>
                    <Text style={styles.dataText}>
                      IgA: {getArrowIcon(data.IgA, patientData[index - 1].IgA)}
                    </Text>
                    <Text style={styles.dataText}>
                      IgM: {getArrowIcon(data.IgM, patientData[index - 1].IgM)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  resultContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  dataContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 10,
  },
  dataText: {
    fontSize: 16,
    marginBottom: 5,
  },
  comparisonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CompareData;