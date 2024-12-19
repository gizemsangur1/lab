import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../FirebaseConfig"; 

export const fetchUserInfo = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "userInfo"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error fetching user info: ", error);
  }
};

fetchUserInfo();
