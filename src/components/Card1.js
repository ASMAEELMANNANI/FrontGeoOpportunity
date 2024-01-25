import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Card1 = ({ imageUrl, title, description, date_creation, date_expiration, contrat, domaine, onPressCandidats }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text>{description}</Text>
          <Text>{date_creation} To {date_expiration}</Text>
          <Text>{contrat}</Text>
          <Text>{domaine}</Text>
        </View>
        
        <TouchableOpacity onPress={onPressCandidats} style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Candidats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsButton: {
    marginLeft: 8,
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Card1;
