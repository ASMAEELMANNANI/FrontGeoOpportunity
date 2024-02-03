import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background1 from '../components/Background1'
import Header from '../components/Header1'
import Button from '../components/Button1'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const [recID, setRecId] = useState(null);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

     // Log the values before sending the request
  console.log('Email:', email.value);
  console.log('Password:', password.value);

    try {
      const response = await fetch('http://192.168.11.103:8222/user/authenticateRec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email.value)}&password=${encodeURIComponent(password.value)}`,
      });

      if (response.status === 200) {
        try {
          const data = JSON.parse(await response.text());
          // Handle the parsed data
          setRecId(data.id);
          console.log("Recruiter Id: ", data.id);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'AddOffer',
                params: { recID: data.id },
              },
            ],
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
          console.log('Response Text:', await response.text());
        }
      } else {
        console.error('Your Email Or password incorrect please check out and try again');
      }
    } catch (error) {
      console.error('Error during authentication:',error);
      // Handle error accordingly, show error message, etc.
    }
  };

  return (
    <Background1>
      <BackButton goBack={navigation.goBack} />
      <Header>Geo Opportunity</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
      <Text>Go Back ,  </Text>
        <TouchableOpacity onPress={() => navigation.replace('CandidatOrRecruiter')}>
          <Text style={styles.link}>Home Page</Text>
        </TouchableOpacity>
      </View>
    </Background1>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
