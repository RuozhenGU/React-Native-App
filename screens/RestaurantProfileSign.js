import React, { Component } from 'react';
import { Text, ScrollView, View, Alert, StyleSheet, Image, Picker, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, } from 'react-native';
// You can import from local files

// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // Version can be specified in package.json
import { MaterialIcons, FontAwesome, Ionicons, MaterialCommunityIcons, SimpleLineIcons, Feather } from '@expo/vector-icons';



import { createBottomTabNavigator } from 'react-navigation'

// import SignIn from './Signin'
import Amplify, { Auth, API } from 'aws-amplify'
import AWSConfig from '../aws-exports'
Amplify.configure(AWSConfig)

import {
  addRestaurant,
} from '../actions/actions'

import { connect } from 'react-redux'

export class SignIn extends React.Component {


      static navigationOptions = {
    header: null,
      tabBarLabel : "Sign In",
  tabBarIcon : ({focused}) => (
    <Feather 
      name="user-check"
      size={25}
    />
  )
  };



  state = {
    username: '',
    password: '',
    confirmationCode: '',
    user: {}
  }


  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  

  handleAddRestaurant(obj) {
      this.props.dispatch(addRestaurant(obj))
    }


      async getRestaurant() {
      console.log('getRestaurant started')
      const path = "/RestaurantProfileTable/object/" + this.state.username;

      try {
        console.log('try started')
        const restaurant = await API.get("RestaurantProfileTableCRUD", path);
        console.log('After api response')
        // console.log(apiResponse);
        this.setState({restaurant});
        console.log('******************************************************************')
        this.handleAddRestaurant(restaurant)
        this.props.navigation.navigate('RestaurantProfilePage')
      } catch (e) {
        console.log(e);
      }
    }


  signIn() {
        if(this.state.password === "") {
      Alert.alert('password cannot be empty')
    } else {
    const { username, password } = this.state
    Auth.signIn(username, password)
    .then(user => {
      this.setState({ user })
      console.log(user)
      this.getRestaurant()
      Alert.alert('Sign in succesful!')
      // this.props.navigation.navigate('RestaurantProfilePage')
      // Alert.alert('Your Information is correct. Please enter the confirmation code you will receive via text')
    })
    .catch(err => {Alert.alert(JSON.stringify(err));console.log('error signing in!: ', err);})
    // this.props.navigation.navigate('CustomerProfile')
  }
}

  confirmSignIn() {
    Auth.confirmSignIn(this.state.user, this.state.confirmationCode)
    .then(data => {
      console.log(data)
      this.props.screenProps.authenticate(true)
    })
    .catch(err => {Alert.alert(JSON.stringify(err));console.log('error confirming signing in!: ', err)})
  }

  forgotPassword() {
    
    Auth.forgotPassword(this.state.username)
    .then(data => {Alert.alert('Please enter your new password and the confirmation code below');console.log(data)})
    .catch(err => {Alert.alert(JSON.stringify(err));console.log(err)});

  }

  submitNewPassword() {
    Auth.forgotPasswordSubmit(this.state.username, this.state.confirmationCode, this.state.password)
    .then(data => {Alert.alert('Your password has been changed successfully');console.log('password change succesfull')})
    .catch(err => {Alert.alert(JSON.stringify(err));console.log(err)});
}


  render() {
    return (
      <View style={styles.container}>
      <Image style={{width: '100%', height: 180, marginBottom:25}} source={{uri:'https://static.wingify.com/vwo/wp-content/themes/vwo/images/page-features/customer_support@2x.png'}}/>
        <TextInput
          onChangeText={value => this.onChangeText('username', value)}
          style={styles.input}
          placeholder='username'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        <TextInput
          onChangeText={value => this.onChangeText('password', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='password'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        <Button title="Sign In" onPress={this.signIn.bind(this)} />
        <TextInput
          onChangeText={value => this.onChangeText('confirmationCode', value)}
          style={styles.input}
          placeholder='confirmation Code'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        <View style={{justifyContent:'center', flexDirection:'row'}}>
        <Button title="Forgot Password" onPress={this.forgotPassword.bind(this)} />
        <Button title="Submit Password" onPress={this.submitNewPassword.bind(this)} />
        </View>
      </View>
    );
  }
}



class SignUp extends React.Component {


    static navigationOptions = {
    header: null,
      tabBarLabel : "Sign Up",
  tabBarIcon : ({focused}) => (
    <Feather 
      name="user-plus"
      size={25}
    />
  )
  };


  state = {
    username: '',
    password: '',
    phoneNumber: '',
    email: '',
    confirmationCode: '',
    category: '',
    closetime: '',
    location: '',
    opentime: '',
    owner_name: '',
    rest_name: '',
    spicy_level: 'medium',
    url: '',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }


  async saveRestaurant() {
    console.log('save rating called')
    let newRestaurant = {
      body: {
  "category": this.state.category,
  "closetime": this.state.closetime,
  "curr_holding_count": 0,
  "email": this.state.email,
  "image": "https://app.luxembourg-city.com/images/2380-crop-950x550x90.jpg",
  "item_count_number": 0,
  "location": this.state.location,
  "menu": [],
  "mtl_order_count": 0,
  "mtl_revenue": 0,
  "onduty": false,
  "opentime": this.state.opentime,
  "owner_name": this.state.owner_name,
  "phone": this.state.phoneNumber,
  "rating": 3,
  "rest_id": this.state.username,
  "rest_name": this.state.rest_name,
  "spicy_level": this.state.spicy_level,
  "total_order_count": 0,
  "total＿revenue": 0,
  "url": this.state.url,
  "reviews": []
}
    }
    const path = "/RestaurantProfileTable";

    // Use the API module to save the note to the database
    console.log('reached try block')
    try {
      console.log('try start')
      const apiResponse = await API.put("RestaurantProfileTableCRUD", path, newRestaurant)
      console.log('apiResponse called')
      console.log(apiResponse);
      this.setState({apiResponse});
    } catch (e) {
      console.log(e);
    }
  }




  signUp() {
    if(this.state.phoneNumber === "") {
      Alert.alert('phone number is required')
    } else {
    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: {
        email: this.state.email,
        phone_number: this.state.phoneNumber
      }
    })
    .then(data => {Alert.alert("You will receive a confirmation code shortly! Please enter below");console.log(data)})
    .catch(err => {Alert.alert(JSON.stringify(err));console.log('error signing up!: ', err)})
  }
}


