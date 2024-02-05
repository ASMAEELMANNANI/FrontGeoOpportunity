import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import Card2 from '../components/Card2';
import { useRoute } from '@react-navigation/native';

const CandidatsOfferRec = () => {
  const [offer, setOffer] = useState(null);
  const route = useRoute();
  const { offerId } = route.params;
  console.log("Received ID offer :", offerId);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`http://192.168.43.149:8222/offre/${offerId}`);
        const data = await response.json();
        setOffer(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'offre :', error);
      }
    };

    fetchOffer();
  }, [offerId]);

  return (
    <SafeAreaView style={{ paddingTop: 20, flex: 1 }}>
      <ScrollView>
        {offer && offer.candidats.map((candidat) => (
          <View key={candidat.id} style={{ marginBottom: 10 }}>
            <Card2
              imageUrl="https://i.pinimg.com/originals/aa/73/a8/aa73a8b6777a6f3446bcbb5a47f7ceea.png"
              firstname={candidat.firstname}
              lastname={candidat.lastname}
              username={candidat.username}
              phone={candidat.phone}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CandidatsOfferRec;
