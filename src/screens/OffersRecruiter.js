import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import Card1 from '../components/Card1';
import { useNavigation } from '@react-navigation/native';

const OffersRecruiter = ({ recID }) => {
  const [offers, setOffers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`http://192.168.11.105:8222/offre/CandidaturesENTPS/${recID}`);
        const data = await response.json();
        setOffers(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des offres :', error);
      }
    };

    fetchOffers();
  }, [recID]);

  const onPressCandidats = (offerId) => {
    navigation.navigate('CandidatsOfferRec', { offerId });
  };

  return (
    <SafeAreaView style={{ paddingTop: 20, flex: 1 }}>
      <ScrollView>
        {offers.map((offer) => (
          <View key={offer.id} style={{ marginBottom: 10 }}>
            <Card1
              imageUrl="https://media.istockphoto.com/id/978978230/vector/award-ribbon-icon-on-white-stock-vector-illustration.jpg?s=170x170&k=20&c=_iL6ACE5x2s5_C7YjJcIvireFB-BIiLla5f2OXMEAjc="
              title={offer.libelle}
              description={offer.description}
              date_creation={formatDate(offer.dateCreation)}
              date_expiration={formatDate(offer.dateExpiration)}
              contrat={offer.contrat}
              domaine={offer.domaine}
              
              onPressCandidats={() => onPressCandidats(offer.id)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
  return formattedDate;
};

export default OffersRecruiter;
