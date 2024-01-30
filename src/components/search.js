import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";

/**
 * Main Component
 */
const usePlacesAutocomplete = (initialValue, accessToken, countryId) => {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (inputText) => {
    setValue(inputText);

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${accessToken}&country=${countryId}&autocomplete=true`;
      const response = await fetch(endpoint);
      const results = await response.json();
      setSuggestions(results?.features);
    } catch (error) {
      console.log("Error fetching data, ", error);
    }
  };

  return {
    value,
    onChangeText: handleChange,
    setValue,
    suggestions,
    setSuggestions,
  };
};

/** Place Suggestion List below text input */
const PlaceSuggestionList = ({ placesAutocomplete, onPlaceSelect }) => {
  return (
    <View style={styles.suggestionList}>
      {placesAutocomplete.suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPlaceSelect(suggestion)}
        >
          <Text style={styles.suggestionItem}>{suggestion.place_name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const search = ({
  id = "1",
  inputStyle,
  containerStyle,
  inputClassName = "",
  containerClassName = "",
  placeholder = "Address",
  accessToken = "pk.eyJ1IjoibWVyaWVtZWwiLCJhIjoiY2xwMzhqanNuMHlwajJqcnBkOXdhajMwNCJ9.Dpk2oasn1cyqgHiyREyJlA",
  onClearInput,
  onLocationSelect,
}) => {
  const placesAutocomplete = usePlacesAutocomplete("", accessToken, "ma");

  if (id === "" || typeof id !== "string") {
    throw new Error("[Search] Property `id` is required and must be a string.");
  }


  const handlePlaceSelect = (suggestion) => {
    placesAutocomplete.setValue(suggestion.place_name);
    placesAutocomplete.setSuggestions([]);
    
    onLocationSelect({
      latitude: suggestion.center[1],
      longitude: suggestion.center[0],
    });

    // Display an alert with the coordinates of the suggestion
    Alert.alert(
      "Destination Sélectionnée",
      `Latitude: ${suggestion.center[1]}, Longitude: ${suggestion.center[0]}`
    );
  };

  return (
    <View style={[styles.container, containerStyle]} className={containerClassName}>
      <TextInput
        {...{ ...placesAutocomplete, placeholder }}
        style={[styles.input, inputStyle]}
        className={inputClassName}
      />
      {placesAutocomplete.value && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => {
            placesAutocomplete.setValue("");
          }}
        >
        </TouchableOpacity>
      )}
      {placesAutocomplete.suggestions?.length > 0 && placesAutocomplete.value && (
        <PlaceSuggestionList
          placesAutocomplete={placesAutocomplete}
          onPlaceSelect={handlePlaceSelect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    position: "relative",
    height: 32,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: "#374151",
    backgroundColor: "#FFFFFF",
    paddingLeft: 5,
    paddingRight: 28,
    paddingVertical: 1,
    borderRadius: 4,
    fontSize: 14,
    width: 300,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
  },
  clearBtnImage: { width: 20, height: 20 },
  clearBtn: { position: "absolute", top: 6, right: 5 },
  suggestionList: {
    position: "absolute",
    zIndex: 100,
    paddingHorizontal: 5,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    marginHorizontal: 2,
    top: 32,
    left: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  suggestionItem: {
    color: "#374151",
    fontWeight: "300",
    fontSize: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: "#9ca3af",
    marginTop: 2,
  },
  creditBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 4,
  },
  creditText: {
    color: "#6b7280",
    fontWeight: "400",
    fontSize: 12,
    padding: 2,
  },
});

export default search;
