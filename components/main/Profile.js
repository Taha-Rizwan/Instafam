import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

function Profile(props) {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)
  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
        setUser(currentUser)
        setUserPosts(posts)
    }
    else {
        firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    setUser(snapshot.data());
                }
                else {
                    console.log('does not exist')
                }
            })
        firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserPosts(posts)
            })
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
        setFollowing(true);
    } else {
        setFollowing(false);
    }

}, [props.route.params.uid, props.following])

  const onFollow = () => {
    firebase.firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid) 
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .set({})
  }
  const onUnfollow = () => {
    firebase.firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .delete()
  }
  const onLogout = () => {
      firebase.auth().signOut()
  }
  if(user===null) {
    return <View />
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
            <View>
              {following? (
                <Button title="Following"
                  onPress={() => onUnfollow()}
                  
                />
              ): (
                <Button title="Follow"
                  onPress={() => onFollow()}
                  
                />
              )}
            </View>
        ) :  <Button title="Logout"
        onPress={() => onLogout()}
        
      />}
      </View>
      <View style={styles.containerGallery}>
        <FlatList 
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
            <TouchableOpacity onPress={()=>{props.navigation.navigate('Comment', 
            { postId: item.id, uid: props.route.params.uid, item , name: user.name}
            )
            console.log(user)
        } }>
              <Image
              source={{uri: item.downloadURL}}
              style={styles.image}
              />    
            </TouchableOpacity>
             
            </View>
            
      )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0
  }, 
  containerInfo: {
    margin: 20,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 30,
    borderRadius: 30
  },
  containerGallery: {
    flex: 1
  },
  containerImage:{
    flex: 1 / 3
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    height: 150,
    padding: 5
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 20
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile)
