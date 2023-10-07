import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/Splashscreen';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const isInitialMount = useRef(true);

  const onDone = () => {
    setIsLoggedIn(true);
  };
  
  // useEffect(() => {
  //   // Check if the user is logged in
  //   checkLoginStatus();
  //   isInitialMount.current = false;
  // },[]); 
  useEffect(() => {
    // Check if the user is logged in
    checkLoginStatus();
    console.log(isLoggedIn)
    if (isInitialMount.current){
      isInitialMount.current = false;
    }
    else{
      checkLoginStatus();
    }
  }, []); 

  useEffect(() => {
    // Check if the user is logged in
    checkLoginStatus();
    console.log(isLoggedIn)
    if (isInitialMount.current){
      isInitialMount.current = false;
    }
    else{
      checkLoginStatus();
    }
  }, [isLoggedIn, isInitialMount]); 

  


  const checkLoginStatus = async () => {
    try {
      // Retrieve the user's authentication status from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');
      console.log(userToken);

      // Check if the userToken exists (user is logged in)
      if (userToken) {
        setIsLoggedIn(true);
        
      } else {
        setIsLoggedIn(false);
        
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
    isInitialMount.current = false;
  };

  if (isInitialMount.current) {
     // We haven't finished reading from AsyncStorage yet
    //console.log(isInitialMount.current)
    return <SplashScreen />;
  } 
  /*
(<Stack.Screen name="Onboarding" 
            component={Onboarding} 
            options={{
              headerShown: false}}
          />
  */
  /*
  return (
    <>
      {isLoggedIn ?
      (<NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
          <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false, onDone:onDone}}/>
        </Stack.Navigator>
      </NavigationContainer>) : <Onboarding onDone={onDone}/>
      }
    </>
  );
  */
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ?(
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} initialParams={{ setState: setIsLoggedIn}}/> 
        </> 
      ) : (
        <>
          <Stack.Screen name="Onboarding" component={Onboarding} initialParams={{ setState: setIsLoggedIn}}/>
        </>
      )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: '#DEE3E9', 
    paddingTop:10,
  },
  absoluteFill: {
    alignSelf: 'center',
    width: 200,
    resizeMode:'contain',
  },
});

export default App;
