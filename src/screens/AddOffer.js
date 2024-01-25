import React from 'react';
import Background2 from '../components/Background2';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph1 from '../components/Paragraph1';
import {useRoute, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreenRec from '../screens/LoginScreenRec';
import OffersRecruiter from '../screens/OffersRecruiter';


const Drawer = createDrawerNavigator();

const NewOffer = () => {

  const route = useRoute();
  const { recID } = route.params;

  const navigation = useNavigation();

 


  const logout = () => {
    // Perform any additional logout logic here
    // For now, simply navigate to the LoginScreen
    navigation.navigate('LoginScreenRec');
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen name=" ">
        {() => (
          <Background2>
            <Header>Welcome your Id is {recID} </Header>
            <Paragraph1>To Add A new Offer Click this button</Paragraph1>
            <Button mode="contained" onPress={() => navigation.navigate('FormOffre', { recID })}>
              {'Add A New Offer '}
            </Button>
          </Background2>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="LogOut" component={LoginScreenRec} listeners={{ focus: logout }} />
      <Drawer.Screen name="My Offers">
        {() => <OffersRecruiter recID={recID} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default NewOffer;
