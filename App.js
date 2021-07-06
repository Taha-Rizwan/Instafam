import React, {Component} from 'react';
import {View, Text, Image} from 'react-native'
import * as firebase from 'firebase'

import { Provider } from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyDjX7kbpHb-SRWHvuRxqbSSy7hyLwVmNoA",
  authDomain: "insta-fam.firebaseapp.com",
  projectId: "insta-fam",
  storageBucket: "insta-fam.appspot.com",
  messagingSenderId: "164614196547",
  appId: "1:164614196547:web:0609261aac14b1876d33f6",
  measurementId: "G-1BSNJR93KS"
};
if(firebase.apps.length===0){
  firebase.initializeApp(firebaseConfig)
}
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import AddScreen from './components/main/Add'
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'

const Stack = createStackNavigator()
export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }else{
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  render() {
    const {loggedIn, loaded} = this.state
    if(!loaded){
      return(
        <View style={{flex:1, justifyContent: 'center', textAlign: 'center'}}>
          <Text>Loading....</Text>
        </View>
      )
    }
    if(!loggedIn) {
      return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}} navigation={this.props.navigation}/>
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer> 
      )
    }
    return(
      <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{headerTitle: (
            <Image source={require('./assets/banner.png')} style={{width: 100, height: 20, flex: 1, padding: 5, alignSelf: 'center',marginBottom: 5, marginTop: 0}}/> 
            )}}/>
          <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
          <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
          <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} options={{headerTitle: "View Post"}}/>
       </Stack.Navigator>
      </NavigationContainer> 
      </Provider>
      
    )
  }
}

export default App





