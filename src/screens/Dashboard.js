import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons'

const Drawer = createDrawerNavigator();

export default function Dashboard() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [otherMarkers, setOtherMarkers] = useState([]);

  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedOfferType, setSelectedOfferType] = useState('all');
  const [selectedOfferContract, setSelectedOfferContract] = useState('all');

  /**Model Of search */
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
  
        const response = await fetch('http://192.168.11.103:8222/offre');
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

  const search = async () => {
    try {
      let url;
  
      if (selectedCity === 'all' && selectedOfferType === 'all' && selectedOfferContract === 'all') {
        // Use the original endpoint if all values are "all"
        url = 'http://192.168.11.103:8222/offre';
      } else {
        // Use the filtered endpoint with selected values
        url = `http://192.168.11.103:8222/offre/filter?domaine=${selectedOfferType}&ville=${selectedCity}&contrat=${selectedOfferContract}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
  
      // Update map markers based on the response
      const updatedMarkers = data.map((offre) => ({
        id: offre.id,
        title: offre.libelle,
        coordinate: {
          latitude: offre.latitude,
          longitude: offre.longitude,
        },
        description: offre.description, 
      }));
  
      setOtherMarkers(updatedMarkers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
           <View style={styles.header}>
              <Text style={styles.headerText}>Geo Opportunity</Text>
              <TouchableOpacity onPress={openModal} style={styles.searchIcon}>
              <FontAwesome5 style={{marginLeft: 19}} name="search" size={20} color="black" />
              </TouchableOpacity>
              <Modal
                transparent
                animationType="slide"
                visible={modalVisible}
                onRequestClose={closeModal}
              >
                <View style={styles.modalContainer}>
                <Picker
                        style={styles.picker}
                        selectedValue={selectedCity}
                        onValueChange={(itemValue) => setSelectedCity(itemValue)}
                      >
                      
                    <Picker.Item label="City" value="all" />
                        <Picker.Item label="Casablanca" value="Casablanca" />
                        <Picker.Item label="Rabat" value="Rabat" />
                        <Picker.Item label="Mohammedia" value="Mohammedia" />
                        <Picker.Item label="Tanger" value="Tanger" />
                        <Picker.Item label="Marrakech" value="Marrakech" />
                        <Picker.Item label="Agadir" value="Agadir" />
                        <Picker.Item label="Sale" value="Sale" />
                        <Picker.Item label="Kenitra" value="Kenitra" />
                  </Picker>
                  <Picker
                        style={styles.picker}
                        selectedValue={selectedOfferType}
                        onValueChange={(itemValue) => setSelectedOfferType(itemValue)}
                      >
                      <Picker.Item label="Domain" value="all" />
                        <Picker.Item label="Software" value="Software" />
                        <Picker.Item label="Data Science" value="Data Science" />
                        <Picker.Item label="Cloud Computing" value="Cloud Computing" />
                        <Picker.Item label="Marketing" value="Marketing" />
                        <Picker.Item label="HR" value="HR" />
                        <Picker.Item label="Finance" value="Finance" />
                  </Picker>
                  <Picker
                      style={styles.picker}
                      selectedValue={selectedOfferContract}
                      onValueChange={(itemValue) => setSelectedOfferContract(itemValue)}
                    >
                  <Picker.Item label="Contract" value="all" />
                      <Picker.Item label="Internship" value="Internship" />
                      <Picker.Item label="CDD" value="CDD" />
                      <Picker.Item label="CDI" value="CDI" />
                  </Picker>
          
                  <View style={styles.buttonContainer}>
                  
                    <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                      <Text style={styles.buttonText}>Annuler </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={() => {
                        search();
                        closeModal();
                      }}
                    >
                      <Text style={styles.searchButtonText}>Search       
                    </Text>
                      
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
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
      <Drawer.Screen name="Add Feed Back" component={FeedbackScreen}  initialParams={{ candidateId: candidateId }}/>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: '#F8F9FA',
  },
  containerBackground: {
    backgroundColor: '#F8F9FA',
  },
  map: {
    flex: 1,
    borderRadius: 10,
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
  searchContainer: {
    padding: 10,
  },
  picker: {
    width: '100%',
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
 
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 50,
    borderRadius: 10,
    elevation: 5,
    top:200,
    borderRadius:30,

  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop:50,
  },
  searchButton: {
    backgroundColor: '#1B4077',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancel: {
    backgroundColor: '#C7241B',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
  },
  CancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
