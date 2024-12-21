import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firestore } from "../../FirebaseConfig";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function DataEntry() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hormones, setHormones] = useState({});

  const hormoneList = ['IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4', 'IgA', 'IgM'];

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleHormoneChange = (key, value) => {
    setHormones({ ...hormones, [key]: value });
  };

  const saveTheData = async () => {
	try {
	  
	  const q = query(
		collection(firestore, 'patientTestResults'),
		where('patientName', '==', name),
		where('patientSurname', '==', surname)
	  );
  
	  const querySnapshot = await getDocs(q);
  
	  let patientUID;
  
	  if (!querySnapshot.empty) {
		
		querySnapshot.forEach((doc) => {
		  patientUID = doc.data().patientUID;
		});
		alert('Existing user found. Updating data.');
	  } else {
		
		patientUID = `UID-${Math.random().toString(36).substr(2, 9)}`;
		alert('New user detected. Creating data.');
	  }
  
	  
	  const data = {
		patientName: name,
		patientSurname: surname,
		patientUID: patientUID,
		birthday: birthday.toISOString(),
		results: [hormones],
	  };
  
	  await addDoc(collection(firestore, 'patientTestResults'), data);
	  alert('Data saved successfully!');
	} catch (error) {
	  console.error('Error saving data:', error);
	  alert('An error occurred while saving data.');
	}
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />

      <Text>Surname:</Text>
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
        placeholder="Enter surname"
      />

      <Text>Birthday:</Text>
      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      <Text>Selected Date: {birthday.toDateString()}</Text>

      <Text>Hormones:</Text>
      {hormoneList.map((hormone) => (
        <View key={hormone} style={styles.row}>
          <Text style={styles.hormoneLabel}>{hormone}:</Text>
          <TextInput
            style={styles.hormoneInput}
            value={hormones[hormone] || ''}
            onChangeText={(value) => handleHormoneChange(hormone, value)}
            placeholder="Enter level"
            keyboardType="numeric"
          />
        </View>
      ))}

      <Button title="Save" onPress={() => saveTheData()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hormoneLabel: {
    flex: 1,
    fontSize: 16,
  },
  hormoneInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});
