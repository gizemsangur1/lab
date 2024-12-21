import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firestore } from '../../FirebaseConfig'; // Firestore'u içe aktar

export default function CreateGuide() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateGuide = async () => {
    try {
      await firestore.collection('guides').add({
        title,
        description,
        createdAt: new Date(),
      });
      console.log('Guide Created:', { title, description });
      // Başarılı mesajı veya yönlendirme ekleyebilirsiniz
    } catch (error) {
      console.error('Error creating guide:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kılavuz Başlığı</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Başlık girin"
      />
      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Açıklama girin"
        multiline
      />
      <Button title="Kılavuz Oluştur" onPress={handleCreateGuide} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});