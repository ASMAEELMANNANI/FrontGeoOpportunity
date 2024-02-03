import React, { useState , useCallback,useEffect} from 'react'
import { View, StyleSheet, TouchableOpacity , SafeAreaView,Button} from 'react-native'
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
import * as DocumentPicker from 'expo-document-picker';



export default function RegisterScreen({ navigation }) {
  const [firstname, setName] = useState({ value: '', error: '' })
  const [lastname, setLastName] = useState({ value: '', error: '' })
  const [username, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [phone, setPhone] = useState({ value: '', error: '' })
  const [CV, setCV] = useState({ value: '', error: '' })

 

  // File
  const [fileUri, setFileUri] = useState(null);
 
  // Pick A file
  // Pick A file
  const handleDocumentSelection = useCallback(async () => {
    
    try {
      const result = await DocumentPicker.getDocumentAsync();
      console.log('Document Picker Result:', result);


      setFileUri(result.assets[0].uri);
      console.log('File URI:', result.assets[0].uri);
     // console.log('File URI from Variable :', fileUri);

      
    } catch (err) {
      console.warn('Error picking document:', err);
    }
  }, []);

  useEffect(() => {
    // This code will run after every render when fileUri changes
    console.log('File URI from Variable:', fileUri);
    
    // Check if fileUri is not null before attempting to split
    if (fileUri) {
      // Split the fileUri based on the '/' character
      const parts = fileUri.split('/');
      // Extract the last part of the array, which contains the desired string
      const fileName = parts[parts.length - 1];
  
      setCV(prevCV => ({ ...prevCV, value: fileName, error: '' }));

      console.log('File Name:', fileName);
    
      // Log the updated CV value inside the useEffect
     
    }
  }, [fileUri]);
  
 

 // console.log('Cv Value outside useEffect:', CV.value);
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
      //setCV({...CV ,error:CvError})
      return;
    }
  
   
    
  
    try {
       // Log the values before sending the request
      console.log('First Name:', firstname.value);
      console.log('Last Name:', lastname.value);
      console.log('Email:', username.value);
      console.log('Password:', password.value);
      console.log('Phone:', phone.value);
      console.log('CV File:', CV.value);

      const response = await fetch('http://192.168.11.103:8222/user/createCandidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        "firstname": firstname.value,
        "lastname": lastname.value,
        "username": username.value,
        "password": password.value,
        "phone": phone.value,
        "cv": CV.value,
        "feedbacks": [],
        "offres": []
     
      

       }),
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
      

      <SafeAreaView style={styles.container1}>
        {fileUri && (
          <Text style={styles.uri} numberOfLines={1} ellipsizeMode={'middle'}>
            {fileUri}
          </Text>
        )}
        <Button title="Select Your Resume 📑" onPress={handleDocumentSelection} />
      </SafeAreaView>
      
      
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

  container1: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  uri: {
    fontSize: 16,
    marginTop: 10,
  },
})
