import React, {useState} from 'react'
import {View, TextInput, Image, Button, StyleSheet} from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
require('firebase/firebase-storage')

export default function Save(props) {
  const [caption,setCaption] = useState("")
  const image = props.route.params.image

  const uploadImage = async() => {
    const uri = image
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
    const response = await fetch(uri)
    const blob = await response.blob()
    const task = firebase
      .storage()
      .ref()
      .child(childPath)
      .put(blob)
    const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`)
    }
    const taskCompleted = snapshot => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot)
      })
    }

    const taskError = snapshot => {
      console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted)
  }
  const savePostData = (downloadURL) => {
    firebase.firestore()
    .collection('posts')
    .doc(firebase.auth().currentUser.uid)
    .collection('userPosts')
    .add({
      downloadURL,
      caption,
      creation: firebase.firestore.FieldValue.serverTimestamp()
    }).then((function() {
      props.navigation.popToTop()
    }))
  }
  return (
    <View style={styles.container}>
      
      <TextInput 
        placeholder="Write a Caption...."
        onChangeText={(caption) => setCaption(caption)}
        style={styles.input}
      />
      <Image source={{uri: image}} style={styles.image}/>
      <Button title="Save" onPress={() => uploadImage()}/>
    </View>
  )
}
const styles=StyleSheet.create({
  container:{
    padding:  40
  },
  input:{
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    padding: 10
  },
  image:{
    height: 300,
    width: 300,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 'auto',
    marginLeft:'auto' 
  }
})