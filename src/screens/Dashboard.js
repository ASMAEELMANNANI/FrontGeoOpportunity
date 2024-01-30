import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';

const Drawer = createDrawerNavigator();

export default function Dashboard() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [otherMarkers, setOtherMarkers] = useState([]);

  const handleMarkerPress = (marker) => {
    const markersAtSamePosition = otherMarkers.filter(
      (m) =>
        m.coordinate.latitude === marker.coordinate.latitude &&
        m.coordinate.longitude === marker.coordinate.longitude &&
        m.id !== marker.id
    );
  
    const allMarkers = [marker, ...markersAtSamePosition.map((m, index) => ({
      ...m,
      coordinate: {
        ...m.coordinate,
        // Add a small offset based on the index to avoid overlapping
        latitude: m.coordinate.latitude + (index + 1) * 0.0001,
        longitude: m.coordinate.longitude + (index + 1) * 0.0001,
      },
    }))];
  
    setSelectedMarker(allMarkers);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const route = useRoute();
  const { candidateId } = route.params;
  const navigation = useNavigation();

  //Haversine Formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in kilometers
  };


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setMapRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
  
        if (!popupVisible) {
          setSelectedMarker(null);
        }
  
        const response = await fetch('http://192.168.11.105:8222/offre');
        const data = await response.json();
  
        // Filter offers based on proximity (within 10 kilometers in this example)
        const nearbyOffers = data.filter((offre) => {
          if (!currentLocation || !currentLocation.coords) {
            return false; // Handle null or undefined currentLocation
          }
  
          const distance = calculateDistance(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            offre.latitude,
            offre.longitude
          );
  
          return distance <= 10; // Adjust the distance threshold as needed
        });
  
        setOtherMarkers(
          nearbyOffers.map((offre) => ({
            id: offre.id,
            title: offre.libelle,
            coordinate: {
              latitude: offre.latitude,
              longitude: offre.longitude,
            },
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [popupVisible]);
 

  const renderPopup = () => {
    if (!selectedMarker) return null;
  
    const renderMarkerDetails = (marker) => (
      <View key={marker.id}>
        <Text style={styles.companyTitle}>{marker.title}</Text>
        <Text style={styles.offerDetails}>{marker.description}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('detailsScreen', { OfferId: marker.id ,CandId: candidateId})} style={styles.detailsButton}>
          <Text style={styles.buttonText}>View details</Text>
        </TouchableOpacity>
      </View>
    );
  
    const renderPopupContent = Array.isArray(selectedMarker)
      ? selectedMarker.map(renderMarkerDetails)
      : renderMarkerDetails(selectedMarker);
  
    return (
      <View style={[styles.popupContainer, { opacity: popupVisible ? 1 : 0 }]}>
        {renderPopupContent}
        <TouchableOpacity onPress={closePopup} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const search = () => {
    alert('You have searched: ' + searchQuery);
  };

  const logout = () => {
    navigation.navigate('LoginScreen');
  };

  const [selectedItem, setSelectedItem] = useState('');
  const data = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <Drawer.Navigator>
      <Drawer.Screen name=" ">
        {() => (
          <View style={styles.container}>
            <Text>Your ID is {candidateId} in this page Dashboard</Text>
            <Text style={styles.locationText}>
              Latitude: {location && location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location && location.coords.longitude.toFixed(6)}
            </Text>
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
              {location && (
                <Circle
                  center={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  radius={2000}
                  fillColor="rgba(0, 0, 255, 0.1)"
                  strokeColor="transparent"
                />
              )}
              {otherMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  description={marker.description}
                  pinColor="#1B4077"
                  onPress={() => handleMarkerPress(marker)}
                />
              ))}
            </MapView>
            {renderPopup()}
          </View>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="LogOut" component={LoginScreen} listeners={{ focus: logout }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBackground: {
    backgroundColor: '#ecf0f1',
  },
  map: {
    flex: 1,
  },
  searchInput: {
    width: '70%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#1B4077',
    borderRadius: 20,
    width: '20%',
    marginLeft: '5%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  companyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  offerDetails: {
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#1B4077',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