  confirmSignUp() {
    Auth.confirmSignUp(this.state.username, this.state.confirmationCode)
    .then(data => {
      this.saveRestaurant();
      Alert.alert('You have successfully signed up. Please go to Sign in screen');
      console.log(data)})
    .catch(err => {Alert.alert(JSON.stringify(err));console.log('error confirming signing up!: ', err)})
  }

  render() {
    return (

      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ScrollView>
      <Text style={{fontSize:25, fontWeight:'bold',alignSelf:'center'}}>Restaurant Sign Up Form</Text>
        <TextInput
          onChangeText={value => this.onChangeText('rest_name', value)}
          style={styles.input}
          placeholder='Restaurant Name'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        <TextInput
          onChangeText={value => this.onChangeText('owner_name', value)}
          style={styles.input}
          placeholder='Owner Name'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        <TextInput
          onChangeText={value => this.onChangeText('category', value)}
          style={styles.input}
          placeholder='Restaurant Category'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        <TextInput
          onChangeText={value => this.onChangeText('opentime', value)}
          style={styles.input}
          placeholder='Open time'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />

        <TextInput
          onChangeText={value => this.onChangeText('closetime', value)}
          style={styles.input}
          placeholder='Close time'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />

<TextInput
          onChangeText={value => this.onChangeText('location', value)}
          style={styles.input}
          placeholder='Address'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />                

          
          <Text style={{paddingLeft:15,}}>Spicy Level</Text>
          <Picker
            style={{ width: 400, height: 80, justifyContent: 'center', overflow: 'hidden' }}
            selectedValue={this.state.spicy_level}
            onValueChange={(itemValue, itemIndex) => this.setState({ spicy_level: itemValue })}>
            <Picker.Item label="mild" value="mild" color='#fff'/>
            <Picker.Item label="medium" value="medium" color='#fff'/>
            <Picker.Item label="hot" value="hot" color='#fff'/>
          </Picker>

                <TextInput
          onChangeText={value => this.onChangeText('url', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='website'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />

        <TextInput
          onChangeText={value => this.onChangeText('username', value)}
          style={styles.input}
          placeholder='username'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />        
        <TextInput
          onChangeText={value => this.onChangeText('password', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='password'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />

                <TextInput
          onChangeText={value => this.onChangeText('phoneNumber', value)}
          style={styles.input}
          placeholder='phone'
          defaultValue = '+1'
          keyboardType={'numeric'}
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        

        <TextInput
          onChangeText={value => this.onChangeText('email', value)}
          style={styles.input}
          placeholder='email'
          keyboardType={'email-address'}
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />

        <Button title="Sign Up" 
        onPress={this.signUp.bind(this)} />
        <TextInput
          onChangeText={value => this.onChangeText('confirmationCode', value)}
          style={styles.input}
          placeholder='confirmation Code'
          placeholderTextColor="grey" 
          underlineColorAndroid='#000'
        />
        <Button title="Confirm Sign Up" onPress={this.confirmSignUp.bind(this)} />

      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}



const config = {
  SignIn: { screen: connect()(SignIn) },
  SignUp: { screen: SignUp }
}

export default createBottomTabNavigator(config)




const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 10,
    padding:10,
    backgroundColor:"rgba(225,255,255,0.2)",
    color:'#fff',
    borderRadius:15,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingVertical: 30
  },
});
