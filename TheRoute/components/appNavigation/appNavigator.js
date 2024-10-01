import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/splash.js'
import { View } from 'react-native';

const Stack = createStackNavigator();

function Navigator(props) {
	return (
		/*Set up app splash screen on navigator */
		<Stack.Navigator initialRouteName="Splash">
			<Stack.Screen name ="Splash" component={Splash} options={{ headerShown: false }} />

		</Stack.Navigator>
	)

}

export default Navigator;