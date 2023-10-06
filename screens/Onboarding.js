import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, Image, Pressable, TextInput, Alert } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import validator from 'validator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


function Onboarding({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [emailLegit, setEmailLegit] = useState(false);
    const [nameLegit, setNameLegit] = useState(false);
    //const navigation = useNavigation();

    const updatePreferences = async (email,firstName) => {
        try {
            const jsonValue = JSON.stringify({email: email, firstName: firstName})
            await AsyncStorage.setItem("userToken", jsonValue)
            console.log(jsonValue)
            
            
        } catch(e) {
            // Handle error
            Alert.alert(`An error occurred: ${e.message}`); 
        }
    }





    function checkEmail(input){
        setEmail(input);

        setEmailLegit(validator.isEmail(email));
        //Alert.alert(String(emailLegit))
        //console.log(emailLegit)
    }

    function checkFirstName(input){
        setFirstName(input);

        setNameLegit(validator.isAlpha(firstName) && firstName.length > 0)
        
    }    

    function buttonPress(){
        updatePreferences(email,firstName);
        //onDone();
        route.params.setState(true);
        
        //navigation.navigate('Home');
    }
    return (
      <View style={styles.bodyContainer}>
        <View style={styles.headerContainer}>
        <Image style={styles.absoluteFill} source={ require('../assets/icon.png') }/>
        </View>
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Let us get to know you</Text>
        </View>
        <View style={styles.container}>
            <Text style={styles.welcomeText}>First Name</Text>
            <TextInput 
                style={styles.inputBox} 
                value={firstName}
                onChangeText={checkFirstName}
                placeholder={'Type your first name'}
            />

            <Text style={styles.welcomeText}>Email</Text>
            <TextInput keyboardType='email-address'
                style={styles.inputBox} 
                value={email}
                onChangeText={checkEmail}
                placeholder={'Type your email'}
                />
        </View>
        <View style={styles.bottomContainer}>
            
            {emailLegit&&nameLegit ? (
            <Pressable style={styles.button} onPress={() => buttonPress()}>
                <View>
                    <Text style={styles.buttonText}>
                        Next
                    </Text>
                </View> 
            </Pressable>):(<></>)}
        </View>
        
        
        
      </View>
    );
}






const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#DEE3E9', 
        padding:5,
        alignSelf:'stretch',
    },
    bodyContainer: {
        flex: 1, 
        backgroundColor: '#CBD2D9', 
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    bottomContainer: {
        flex: 1, 
        jusifySelf: 'flex-end',
        alignSelf: 'stretch',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#F1F4F7', 
    },
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom:100,
    },
    absoluteFill: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        resizeMode:'contain',
    },
    welcomeText:{
        color:'#40535E',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        marginBottom: 10,

    },
    inputBox: {
        height: 50,
        width: 340,
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
        fontWeight: 'bold',
        fontSize: 25,
        fontFamily: 'sans-serif-light',
        color: '#40535E',
        borderColor: '#40535E',
        //backgroundColor: '#DEE3E9',
    },
    button : {
        backgroundColor: '#CBD2D9',
        borderRadius: 10,
        width: 100,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        marginRight:50,
    },
    buttonText : {
        color : '#536674',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        textAlign: 'center',
        margin: 10,
    
    },
});


export default Onboarding;