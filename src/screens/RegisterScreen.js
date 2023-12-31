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
  const [CV, setCV] = useState({ value: '', error: '' })

  const onSignUpPressed = async () => {
    const nameError = nameValidator(firstname.value);
    const lastNameError = nameValidator(lastname.value);
    const emailError = emailValidator(username.value);
    const passwordError = passwordValidator(password.value);
    const phoneError = nameValidator(phone.value);
    const CVError = nameValidator(CV.value);
  
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
    console.log('CV File:', CV.value);
  
    try {
      const response = await fetch('http://192.168.11.103:8096/user/createCandidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `firstname=${encodeURIComponent(firstname.value)}&lastname=${encodeURIComponent(lastname.value)}&username=${encodeURIComponent(username.value)}&password=${encodeURIComponent(password.value)}&phone=${encodeURIComponent(phone.value)}&CV=${encodeURIComponent(CV.value)}`,
      });
  
      if (response.status === 200) {
        // Candidate creation successful
        // You may want to handle the response from the server, if needed.
        console.log('Candidate created successfully');
        alert('Account created successfully');
        // Reset the form or perform other necessary actions.
        setName({ value: '', error: '' });
        setLastName({ value: '', error: '' });
        setEmail({ value: '', error: '' });
        setPassword({ value: '', error: '' });
        setPhone({ value: '', error: '' });
        setCV({ value: '', error: '' });
      } else {
        console.error('Email already exists');
      }
    } catch (error) {
      console.error('Error during candidate creation:', error);
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
        label="CV"
        returnKeyType="next"
        value={CV.value}
        onChangeText={(text) => setCV({ value: text, error: '' })}
        error={!!CV.error}
        errorText={CV.error}
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
          <Text style={styles.link}>Login</Text>
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
