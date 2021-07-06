import React from 'react'
import { View, Button,  StyleSheet, Image } from 'react-native'

export default function Landing ({navigation}) {
  return (
    <View style={styles.container}>
    <Image style={styles.banner} source={require('../../assets/banner.png')}/> 
      <Button 
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button 
        title="Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  )
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25
  },
  banner: {
    width: 300,
    height: 60,
    marginTop: 40,
    marginBottom: 40,
    marginRight: 'auto',
    marginLeft: 'auto'
  }
})

