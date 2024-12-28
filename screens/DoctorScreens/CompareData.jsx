import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import apData from "../../json/ap.json";
import cilvData from "../../json/cilv.json";
import tjpData from "../../json/tjp.json";

const calculateAgeInMonths = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  return years * 12 + months + (today.getDate() >= birth.getDate() ? 0 : -1);
};

const getComparisonResult = (value, min, max) => {
  if (value < min) return <Icon name="arrow-down-outline" size={20} color="red" />;
  if (value > max) return <Icon name="arrow-up-outline" size={20} color="green" />;
  return <Icon name="checkmark-outline" size={20} color="blue" />;
};

const CompareData = () => {
  const [age, setAge] = useState("");
  const [igA, setIgA] = useState("");
  const [igM, setIgM] = useState("");
  const [igG, setIgG] = useState("");
  const [igG1, setIgG1] = useState("");
  const [igG2, setIgG2] = useState("");
  const [igG3, setIgG3] = useState("");
  const [igG4, setIgG4] = useState("");
  const [comparisonResults, setComparisonResults] = useState([]);

  const handleSearch = () => {
    const ageMonths = parseInt(age, 10);
    const igAValue = parseFloat(igA);
    const igMValue = parseFloat(igM);
    const igGValue = parseFloat(igG);
    const igG1Value = parseFloat(igG1);
    const igG2Value = parseFloat(igG2);
    const igG3Value = parseFloat(igG3);
    const igG4Value = parseFloat(igG4);

    const guides = [
      { name: "AP Kılavuzu", data: apData.IgA },
      { name: "CILV Kılavuzu", data: cilvData.IgA },
      { name: "TJP Kılavuzu", data: tjpData.IgA },
    ];

    const results = guides.map((guide) => {
      const igARange = guide.data.find(
        (range) =>
          ageMonths >= range.min_age_month &&
          (range.max_age_month === null || ageMonths <= range.max_age_month)
      );

      return {
        guide: guide.name,
        IgA: igARange ? getComparisonResult(igAValue, igARange.min_val, igARange.max_val) : "N/A",
        IgM: igARange ? getComparisonResult(igMValue, igARange.min_val, igARange.max_val) : "N/A",
        IgG: igARange ? getComparisonResult(igGValue, igARange.min_val, igARange.max_val) : "N/A",
        IgG1: igARange ? getComparisonResult(igG1Value, igARange.min_val, igARange.max_val) : "N/A",
        IgG2: igARange ? getComparisonResult(igG2Value, igARange.min_val, igARange.max_val) : "N/A",
        IgG3: igARange ? getComparisonResult(igG3Value, igARange.min_val, igARange.max_val) : "N/A",
        IgG4: igARange ? getComparisonResult(igG4Value, igARange.min_val, igARange.max_val) : "N/A",
      };
    });

    setComparisonResults(results);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Kılavuz Karşılaştırma</Text>
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
      <TextInput
        style={styles.input}
        placeholder="IgG"
        value={igG}
        onChangeText={setIgG}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IgG1"
        value={igG1}
        onChangeText={setIgG1}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IgG2"
        value={igG2}
        onChangeText={setIgG2}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IgG3"
        value={igG3}
        onChangeText={setIgG3}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IgG4"
        value={igG4}
        onChangeText={setIgG4}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Karşılaştır</Text>
      </TouchableOpacity>
      <View style={styles.resultContainer}>
        {comparisonResults.map((result, index) => (
          <View key={index} style={styles.resultRow}>
            <Text style={styles.resultText}>{result.guide}</Text>
            <Text style={styles.resultText}>IgA: {result.IgA}</Text>
            <Text style={styles.resultText}>IgM: {result.IgM}</Text>
            <Text style={styles.resultText}>IgG: {result.IgG}</Text>
            <Text style={styles.resultText}>IgG1: {result.IgG1}</Text>
            <Text style={styles.resultText}>IgG2: {result.IgG2}</Text>
            <Text style={styles.resultText}>IgG3: {result.IgG3}</Text>
            <Text style={styles.resultText}>IgG4: {result.IgG4}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 16,
  },
  resultRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
  },
});

export default CompareData;
