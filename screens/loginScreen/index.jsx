import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState([]);

  const handleLogin = async () => {
    try {
      // Kullanıcı girişi
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Giriş başarılı:", user);
  
      // Firestore'dan kullanıcı bilgilerini çek
      const userCollection = collection(firestore, "userInfo");
      const querySnapshot = await getDocs(userCollection);
  
      // Kullanıcı bilgilerini Firestore'dan al
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore'daki belge ID'si
        ...doc.data(), // Belgedeki diğer veriler
      }));
  
      console.log("Firestore'dan kullanıcılar:", users);
  
      // Giriş yapan kullanıcıyı bul
      const currentUser = users.find((u) => u.UID === user.uid);
      if (currentUser) {
        console.log("Giriş yapan kullanıcı bilgisi:", currentUser);
  
        // Kullanıcı bilgilerini AsyncStorage'a kaydet
        await AsyncStorage.setItem('userData', JSON.stringify(currentUser));
  
        // Kullanıcının rolüne göre yönlendirme
        if (currentUser.role.includes("admin")) {
          navigation.navigate("DoctorScreen");
        } else if (currentUser.role.includes("patient")) {
          navigation.navigate("UserMain");
        } else {
          console.log("Bilinmeyen rol:", currentUser.role);
        }
      } else {
        console.log("Firestore'da kullanıcı bilgisi bulunamadı.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default LoginScreen;
