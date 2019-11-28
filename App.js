/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React , {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Image,
  MapView,
  Text,
  StatusBar,
  Switch
} from 'react-native';



export default class App extends Component{
   
  constructor (props) {
    super (props) ;
    this.state = {
      machine: null,
      isLoading : true,
      dataSource : null,
      startbutton : "Start",
      stopbutton : "Stop",
    }
  }
  disabled = true

  componentDidUpdate(){
    console.log(this.disabled)
  }
  
  componentDidMount = () => {
    this.apiCall()
  }

  apiCall = () => {
    return fetch('https://api.thingspeak.com/channels/871943/fields/1.json?api_key=2RTQXXEHVHBAJ1ID&results=1')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(this.disabled)
        console.log(responseJson)
        this.disabled = false
        this.setState({
          isLoading: false,
          dataSource: responseJson.feeds,
          machine : parseInt(responseJson.feeds[0].field1),
        });
      })
      .catch((error) =>{
        // this.disabled = false
        console.error(error);
      });
  } 
  
  turnOn = () => {
    this.disabled = true
    fetch('https://api.thingspeak.com/update?api_key=89UY3M0WQAQGMEO5', {
      method: 'POST',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      field1: 1,
      }),
    }).then(res => {
      console.log(res)
      this.apiCall()
    }).catch(err => {
      
    })
  }
  
  turnOff = () => {
    this.disabled = true
    fetch('https://api.thingspeak.com/update?api_key=89UY3M0WQAQGMEO5', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      field1: 0,
      }),
    }).then(res => {
      this.apiCall()
    }).catch(err => {

    })

    // this.setState({machine:0})
  }
  
  render () {
    if(this.state.isLoading){
      return(
        <View style={styles.container}>
          <Text>Connecting to the Cloud..</Text>
        </View>
      )
    }
    else{
       let ms = this.state.dataSource.map((val,key) => {
        return <View key={key}><Text style={{color: '#9B0A96'}}>{val.field1}</Text></View>
      });
      
      return (
        <View style={styles.container}>
          <Image style={{width: 300, height: 300}} source={{uri:"https://webstockreview.net/images/clipart-grass-lawn-mower-17.png"}} />
          <Text style={{color: '#0AA23A'}}>ThingsPeak Connected !!</Text>
          <Text>Machine Status : {this.state.machine} </Text>
          <View>
            {this.state.machine ?
            <View>
              <Button title="Stop the Machine" disabled={this.disabled} onPress={this.turnOff}/>
            </View>
            :
            <View>
              <Button title="Start the Machine" disabled={this.disabled} onPress={this.turnOn}/>
            </View>}
          </View>
          
        </View>
      ) ;
    }
       
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize : 30,
  },
  mainHeading: {
    textAlign : 'center',
    alignItems : 'center',
    color : 'skyblue',
    fontSize : 30
  },
 
});