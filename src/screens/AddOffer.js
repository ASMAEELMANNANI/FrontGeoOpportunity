import React from 'react';
import Background2 from '../components/Background2';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph1 from '../components/Paragraph1';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreenRec from '../screens/LoginScreenRec';

const Drawer = createDrawerNavigator();

const NewOffer = () => {
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
            <Header>Welcome</Header>
            <Paragraph1>To Add A new Offer Click this button</Paragraph1>
            <Button mode="contained" onPress={() => navigation.navigate('FormOffre')}>
              {'Add A New Offer '}
            </Button>
          </Background2>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="LogOut" component={LoginScreenRec} listeners={{ focus: logout }} />
    </Drawer.Navigator>
  );
};

export default NewOffer;
