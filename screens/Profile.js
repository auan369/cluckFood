import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable, TextInput, Button } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import validator from 'validator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
//import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {Restart} from 'fiction-expo-restart';



function CustomHeader({ title, image, firstName, lastName}) {
    const navigation = useNavigation();
  
    const goBack = () => {
      navigation.goBack();
    };

    const renderProfileImage = () => {
        
        // Check if the user has an image or not
        if (image && image.length > 0) {
          return (
            <Image
              source={{ uri: image }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          );
        } 
        else if (firstName || lastName) {
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
          return (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#495E57', // Placeholder background color
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {initials}
              </Text>
            </View>
          );
        }
        return (
            <Image
              source={require('../assets/user.png')} // Replace with your default image
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          );
        // If no image and no initials, you can render a default image or placeholder
        
      };

    return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 25,
            height: 100, // You can adjust the height as needed
            backgroundColor: 'white', // Header background color
          }}
        >
            <Pressable onPress={goBack}>
        
                <FontAwesomeIcon icon={faChevronLeft} size={24} color="black" />
            </Pressable>
            <Image source={require('../assets/icon.png')} style={{ height: 60, resizeMode:'contain'}} />
            {renderProfileImage()}
    </View>
    );
}

function Profile({ navigation, route }){
    const [image, setImage] = useState(null);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [notifCheckboxState, setNotifCheckboxState] = useState(false);
    //const navigation = useNavigation();


    const updatePreferences = async (email,firstName, lastName, phone, image) => {
        try {
            const jsonValue = JSON.stringify({email: email, firstName: firstName, lastName: lastName, phone: phone, notifCheckboxState: notifCheckboxState, image:image})
            await AsyncStorage.setItem("userToken", jsonValue)
            console.log(jsonValue)
            
            
        } catch(e) {
            // Handle error
            Alert.alert(`An error occurred: ${e.message}`); 
        }
    }


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
    };

    const removeImage = async () => {
        setImage(null);
    }

    useEffect(() => {
        // Check if the user is logged in
        checkLoginStatus();
    }, []); 
    /*
    useEffect(() => {
        // Check if the user is logged in
        checkLoginStatus();
    }, [email, firstName]); 
    */


    const checkLoginStatus = async () => {
        try {
          // Retrieve the user's authentication status from AsyncStorage
            let userToken = await AsyncStorage.getItem('userToken');
            userToken = JSON.parse(userToken);
            
            //setEmail(userToken.email);
            if(userToken.email != null){
                setEmail(userToken.email);
            }
            //setFirstName(userToken.firstName);
            if(userToken.firstName != null){
                setFirstName(userToken.firstName);
            }
            if(userToken.lastName != null){
                setLastName(userToken.lastName);
            }
            if(userToken.phone != null){
                setPhone(userToken.phone);
            }
            if(userToken.notifCheckboxState != null){
                setNotifCheckboxState(userToken.notifCheckboxState);
            }
            if(userToken.image != null){
                setImage(userToken.image);
            }
            //setLastName(userToken.lastName);
            //setPhone(userToken.phone);
            //setNotifCheckboxState(userToken.notifCheckboxState);
            //setImage(userToken.image);
        } catch (error) {
          console.error('Error checking login status:', error);
        }
    };

    function changeFirstName(input){
        setFirstName(input);
        console.log(firstName)
    }
    function changeLastName(input){
        setLastName(input);
        console.log(lastName)
    }
    function changeEmail(input){
        setEmail(input);
        console.log(email)
    }
    function changePhone(input){
        setPhone(input);
        console.log(phone)
    }

    function saveChanges(){
        updatePreferences(email,firstName,lastName,phone,image);
    }

    function logout(){
        setLastName('');
        setFirstName('');
        setEmail('');
        setPhone('');
        setNotifCheckboxState(false);
        AsyncStorage.removeItem('userToken');
        //route.params.setIsLoggedIn(false);
        route.params.setState(false);
        //navigation.navigate('Onboarding');
        //Restart( );
        
    }

    return(
        <View style={styles.bodyContainer}>
            <CustomHeader title="Profile" image={image} firstName={firstName} lastName={lastName}/>
            
            <View style={styles.subContainer}>
        
            
                <Text style={styles.titleText}>Personal Information</Text>
                <View style={styles.profileContainer}>
                    <Image source={image? { uri: image }:require('../assets/user.png') } style={{ width: 100, height: 100 }} />
                    <Pressable style={styles.changeButton} onPress={pickImage}><Text style={styles.changeButtonText}>Change</Text></Pressable>
                    <Pressable style={styles.removeButton} onPress={removeImage}><Text style={styles.removeButtonText}>Remove</Text></Pressable>
                    
                </View>
            </View>
            
            <View style={styles.subContainer}>
                            
                
                <Text style={styles.welcomeText}>First Name</Text>
                <TextInput 
                    style={styles.inputBox} 
                    value={firstName}
                    onChangeText={changeFirstName}
                    placeholder={'Type your first name'}
                />

                <Text style={styles.welcomeText}>Last Name</Text>
                <TextInput 
                    style={styles.inputBox} 
                    value={lastName}
                    onChangeText={changeLastName}
                    placeholder={'Type your last name'}
                />

                <Text style={styles.welcomeText}>Email</Text>
                <TextInput keyboardType='email-address'
                    style={styles.inputBox} 
                    value={email}
                    onChangeText={changeEmail}
                    placeholder={'Type your email'}
                />

                <Text style={styles.welcomeText}>Phone number</Text>
                <TextInput 
                    style={styles.inputBox} 
                    value={phone}
                    onChangeText={changePhone}
                    placeholder={'Type your phone number'}
                />
            </View>
            
            <View style={styles.bottomContainer}> 
                <View style={styles.profileContainer}>
                    <BouncyCheckbox isChecked={notifCheckboxState} disableBuiltInState onPress={() => setNotifCheckboxState(!notifCheckboxState)} /> 
                    <Text style={styles.welcomeText}>Receive notifications</Text>
                </View>
                
                <View style={styles.profileContainer}>
                    <Pressable style={styles.changeButton} onPress={saveChanges}><Text style={styles.changeButtonText}>Save</Text></Pressable>
                    <Pressable style={styles.removeButton} onPress={logout}><Text style={styles.removeButtonText}>Logout</Text></Pressable>
                </View>
            </View>
            
        
        
        
        </View>
    )
}

