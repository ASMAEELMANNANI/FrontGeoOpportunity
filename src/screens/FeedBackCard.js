import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import CardFeed from '../components/CardFeed';

const FeedBackCard = ({ route }) => {
  const { EntrepriseId } = route.params;
  console.log('Received Entreprise Id:', EntrepriseId);

  // State to store enterprise details with feedbacks
  const [enterpriseDetails, setEnterpriseDetails] = useState(null);

  useEffect(() => {
    const fetchEnterpriseData = async () => {
      try {
        const response = await fetch(`http://192.168.11.105:8222/entreprise/${EntrepriseId}`);
        const data = await response.json();
        //console.log('Enterprise Data:', data); // Log the entire data object
        setEnterpriseDetails(data);
      } catch (error) {
        console.error('Error fetching enterprise data:', error);
      }
    };

    fetchEnterpriseData();
  }, [EntrepriseId]);

  // Extract feedback data
  const feedbacksData = enterpriseDetails?.feedbacks?.map((item) => ({
    firstname: item.candidat?.firstname,
    lastname: item.candidat?.lastname,
    text: item.description,
  })) || [];

  return (
    <View>
      <Text>Enterprise ID: {EntrepriseId}</Text>
      {feedbacksData.map((feedback, index) => (
        <CardFeed
          key={index}
          firstname={feedback.firstname}
          lastname={feedback.lastname}
          text={feedback.text}
        />
      ))}
    </View>
  );
};

export default FeedBackCard;
