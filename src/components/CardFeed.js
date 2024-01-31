import React from 'react';
import { View, Text, Image, StyleSheet , Platform} from 'react-native';
import FeedBackPic from '../assets/FeedBackPic.jpg';

const CardFeed = ({firstname, lastname , text}) => {
 // console.log('CardFeed Props:', { firstname, lastname, text });
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image source={FeedBackPic} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{firstname} {lastname}</Text>
          <Text>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '90%', // Set the width to your desired value
    alignSelf: 'center', // Center the card on the screen
    marginTop: 30,
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
});

export default CardFeed;
