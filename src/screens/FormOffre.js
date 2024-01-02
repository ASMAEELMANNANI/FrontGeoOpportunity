import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background1 from '../components/Background1'
import Header1 from '../components/Header1'
import Button1 from '../components/Button1'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'

export default function FormOffre({ navigation }) {
  const [contrat, setContrat] = useState({ value: '', error: '' })
  const [libelle, setLibelle] = useState({ value: '', error: '' })
  const [dateCreation, setDateCreation] = useState({ value: '', error: '' })
  const [dateExpiration, setDateExpiration] = useState({ value: '', error: '' })
  const [description, setDescription] = useState({ value: '', error: '' })
  const [domaine, setDomaine] = useState({ value: '', error: '' })
 // const [entreprise, setEntreprise] = useState({ value: '', error: '' })

  const ValidatePressed = async () => {
    const contrat = nameValidator(firstname.value);
    const libelle = nameValidator(lastname.value);
    const dateCreation = emailValidator(username.value);
    const dateExpiration = passwordValidator(password.value);
    const description = nameValidator(phone.value);
    const domaine = nameValidator(adresse.value);
   // const entreprise = nameValidator(nom.value);
  
    if (domaine || description || dateExpiration || dateCreation || libelle || contrat) {
      
      return;
    }
  
    try {
        const data = {
            domaine: domaine.value,
            description: description.value,
            dateExpiration: dateExpiration.value,
            dateCreation: dateCreation.value,
            libelle: libelle.value,
            contrat: contrat.value,
          };
          
          const response = await fetch('http://192.168.11.103:8096/offre', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Change content type to JSON
            },
            body: JSON.stringify(data), // Convert data to JSON string
          });
  
      if (response.status === 200) {
        // Candidate creation successful
        // You may want to handle the response from the server, if needed.
        alert('Offre created successfully');
        // Reset the form or perform other necessary actions.
        setDomaine({ value: '', error: '' });
        setDescription({ value: '', error: '' });
        setDateExpiration({ value: '', error: '' });
        setDateCreation({ value: '', error: '' });
        setLibelle({ value: '', error: '' });
        setContrat({ value: '', error: '' });
      } else {
        console.error('ERREUR');
      }
    } catch (error) {
      console.error('Error  :', error);
      // Handle error accordingly, show error message, etc.
    }
  };
    
  
  return (
    <Background1>
      <BackButton goBack={navigation.goBack} />
      <Header1>Create Opportunity</Header1>
      <TextInput
        label="Libelle"
        returnKeyType="next"
        value={libelle.value}
        onChangeText={(text) => setLibelle({ value: text, error: '' })}
        error={!!libelle.error}
        errorText={libelle.error}
      />
       <TextInput
        label="Contrat"
        returnKeyType="next"
        value={contrat.value}
        onChangeText={(text) => setContrat({ value: text, error: '' })}
        error={!!contrat.error}
        errorText={contrat.error}
      />
      <TextInput
        label="Description"
        returnKeyType="next"
        value={description.value}
        onChangeText={(text) => setDescription({ value: text, error: '' })}
        error={!!description.error}
        errorText={description.error}
      />
      <TextInput
        label="Domaine"
        returnKeyType="next"
        value={domaine.value}
        onChangeText={(text) => setDomaine({ value: text, error: '' })}
        error={!!domaine.error}
        errorText={domaine.error}
        secureTextEntry
      />
      <PaperTextInput
        label="date Début"
        returnKeyType="next"
        value={dateCreation.value}
        onChangeText={(text) => setDateCreation({ value: text, error: '' })}
        error={!!dateCreation.error}
        errorText={dateCreation.error}
      />

      {/* Date Picker */}
      <DatePicker
        style={{ width: 200 }}
        date={dateCreation.value}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
        }}
        onDateChange={handleDateChange}
      />
      
      <PaperTextInput
        label="date Expiration"
        returnKeyType="next"
        value={dateExpiration.value}
        onChangeText={(text) => setDateExpiration({ value: text, error: '' })}
        error={!!dateExpiration.error}
        errorText={dateExpiration.error}
      />

      {/* Date Picker for Expiration Date */}
      <DatePicker
        style={{ width: 200 }}
        date={dateExpiration.value}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
        }}
        onDateChange={handleExpirationDateChange}
      />
      
      <Button1
        mode="contained"
        onPress={ValidatePressed}
        style={{ marginTop: 24 }}
      >
        Add
      </Button1>
    
    </Background1>
  )
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
})
