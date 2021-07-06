import React, { Component } from 'react'
import {View, Text} from 'react-native'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUser, fetchUserPosts, fetchUserFollowing, clearData} from '../redux/actions/index' 

import FeedScreen from './main/Feed'
import SearchScreen from './main/Search'

import ProfileScreen from './main/Profile'

const Tab = createMaterialBottomTabNavigator()

const EmptyScreen = () => {
  return(null )
}

export class Main extends Component {
  componentDidMount() { 
    this.props.fetchUser()
    this.props.fetchUserPosts()
    this.props.fetchUserFollowing()
    this.props.clearData()
  }
  render() {
    const {currentUser} = this.props
    if (currentUser === undefined) {
      return(
        <View>
        </View>
      )
    }
    return (
      <Tab.Navigator initialRouteName="Feed" labeled={false} activeColor="#ff1925" inactiveColor="gray" barStyle={{backgroundColor: 'black'}}>
        <Tab.Screen name="Feed" component={FeedScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen name="Screen" component={SearchScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          )
        }}
        navigation={ this.props.navigation}
      />
        <Tab.Screen name="AddContainer" component={EmptyScreen} 
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault()
              navigation.navigate("Add")
            }
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            )
          }}
          listeners={({ navigation }) => ({
            tabPress: (event) => {
              event.preventDefault()
              navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
            }
          })}
        />
      </Tab.Navigator>
    )
  }
}
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser 
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing, clearData}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Main)
