import React, { useState, useEffect } from 'react'
import { ScrollView,View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'


function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    const post = props.route.params.item
    useEffect(() => {

        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }


        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])


    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
    }
    const onLikePress = (userId, postId) => {
      firebase.firestore()
          .collection("posts")
          .doc(userId)
          .collection("userPosts")
          .doc(postId)
          .collection("likes")
          .doc(firebase.auth().currentUser.uid)
          .set({})
  }
  const onDislikePress = (userId, postId) => {
      firebase.firestore()
          .collection("posts")
          .doc(userId)
          .collection("userPosts")
          .doc(postId)
          .collection("likes")
          .doc(firebase.auth().currentUser.uid)
          .delete()
  }
    return (
        <ScrollView style={styles.container} horizontal={false}>
          <View style={styles.containerImage}>
            <Text style={styles.name}>{props.route.params.name}</Text>
            <Image source={{uri: post.downloadURL}} style={styles.image}/>
            {post.currentUserLike ? 
              (
                  <TouchableOpacity onPress={() => onDislikePress(props.route.params.uid,props.route.params.postId)}>
                  <MaterialCommunityIcons name="heart" color="#ff1925" size={26} />
                  </TouchableOpacity>
              )
          : (
              <TouchableOpacity onPress={() =>{ onLikePress(props.route.params.uid,props.route.params.postId)
             
              }}>
                  <MaterialCommunityIcons name="heart" color="gray" size={26} />
                  </TouchableOpacity>
          )}
            <Text style={styles.caption}>{post.caption}</Text>
            <Text style={styles.date}>{new Date(post.creation.seconds * 1000).toLocaleDateString('en-PK')}</Text>
          </View>
            <Text style={{padding: 20, fontSize: 30}}>Comments</Text>
          <View style={styles.row}>
                <TextInput
                    placeholder='Write a comment'
                    onChangeText={(text) => setText(text)} 
                    style={styles.input}

                    />
                <TouchableOpacity
                    onPress={() => {onCommentSend()

                    }}
                    title="Send"
                ><Text style={styles.post}>Post</Text></TouchableOpacity>
            </View>
          <View style={styles.comments}>
              <FlatList
              numColumns={1}
              horizontal={false}
              data={comments}
              renderItem={({ item }) => (
                  <View style={styles.comment}>
                      {item.user !== undefined ?
                          <Text style={styles.name}>
                              {item.user.name}
                          </Text>
                          : null}
                      <Text style={styles.text}>{item.text}</Text>
                  </View>
              )}
          />

          </View>
            
            

        </ScrollView>
    )
}

const styles= StyleSheet.create({
    container: {
      flex: 1,
  },
  info: {
      padding: 5,
      fontSize: 30,

  },
  containerGallery: {
      flex: 1
  },
  containerImage: {
      flex: 1,
      height: '100%',
      padding: 15,
      marginLeft: 'auto',
      marginRight: 'auto'
  },
  image: {
      aspectRatio: 1 / 1,
      height: 350,
      width: 350,
      marginLeft: 'auto',
      marginRight: 'auto'
  },
  caption: {
    padding: 5,
    fontSize: 15,
  },
  date:{
    padding: 5,
    fontSize: 10,
    opacity: 0.8
  },
  comment: {
    padding: 20
  },
  row: {
    flexDirection: 'row',
    flex: 1
  },
  input:{
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    padding: 20,
    flex: 0.7,
    margin: 10
  },
  post:{
    color: 'gray',
    flex: 0.3,
    paddingTop: 20
  },
  name: {
    padding: 5,
    fontSize: 30,

  },
  text: {
    padding: 5,
    fontSize: 15,

  }
})
const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);