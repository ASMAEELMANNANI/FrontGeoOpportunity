import React from 'react'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph1 from '../components/Paragraph1'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Header>Geo Opportunity</Header>
      <Paragraph1>
        Geo-localized job and internship search and sharing application.
      </Paragraph1>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('CandidatOrRecruiter')}
      >
        {'Get started '}
      </Button>
    </Background>
  )
}
