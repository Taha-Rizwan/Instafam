import React, { Component } from 'react'
import {View, Button, TextInput, StyleSheet, Image} from 'react-native'
import firebase from 'firebase'


export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.onSignin = this.onSignin.bind(this)
  }

  onSignin(){
    const { email, password} = this.state
    console.log(email)
    firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
    .then((result) => {
      console.log(result)
    }).catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <View style={styles.container}>
      <Image style={styles.banner} source={require('../../assets/banner.png')}/> 
        <TextInput    
          placeholder="Email"
          onChangeText={(email) => this.setState({email})}
          style={styles.input}
        />
        <TextInput 
          placeholder="Password"
          onChangeText={(password) => this.setState({password})}
          style={styles.input}
          secureTextEntry={true}
        />
        <Button 
          onPress={() => this.onSignin()}
          title="Login"
        />
      </View>
    )
  }
}

const styles=StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center'
  },
  banner: {
    width: 300,
    height: 60,
    marginTop: 40,
    marginBottom: 40,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  input:{
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    padding: 20,
    marginBottom: 20
  }
})

export default Login
