import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { firestore } from "../../FirebaseConfig";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
export default function CreateGuide() {
  const [title, setTitle] = useState('');
  const [hormones, setHormones] = useState({});
  const hormoneList = ["IgG", "IgG1", "IgG2", "IgG3", "IgG4", "IgA", "IgM"];


  const addHormoneRange = (hormoneName) => {
    setHormones((prevState) => {
      const prevData = prevState[hormoneName] || [];
      return {
        ...prevState,
        [hormoneName]: [
          ...prevData,
          { min_val: "", max_val: "", min_age_month: "", max_age_month: "" },
        ],
      };
    });
  };


  const removeHormoneRange = (hormoneName, index) => {
    setHormones((prevState) => {
      const updatedRanges = prevState[hormoneName].filter((_, i) => i !== index);
      return {
        ...prevState,
        [hormoneName]: updatedRanges,
      };
    });
  };

 
  const updateHormoneRange = (hormoneName, index, field, value) => {
    setHormones((prevState) => {
      const updatedRanges = prevState[hormoneName].map((range, i) =>
        i === index ? { ...range, [field]: value } : range
      );
      return { ...prevState, [hormoneName]: updatedRanges };
    });
  };


 
   

    const createJsonFile = async () => {
      if (!title) {
        alert('Please enter a title');
        return;
      }
    
      const guideData = {
        title: title,
        ...hormones,
      };
    
      try {
        await addDoc(collection(firestore, 'guides'), guideData);
        alert('Guide successfully created!');
        setTitle('');
        setHormones({});
      } catch (error) {
        console.error('Error adding document: ', error);
        alert('Error creating guide');
      }
    };
    
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Kılavuz Başlığı</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Başlık girin"
      />
      {hormoneList.map((hormoneName) => (
        <View key={hormoneName} style={styles.hormoneSection}>
          <Text style={styles.hormoneTitle}>{hormoneName}</Text>
          <View style={styles.buttonRow}>
            <Button
              title={`Add Range to ${hormoneName}`}
              onPress={() => addHormoneRange(hormoneName)}
            />
          </View>
          {hormones[hormoneName]?.map((range, index) => (
            <View key={index} style={styles.rangeRow}>
              <TextInput
                style={styles.input}
                placeholder="Min Value"
                keyboardType="numeric"
                value={range.min_val}
                onChangeText={(value) =>
                  updateHormoneRange(hormoneName, index, "min_val", value)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Max Value"
                keyboardType="numeric"
                value={range.max_val}
                onChangeText={(value) =>
                  updateHormoneRange(hormoneName, index, "max_val", value)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Min Age (months)"
                keyboardType="numeric"
                value={range.min_age_month}
                onChangeText={(value) =>
                  updateHormoneRange(hormoneName, index, "min_age_month", value)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Max Age (months)"
                keyboardType="numeric"
                value={range.max_age_month}
                onChangeText={(value) =>
                  updateHormoneRange(hormoneName, index, "max_age_month", value)
                }
              />
              <Button
                title="Remove"
                onPress={() => removeHormoneRange(hormoneName, index)}
                color="red"
              />
            </View>
          ))}
        </View>
      ))}
      <TouchableOpacity onPress={createJsonFile} style={styles.button}>
        <Text>Create JSON File</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding:16,
  },
  hormoneSection: {
    marginBottom: 20,
  },
  hormoneTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 8,
  },
button:{
  backgroundColor: '#6200ee',
  padding: 15,
  borderRadius: 5,
  alignItems: 'center',
  marginBottom: 30,
},
 
});
