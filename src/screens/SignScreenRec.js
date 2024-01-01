import React from 'react'
import Background1 from '../components/Background1'
import Button1 from '../components/Button1'
import Button2 from '../components/Button2'
import Paragraph from '../components/Paragraph'
import Header1 from '../components/Header1'

export default function SignScreen({ navigation }) {
  return (
    <Background1>
      <Header1>Geo Opportunity</Header1>
      <Paragraph>
        Geo-localized job and internship search and sharing application.
      </Paragraph>
      <Button1
        mode="contained"
        onPress={() => navigation.navigate('LoginScreenRec')}
      >
        Login
      </Button1>
      <Button2
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreenRec')}
      >
        Sign Up
      </Button2>
    </Background1>
  )
}
