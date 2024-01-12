import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import Background1 from '../components/Background1';
import Header1 from '../components/Header1';
import Button1 from '../components/Button1';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { nameValidator } from '../helpers/nameValidator';
import DatePicker from 'react-native-modern-datepicker';
import RNPickerSelect  from 'react-native-picker-select';


export default function RegisterScreen({ navigation }) {
  const [libelle, setLib] = useState({ value: '', error: '' });
  const [dateCreation, setDateCreation] = useState();
  const [datePickerVisible, setDatePickerVisible] = useState(null);

  const [dateExpiration, setdateExpiration] = useState();
  const [datePickerVisible1, setDatePickerVisible1] = useState(null);

  const [description, setdescription] = useState({ value: '', error: '' });
  const [domaine, setdomain] = useState({ value: '', error: '' });

  const [contrat, setcontract] = useState({ label: '', value: '' });
  const [ville, setVille] = useState({ label: '', value: '' });

  

  const onSignUpPressed = async () => {
    const LibError = nameValidator(libelle.value);
    const dateCreationError = nameValidator(dateCreation);
    const dateExpirationError = nameValidator(dateExpiration);
    const DescriptionError = nameValidator(description.value);
    const DomaineError = nameValidator(domaine.value);
    const contractError = nameValidator(contrat.value);
    const CityError = nameValidator(ville.value);

    // Log the values before sending the request
    console.log('Label :', libelle.value);
    console.log('Date Start:', dateCreation );
    console.log('Expiry date:', dateExpiration );

    console.log('Description:', description.value);
    console.log('Domain:', domaine.value);
    console.log('contract:', contrat.value);

    if (LibError || dateCreationError || dateExpirationError || DescriptionError || DomaineError || contractError) {
      setLib({ ...libelle, error: LibError });
      setdateExpiration({ ...libelle, error: dateCreationError });
      setdescription({ ...description, error: dateExpirationError });
      setdomain({ ...domaine, error: DomaineError });
      setcontract({ ...contrat, error: contractError });
      return;
    }

    

    try {
      const response = await fetch('http://192.168.11.103:8222/offre/Add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              "libelle": libelle.value,
              "dateCreation": dateCreation,
              "dateExpiration": dateExpiration,
              "description": description.value,
              "domaine": domaine.value,
              "contrat": contrat.value,
              "longitude": 0.0,
              "latitude": 0.0,
              "ville": ville.value,
              "feedbacks": [],
              "candidats": [],
              "entreprise": {
                "id": 1
              }
         
          

        }),
      });

      if (response.status === 200) {
      
        console.log('Offer created successfully');
        alert('Offer created successfully');
        // Reset the form or perform other necessary actions.
        setLib({ value: '', error: '' });
        setdomain({ value: '', error: '' });
        setDateCreation();
        setdateExpiration();
        setdescription({value: '', error: ''});
        setcontract({value: '', error: ''});
        setVille({value: '', error: ''});
        
      } else {
        console.error('Try again');
      }
    } catch (error) {
      console.error('Error during Offer creation:', error);
      // Handle the error accordingly, show an error message, etc.
    }
  };

  return (
    <Background1>
      <BackButton goBack={navigation.goBack} />
      <Header1>Add A New Offer </Header1>
      <TextInput
        label="Label"
        returnKeyType="next"
        value={libelle.value}
        onChangeText={(text) => setLib({ value: text, error: '' })}
        error={!!libelle.error}
        errorText={libelle.error}
      />

      <TouchableWithoutFeedback onPress={() => setDatePickerVisible(true)}>
        <View style={styles.datePickerContainer}>
          <Text>{dateCreation ? dateCreation : 'Select Date Start'}</Text>
        </View>
      </TouchableWithoutFeedback>

      <Modal visible={datePickerVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DatePicker
              mode="calendar" // or "spinner"
              onDateChange={(date) => {
                console.log('Selected Date:', date);
                //setDateCreation(date);
                setDateCreation(date.replace(/\//g, '-'));
                setDatePickerVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <TouchableWithoutFeedback onPress={() => setDatePickerVisible1(true)}>
        <View style={styles.datePickerContainer}>
          <Text>{dateExpiration ? dateExpiration : 'Select  expiry date'}</Text>
        </View>
      </TouchableWithoutFeedback>

      <Modal visible={datePickerVisible1} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DatePicker
              mode="calendar" // or "spinner"
              onDateChange={(date) => {
                console.log('Selected Date:', date);
                //setdateExpiration(date);
                setdateExpiration(date.replace(/\//g, '-'));
                setDatePickerVisible1(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <TextInput
        label="Description"
        returnKeyType="next"
        value={description.value}
        onChangeText={(text) => setdescription({ value: text, error: '' })}
        error={!!description.error}
        errorText={description.error}
      />

      <TextInput
        label="Domain"
        returnKeyType="next"
        value={domaine.value}
        onChangeText={(text) => setdomain({ value: text, error: '' })}
        error={!!domaine.error}
        errorText={domaine.error}
      />

    <TextInput
        label="Contract"
        returnKeyType="next"
        value={contrat.value}
        onChangeText={(text) => setcontract({ value: text, error: '' })}
        error={!!contrat.error}
        errorText={contrat.error}
      />

      <TextInput
        label="City"
        returnKeyType="next"
        value={ville.value}
        onChangeText={(text) => setVille({ value: text, error: '' })}
        error={!!ville.error}
        errorText={ville.error}
      />

      


      <Button1 mode="contained" onPress={onSignUpPressed} style={{ marginTop: 24 }}>
        Add
      </Button1>
      
    </Background1>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },

  datePickerContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary, // You can set your desired border color
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300, // set your desired width
    height: 400, // set your desired height
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
 
});