const styles = StyleSheet.create({
    bodyContainer: {
        //flex: 1, 
        backgroundColor: 'white', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        alignItems:'stretch'
    },
    subContainer: {
        //flex:1,
        padding:10,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    bottomContainer: {
        
        padding:10,
        alignSelf: 'flex-start',
        justifyContent: 'flex-end',
        //backgroundColor: '#F1F4F7', 
    },
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom:100,
    },
    profileContainer:{
        
        flexDirection:'row',
        //flex:1,
        justifyContent:'space-between',
        alignContent:'center',
        
    },
    absoluteFill: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        resizeMode:'contain',
    },
    titleText:{
        color:'#40535E',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        alignSelf: 'flex-start',
        marginBottom: 10,

    },
    inputBox: {
        height: 35,
        width: 340,
        alignSelf: 'center',
        marginBottom: 10,
        borderWidth: 3,
        borderRadius: 10,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 10,
        paddingRight: 10,
        
        fontWeight: 'bold',
        fontSize: 15,
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
    welcomeText:{
        color:'#40535E',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        marginBottom: 5,

    },
    changeButton:{
        width: 100,
        padding: 5,
        margin:10,
        marginLeft:20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: '#495E57',
        color: '#495E57',
        borderRadius: 10,

    },
    changeButtonText:{
        color: 'white',
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
    },
    removeButton:{
        width: 100,
        padding: 5,
        margin:10,
        height: 40,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#495E57',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#495E57',
    },
    removeButtonText:{
        color: '#495E57',
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
    }
});


export default Profile;