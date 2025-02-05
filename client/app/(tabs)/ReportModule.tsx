import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface ReportModuleProps {
  photoData: { uri: string; base64: string };
}

const GOOGLE_API_KEY = "AIzaSyCUJkFWOgnYD16leOFtHuxDfKGEMY95yZg";

// Componente dropdown personalizzato
const CustomDropdown = ({
  options,
  selectedValue,
  onValueChange,
  placeholder,
}: {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (option: { label: string; value: string }) => {
    onValueChange(option.value);
    setVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setVisible(!visible)}
      >
        <Text style={{ color: selectedValue ? "#fff" : "#aaa" }}>
          {selectedValue ? selectedValue : placeholder}
        </Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => handleSelect(option)}
            >
              <Text style={{ color: "#fff" }}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function ReportModule({ photoData }: ReportModuleProps) {
  const [titolo, setTitolo] = useState("");
  const [tipo, setTipo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [posizione, setPosizione] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {
    setLoading(true);
    const payload = {
      titolo,
      tipo,
      descrizione,
      posizione,
      immagine: photoData.base64,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        Alert.alert("Successo", "Report inviato con successo!");
      } else {
        Alert.alert("Errore", "Errore nell'invio del report.");
      }
    } catch (error: any) {
      Alert.alert("Errore", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <View>
      <Text style={styles.header}>Nuovo Report</Text>

      <Text style={styles.label}>Titolo</Text>
      <TextInput
        style={styles.input}
        value={titolo}
        onChangeText={setTitolo}
        placeholder="Inserisci il titolo del report"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Tipo</Text>
      <CustomDropdown
        options={[
          { label: "Caditoie e Tombini", value: "Caditoie e Tombini" },
          { label: "Buche", value: "Buche" },
          { label: "Illuminazione", value: "Illuminazione" },
          { label: "Pericolo Generico", value: "Pericolo Generico" },
        ]}
        selectedValue={tipo}
        onValueChange={setTipo}
        placeholder="Seleziona un tipo"
      />

      <Text style={styles.label}>Descrizione (opzionale)</Text>
      <TextInput
        style={styles.input}
        value={descrizione}
        onChangeText={setDescrizione}
        placeholder="Inserisci una breve descrizione"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Posizione</Text>
      <GooglePlacesAutocomplete
  placeholder="Cerca un indirizzo"
  onPress={(data, details = null) => {
    setPosizione(data.description);
  }}
  query={{
    key: GOOGLE_API_KEY,
    language: "it",
  }}
  fetchDetails={true}
  textInputProps={{
    value: posizione,
    onChangeText: (text) => setPosizione(text),
    placeholderTextColor: "#aaa",
  }}
  listViewProps={{ nestedScrollEnabled: true }}
  styles={{
    container: {
      flex: 0,
      marginBottom: 10,
      backgroundColor: "#1e1e1e",
      borderRadius: 5,
    },
    textInput: {
      ...styles.input,
      backgroundColor: "#1e1e1e",
      color: "#fff",
      borderColor: "#444",
    },
    listView: {
      backgroundColor: "#1e1e1e",
      borderRadius: 5,
      marginHorizontal: 5,
    },
    row: {
      backgroundColor: "#1e1e1e",
      borderBottomColor: "#444",
      borderBottomWidth: 1,
    },
    description: {
      color: "#fff",
    },
    predefinedPlacesDescription: {
      color: "#fff",
    },
    poweredContainer: {
      backgroundColor: "#1e1e1e",
    },
  }}
/>


      <Text style={styles.label}>Immagine</Text>
      <Image source={{ uri: photoData.uri }} style={styles.imagePreview} />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
          <Text style={styles.submitButtonText}>Invia Report</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {renderForm()}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  label: {
    fontSize: 18,
    marginTop: 15,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: "#fff",
    backgroundColor: "#1e1e1e",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },

  dropdownContainer: {
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
});
