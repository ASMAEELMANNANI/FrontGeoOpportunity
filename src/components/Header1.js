import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

export default function Header1(props) {
  return <Text style={styles.header} {...props} />
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    color: '#1B4077',
    fontWeight: 'bold',
    paddingVertical: 12,
    bottom: 100,
  },
})
