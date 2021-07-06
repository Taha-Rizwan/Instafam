import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);
    console.log(posts)
    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }

    }, [props.usersFollowingLoaded, props.feed])

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
        <View style={styles.container}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item}) => (
                        <View
                            style={styles.containerImage}>
                            <Text style={styles.info}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            {item.currentUserLike ? 
                                (
                                    <TouchableOpacity onPress={() => onDislikePress(item.user.uid,item.id)}>
                                    <MaterialCommunityIcons name="heart" color="#ff1925" size={26} />
                                    </TouchableOpacity>
                                )
                            : (
                                <TouchableOpacity onPress={() =>{ onLikePress(item.user.uid,item.id)
                               
                                }}>
                                    <MaterialCommunityIcons name="heart" color="gray" size={26} />
                                    </TouchableOpacity>
                            )}
                            <Text style={styles.caption}>{item.caption}</Text>
                            <Text style={styles.date}>{new Date(item.creation.seconds * 1000).toLocaleDateString('en-PK')}</Text>
                            <Text
                                onPress={()=>{props.navigation.navigate('Comment', 
                                { postId: item.id, uid: item.user.uid, item, name: item.user.name }
                                )
                              
                            } }
                            >View Comments</Text>
                        </View>

                    )}

                />
            
        </View>

    )
}

const styles = StyleSheet.create({
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
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);