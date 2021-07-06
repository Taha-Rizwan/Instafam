import React,{useState} from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
export default function Search(props) {
  const [users,setUsers] = useState([])

  const fetchUsers = (search) => {
      firebase.firestore()
      .collection('users')
      .where('name', '>=', search)
      .get()
      .then((snapshot) => {
          let users = snapshot.docs.map(doc=> {
          const data = doc.data()
          const id = doc.id
          return  {id, ...data}
          })
          setUsers(users)
      })
  }
  return (
    <View>
      <TextInput onChangeText={(search)=> fetchUsers(search)} placeholder="Search for a user" style={styles.input}/>
      <FlatList 
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Profile", {uid: item.id})}
            style={styles.item}
          >
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>         
          
        )}
      />
    </View> 
  )
}

const styles = StyleSheet.create({
  input:{
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    padding: 20
  },
  item:{
    fontSize: 20,
    padding: 10
  },
  text:{
      fontSize: 20,
      padding: 10
  }
})
