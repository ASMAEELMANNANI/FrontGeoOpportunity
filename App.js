import 'react-native-gesture-handler';
import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  SignScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  CandidatOrRecruiter,
  SignScreenRec,
  LoginScreenRec,
  RegisterScreenRec,
  AddOffer,
  FormOffre,
  OffersRecruiter,
  CandidatsOfferRec,
  detailsScreen,
  FeedbackScreen,
  FeedBackCard

} from './src/screens'

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="SignScreen" component={SignScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="CandidatOrRecruiter" component={CandidatOrRecruiter} />
          <Stack.Screen name="SignScreenRec" component={SignScreenRec} />
          <Stack.Screen name="LoginScreenRec" component={LoginScreenRec} />
          <Stack.Screen name="RegisterScreenRec" component={RegisterScreenRec} />
          <Stack.Screen name="AddOffer" component={AddOffer} />
          <Stack.Screen name="FormOffre" component={FormOffre} />
          <Stack.Screen name="OffersRecruiter" component={OffersRecruiter} />
          <Stack.Screen name="CandidatsOfferRec" component={CandidatsOfferRec} />
          <Stack.Screen name="detailsScreen" component={detailsScreen} />
          <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
          <Stack.Screen name="FeedBackCard" component={FeedBackCard} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
