import React, { Component } from 'react'
import {View, Button, TextInput,  StyleSheet, Image} from 'react-native'
import firebase from 'firebase'

export class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      name: ''
    }
    this.onSignup = this.onSignup.bind(this)
  }

  onSignup(){
    const { email, password, name } = this.state
    firebase.auth().createUserWithEmailAndPassword(email.trim(), password.trim())
    .then((result) => {
      firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        name,
        email
      })
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
          placeholder="Name"
          onChangeText={(name) => this.setState({name})}
          style={styles.input}
        />
        <TextInput 
          placeholder="Email"
          onChangeText={(email) => this.setState({email})}
          style={styles.input}
        />
        <TextInput 
          placeholder="Password"
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          style={styles.input}
        />
        <Button 
          onPress={() => this.onSignup()}
          title="Register"
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

    marginTop: 40,
    marginBottom: 40,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 300,
    height: 60
  },
  input:{
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    padding: 20,
    marginBottom: 20
  }
})

export default Register
