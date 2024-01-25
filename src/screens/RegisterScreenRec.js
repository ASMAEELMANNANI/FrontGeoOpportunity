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

export default function RegisterScreen({ navigation }) {
  const [firstname, setName] = useState({ value: '', error: '' })
  const [lastname, setLastName] = useState({ value: '', error: '' })
  const [username, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [phone, setPhone] = useState({ value: '', error: '' })
  const [adresse, setAdressse] = useState({ value: '', error: '' })
  const [nom, setNom] = useState({ value: '', error: '' })

  const onSignUpPressed = async () => {
    const nameError = nameValidator(firstname.value);
    const lastNameError = nameValidator(lastname.value);
    const emailError = emailValidator(username.value);
    const passwordError = passwordValidator(password.value);
    const phoneError = nameValidator(phone.value);
    const AdresseError = nameValidator(adresse.value);
    const NomError = nameValidator(nom.value);
  
    if (emailError || passwordError || nameError || lastNameError) {
      setName({ ...firstname, error: lastNameError });
      setLastName({ ...lastname, error: nameError });
      setEmail({ ...username, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
  
    // Log the values before sending the request
    console.log('First Name:', firstname.value);
    console.log('Last Name:', lastname.value);
    console.log('Email:', username.value);
    console.log('Password:', password.value);
    console.log('Phone:', phone.value);
    console.log('Adresse:', adresse.value);
    console.log('Nom:', nom.value);
  
    try {
      const response = await fetch('http://192.168.11.106:8222/user/createRecruiter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `firstname=${encodeURIComponent(firstname.value)}&lastname=${encodeURIComponent(lastname.value)}&username=${encodeURIComponent(username.value)}&password=${encodeURIComponent(password.value)}&phone=${encodeURIComponent(phone.value)}&adresse=${encodeURIComponent(adresse.value)}&nom=${encodeURIComponent(nom.value)}`,
      });
  
      if (response.status === 200) {
        // Candidate creation successful
        // You may want to handle the response from the server, if needed.
        console.log('Recruiter created successfully');
        alert('Account created successfully');
        // Reset the form or perform other necessary actions.
        setName({ value: '', error: '' });
        setLastName({ value: '', error: '' });
        setEmail({ value: '', error: '' });
        setPassword({ value: '', error: '' });
        setPhone({ value: '', error: '' });
        setAdressse({ value: '', error: '' });
        setNom({ value: '', error: '' });
      } else {
        console.error('Email  OR entreprise already exists');
      }
    } catch (error) {
      console.error('Error during Recruiter creation:', error);
      // Handle error accordingly, show error message, etc.
    }
  };
    
  
  return (
    <Background1>
      <BackButton goBack={navigation.goBack} />
      <Header1>Create Account</Header1>
      <TextInput
        label="First Name"
        returnKeyType="next"
        value={firstname.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!firstname.error}
        errorText={firstname.error}
      />
       <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastname.value}
        onChangeText={(text) => setLastName({ value: text, error: '' })}
        error={!!lastname.error}
        errorText={lastname.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!username.error}
        errorText={username.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Phone"
        returnKeyType="next"
        value={phone.value}
        onChangeText={(text) => setPhone({ value: text, error: '' })}
        error={!!phone.error}
        errorText={phone.error}
      />
      <TextInput
        label="Adresse Of Entreprise"
        returnKeyType="next"
        value={adresse.value}
        onChangeText={(text) => setAdressse({ value: text, error: '' })}
        error={!!adresse.error}
        errorText={adresse.error}
      />
      <TextInput
        label="Name Of Entreprise"
        returnKeyType="next"
        value={nom.value}
        onChangeText={(text) => setNom({ value: text, error: '' })}
        error={!!nom.error}
        errorText={nom.error}
      />
      
      <Button1
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button1>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Register</Text>
        </TouchableOpacity>
      </View>
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
