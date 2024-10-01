import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Context } from "../globalContext/globalContext.js"

function Splash(props) {
	const globalContext = useContext(Context)
	const { isLoggedIn } = globalContext;


	return(
	/*Testing splash screen*/
		<View>
			<Text>Hello User!</Text>
			<Text>You are {(isLoggedIn)? ' ' : "Not"} logged in</Text>
		</View>
	)
}

export default Splash;