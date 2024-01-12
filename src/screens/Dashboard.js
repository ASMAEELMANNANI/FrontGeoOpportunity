import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { useRoute, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';

const Drawer = createDrawerNavigator();

export default function Dashboard() {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [mapRegion, setMapRegion] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const route = useRoute();
  const { candidateId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    })()
  }, [])

  let text = 'Waiting..'
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }

  const search = () => {
    // Add your search logic here
    alert('You have searched: ' + searchQuery)
  }

  const logout = () => {
    // Perform any additional logout logic here
    // For now, simply navigate to the LoginScreen
    navigation.navigate('LoginScreen');
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen name=" ">
        {() => (
          <View style={styles.container}>
            <Text>Your ID is {candidateId} in this page Dashboard</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            <TouchableOpacity style={styles.searchButton} onPress={search}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            <MapView
              style={[styles.map, styles.containerBackground]}
              provider={PROVIDER_GOOGLE}
              region={mapRegion}
              showsUserLocation
              followUserLocation
            >
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="You are here"
                  description="Your current location"
                />
              )}
            </MapView>
          </View>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="LogOut" component={LoginScreen} listeners={{ focus: logout }} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBackground: {
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  searchInput: {
    width: '90%',
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderRadius: 3,
    padding: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  searchButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    padding: 8,
    width: '50%',
    colorBackground: '#560CCE',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
