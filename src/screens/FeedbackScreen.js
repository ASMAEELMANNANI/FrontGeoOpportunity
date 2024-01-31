import React, { useState,useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const FeedbackScreen = ({ route, navigation }) => {
 
  
  const { candidateId } = route.params;

  const [selectedCompany, setSelectedCompany] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch companies from API
    fetch('http://192.168.11.105:8222/entreprise')
      .then((response) => response.json())
      .then((data) => {
        // Extract company names from the API response
       // const companyNames = data.map((company) => company.nom);
        //setCompanies(companyNames);
        setCompanies(data);
      })
      .catch((error) => console.error('Error fetching companies:', error));
  }, []);

  const handleSubmit = async () => {
    try {
      const selectedCompanyObject = companies.find(
        (company) => company.nom === selectedCompany
      );

      if (!selectedCompanyObject) {
        // Handle the case where the selected company is not found
        Alert.alert('Error', 'Selected company not found');
        return;
      }

      const response = await fetch('http://192.168.11.105:8222/feedback/AddFeed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: feedbackText,
          date: new Date().toISOString(),
          candidat: { id: candidateId },
          entreprise: { id: selectedCompanyObject.id },
        }),
      });

      if (response.ok) {
        // Feedback added successfully
        Alert.alert('Success', 'Feedback added successfully');
      } else {
        // Failed to add feedback
        Alert.alert('Error', 'Failed to add feedback');
      }
    } catch (error) {
      console.error('Error adding feedback:', error);
      Alert.alert('Error', 'Failed to add feedback');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Share your feedback</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select one company : </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCompany}
            onValueChange={(itemValue) => setSelectedCompany(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Shose One ..." value="" />
            {companies.map((company, index) => (
              <Picker.Item key={index} label={company.nom} value={company.nom} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Write your feedback : </Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          placeholder="Enter your feedback here..."
          value={feedbackText}
          onChangeText={(text) => setFeedbackText(text)}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,

    marginBottom: 100,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 70,
  },
  label: {
    marginBottom: 8,
    color: '#555',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#1B4077',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;
