import React, { Component } from "react";
import { StyleSheet, View} from "react-native";
import Mapbox, {MapView} from "@rnmapbox/maps";
//import 'react-native-gesture-handler';
//import {NavigationContainer} from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/native-stack';
//import Main from '../screens/Main';
//import Another from '../screens/Another';
import Config from "react-native-config";

Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

const App = () => {
console.log(Config.MAPBOX_ACCESS_TOKEN);
console.log("no");
  return (
         <View style={styles.page}>
           <View style={styles.container}>
             <Mapbox.MapView
                 style={styles.map}
                 styleURL="mapbox://styles/mapbox/outdoors-v12"
             />
           </View>
         </View>
       );
};

export default App;

const styles = StyleSheet.create({

  page: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  container: {
    height: "100%",

    width: "100%",
  },

  map: {
    flex: 1,
  },
});





