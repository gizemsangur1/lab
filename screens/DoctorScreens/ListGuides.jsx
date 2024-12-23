import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../FirebaseConfig";
import Icon from "react-native-vector-icons/Ionicons";

export default function ListGuides() {
  const [guides, setGuides] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const jsonCollection = collection(firestore, "guides");
        const guidesSnapshot = await getDocs(jsonCollection);
        const guidesData = guidesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGuides(guidesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchGuides();
  }, []);

  const handleDelete = async () => {
    if (!selectedGuide) return;

    try {
      await deleteDoc(doc(firestore, "guides", selectedGuide.id));
      setGuides(guides.filter((g) => g.id !== selectedGuide.id));
      setSelectedGuide(null);
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting guide: ", error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setOpenModal(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedGuide) return;

    try {
      await updateDoc(
        doc(firestore, "guides", selectedGuide.id),
        selectedGuide
      );
      setGuides((prevGuides) =>
        prevGuides.map((guide) =>
          guide.id === selectedGuide.id ? selectedGuide : guide
        )
      );
      setEditMode(false);
      setSelectedGuide(null);
    } catch (error) {
      console.error("Error updating guide: ", error);
    }
  };

  const renderGuide = ({ item }) => {
    const isEditing = editMode && selectedGuide?.id === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.titleRow}>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={selectedGuide?.title || ""}
              placeholder="Başlık girin"
              onChangeText={(text) =>
                setSelectedGuide((prev) => ({ ...prev, title: text }))
              }
            />
          ) : (
            <Text style={styles.title}>{item.title}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              setSelectedGuide(item);
              setOpenModal(true);
            }}
          >
            <Icon name="ellipsis-vertical-outline" size={20} />
          </TouchableOpacity>
        </View>

        {Object.keys(item).map((key) => {
          if (key !== "id" && key !== "title") {
            return (
              <View key={key}>
                <Text style={styles.sourceTitle}>{key}:</Text>
                {item[key]?.map((obj, index) => (
                  <View key={`${key}-${index}`} style={styles.row}>
                    {isEditing ? (
                      <>
                        <Text>Minimum Yaşı Girin:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={obj.min_age_month?.toString() || ""}
                          placeholder="Min yaş girin"
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            const updatedKey = [...selectedGuide[key]];
                            updatedKey[index].min_age_month =
                              text.trim() === ""
                                ? null
                                : parseInt(text, 10) || null;
                            setSelectedGuide((prev) => ({
                              ...prev,
                              [key]: updatedKey,
                            }));
                          }}
                        />

                        <Text>Maximum Yaşı Girin:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={obj.max_age_month?.toString() || ""}
                          placeholder="Max yaş girin"
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            const updatedKey = [...selectedGuide[key]];
                            updatedKey[index].max_age_month =
                              text === "" ? undefined : parseInt(text, 10);
                            setSelectedGuide((prev) => ({
                              ...prev,
                              [key]: updatedKey,
                            }));
                          }}
                        />
                        <Text>Minimum Değeri Girin:</Text>

                        <TextInput
                          style={styles.textInput}
                          value={obj.min_val?.toString() || ""}
                          placeholder="Min değer girin"
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            const updatedKey = [...selectedGuide[key]];
                            updatedKey[index].min_val =
                              text === "" ? undefined : parseInt(text, 10);
                            setSelectedGuide((prev) => ({
                              ...prev,
                              [key]: updatedKey,
                            }));
                          }}
                        />
                        <Text>Maximum Değeri Girin:</Text>

                        <TextInput
                          style={styles.textInput}
                          value={obj.max_val?.toString() || ""}
                          placeholder="Max değer girin"
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            const updatedKey = [...selectedGuide[key]];
                            updatedKey[index].max_val =
                              text === "" ? undefined : parseInt(text, 10);
                            setSelectedGuide((prev) => ({
                              ...prev,
                              [key]: updatedKey,
                            }));
                          }}
                        />
                      </>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            flexBasis: "48%",
                            marginRight: 5,
                            fontSize: 16,
                          }}
                        >
                          Age: {obj.min_age_month} - {obj.max_age_month} months,
                        </Text>
                        <Text style={{ flexBasis: "48%", fontSize: 16 }}>
                          Values: {obj.min_val} - {obj.max_val}{" "}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            );
          }
          return null;
        })}

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={renderGuide}
      />
      <Modal visible={openModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedGuide?.title} için işlem yap
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleEdit}>
              <Text style={{ color: "white" }}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={{ color: "white" }}>Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setOpenModal(false)}
            >
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  card: {
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#FF4C4C",
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  sourceTitle: {
    fontWeight: "bold",
    fontSize: 16,
    margin: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 5,
  },
});
