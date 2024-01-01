import React from 'react'
import Background1 from '../components/Background1'
import Button1 from '../components/Button1'
import Button2 from '../components/Button2'
import Paragraph from '../components/Paragraph'
import Header1 from '../components/Header1'

export default function SignScreen({ navigation }) {
  return (
    <Background1>
      <Header1> Welcome </Header1>
      
      <Paragraph>
        Are You  ? 
      </Paragraph>
      <Button1
        mode="contained"
        onPress={() => navigation.navigate('SignScreenRec')}
      >
        Recruiter
      </Button1>
      <Button2
        mode="outlined"
        onPress={() => navigation.navigate('SignScreen')}
      >
       Candidate
      </Button2>
    </Background1>
  )
}
