import React , { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity,ScrollView,Alert} from 'react-native';
import logoImage from '../assets/offerLogo.jpg';
import { useRoute } from '@react-navigation/native';
import FeedBackCard from '../screens/FeedBackCard'

const DetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { OfferId } = route.params;
  const { CandId } = route.params;

  const [offerData, setOfferData] = useState(null);

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        const response = await fetch(`http://192.168.43.149:8222/offre/${OfferId}`);
        const data = await response.json();
        setOfferData(data);
      } catch (error) {
        console.error('Error fetching offer data:', error);
      }
    };

    fetchOfferData();
  }, [OfferId]);

  const applyToJob = async () => {
    try {
      const response = await fetch(`http://192.168.43.149:8222/offre/${OfferId}/postuler/${CandId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `offreId=${OfferId}&candidatId=${CandId}`,
      });

      if (response.ok) {
        // Successful API call
        Alert.alert('Success', 'You have applied successfully to the job.');
      } else {
        // Error in API call
        Alert.alert('Error', 'Failed to apply to the job. Please try again.');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  if (!offerData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  /***Navigate to the feedbacks Card */
  const viewFeedbacks = () => {
      navigation.navigate('FeedBackCard', {EntrepriseId: offerData.entreprise.id});
  };

  return (
   
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={logoImage} />
      </View>
      <View style={styles.companyInfo}>
        <View style={styles.companyText}>
          <Text style={styles.label}>Title :</Text>
          <Text style={styles.value}>{offerData.libelle}</Text>
          <Text style={styles.label}>description of the offer :</Text>
          <Text style={styles.value}>{offerData.description}</Text>
          <Text style={styles.label}>domain :</Text>
          <Text style={styles.value}>{offerData.domaine}</Text>
          <Text style={styles.label}>contract:</Text>
          <Text style={styles.value}>{offerData.contrat}</Text>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{offerData.ville}</Text>
          <Text style={styles.label}>Application date:</Text>
          <Text style={styles.value}>{formatDate(offerData.dateCreation)} To {formatDate(offerData.dateExpiration)}</Text>
          <Text style={styles.label}>Entreprise:</Text>
          <Text style={styles.value}>{offerData.entreprise.nom}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{offerData.entreprise.email}</Text>
        </View>
      </View>
     
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button1} onPress={viewFeedbacks}>
          <Text style={styles.buttonText}>View Feedbacks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={applyToJob}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: 20,
   
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  companyText: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
    color: '#333',
  },
  body: {
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#1B4077',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button1: {
    backgroundColor: '#808080',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
   
  },
});

export default DetailsScreen;