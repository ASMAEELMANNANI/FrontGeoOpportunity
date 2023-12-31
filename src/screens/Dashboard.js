import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
// eslint-disable-next-line import/no-extraneous-dependencies
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Location from 'expo-location'

export default function App() {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [mapRegion, setMapRegion] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
      // eslint-disable-next-line no-shadow
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
    // Ajoutez ici votre logique de recherche
    alert('Vous avez recherché: ' + searchQuery)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        // eslint-disable-next-line no-shadow
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
})
