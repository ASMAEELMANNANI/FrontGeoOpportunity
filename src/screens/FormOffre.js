import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback ,Alert,Image,ScrollView} from 'react-native';
import { Text } from 'react-native-paper';
import Background1 from '../components/Background1';
import Header1 from '../components/Header1';
import Button1 from '../components/Button1';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { nameValidator } from '../helpers/nameValidator';
import DatePicker from 'react-native-modern-datepicker';
import { useRoute } from '@react-navigation/native';
import Search from  '../components/search';
import { Picker } from '@react-native-picker/picker';


export default function RegisterScreen({ route, navigation }) {

  const { recID } = route.params;
  const [libelle, setLib] = useState({ value: '', error: '' });
  const [dateCreation, setDateCreation] = useState();
  const [datePickerVisible, setDatePickerVisible] = useState(null);

  const [dateExpiration, setdateExpiration] = useState();
  const [datePickerVisible1, setDatePickerVisible1] = useState(null);

  const [description, setdescription] = useState({ value: '', error: '' });
  const [domaine, setdomain] = useState({ value: '', error: '' });

  const [contrat, setcontract] = useState({ label: '', value: '' });
  const [ville, setVille] = useState({ label: '', value: '' });

 
  /**
   * 
   * @returns Autocomplete Place
   */
  
   // Use state to manage the location input value
   const [location, setLocation] = useState({ value: '', error: '' });

   const [selectedLocation, setSelectedLocation] = useState({ latitude: 0.0, longitude: 0.0 });

   const onLocationSelect = (location) => {
     setSelectedLocation(location);
   };

  const onSignUpPressed = async () => {

     // Log the selected location before sending the request
     console.log('Selected Location:', selectedLocation);


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
      const response = await fetch('http://192.168.11.105:8222/offre/Add', {
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
              "longitude": selectedLocation.longitude,
              "latitude": selectedLocation.latitude,
              "ville": ville.value,
              "feedbacks": [],
              "candidats": [],
              "entreprise": {
                "id": recID
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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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

<View style={styles.pickerContainer}>
        <Picker
          selectedValue={domaine.value}
          onValueChange={(itemValue, itemIndex) => setdomain({ value: itemValue, error: '' })}
        >
          <Picker.Item label="Select domain" value="" />
          <Picker.Item label="Software" value="Software" />
          <Picker.Item label="Data Science" value="Data Science" />
          <Picker.Item label="Cloud Computing" value="Cloud Computing" />
          <Picker.Item label="Marketing" value="Marketing" />
          <Picker.Item label="HR" value="HR" />
           <Picker.Item label="Finance" value="Finance" />
        </Picker>
      </View>

    

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={contrat.value}
          onValueChange={(itemValue, itemIndex) => setcontract({ value: itemValue, error: '' })}
        >
          <Picker.Item label="Select Contract" value="" />
          <Picker.Item label="Intership" value="Intership" />
          <Picker.Item label="CDD" value="CDD" />
          <Picker.Item label="CDI" value="CDI" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ville.value}
          onValueChange={(itemValue, itemIndex) => setVille({ value: itemValue, error: '' })}
        >
          <Picker.Item label="Select City" value="" />
          <Picker.Item label="Casablanca" value="Casablanca" />
          <Picker.Item label="Rabat" value="Rabat" />
          <Picker.Item label="Mohammedia" value="Mohammedia" />
          <Picker.Item label="Tanger" value="Tanger" />
          <Picker.Item label="Marrakech" value="Marrakech" />
          <Picker.Item label="Agadir" value="Agadir" />
          <Picker.Item label="Sale" value="Sale" />
          <Picker.Item label="Kenitra" value="Kenitra" />
        </Picker>
      </View>

     
      <Search 
        id="location" // Provide a unique ID for the search component
        placeholder="Location"
        onClearInput={() => setLocation({ value: '', error: '' })}
        accessToken="pk.eyJ1IjoibWVyaWVtZWwiLCJhIjoiY2xwMzhqanNuMHlwajJqcnBkOXdhajMwNCJ9.Dpk2oasn1cyqgHiyREyJlA" // Replace with your Mapbox access token
        onChangeText={(text) => setLocation({ value: text, error: '' })}
        onLocationSelect={onLocationSelect}
      />

      


      <Button1 mode="contained" onPress={onSignUpPressed} style={{ marginTop: 24 }}>
        Add
      </Button1>
      
    </Background1>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
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
  pickerContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 5,
    width: '100%',
  },
  
});
