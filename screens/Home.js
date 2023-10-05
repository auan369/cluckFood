import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Text, Image, Pressable, TextInput, Button } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import validator from 'validator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
//import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon.db');
const images = {
    pasta: require('../assets/pasta.jpg'),
    lemonDessert: require('../assets/lemonDessert.jpg'),
    grilledFish: require('../assets/grilledFish.jpg'),
    bruschetta: require('../assets/bruschetta.jpg'),
    greekSalad: require('../assets/greekSalad.jpg'),
};



  

  
const Item = ({name, price, description,image}) => {
    
    return(
  
    <View style={styles.item}>
        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.price}>${price}</Text>
            </View>
            <View>
                <Image source={images[image]} style={{ width: 50, height: 50, resizeMode:'contain'}} />
            </View> 
             
        </View>
        <Text style={styles.lineText}>_____________________________________________________</Text>
    </View>
  )
};

function MenuList({data}){
    return (
        <SafeAreaView style={styles.container}>
        <View style={{flex:1}}>
          <FlatList
            data={data}
            renderItem={({item}) => <Item name={item.name} price={item.price} description={item.description} image={item.image}/>}
            keyExtractor={item => item.name}
            style={{}}
          />
        </View>
        </SafeAreaView>
    );
    
}
function CustomHeader({ title, image, firstName, lastName}) {
    const navigation = useNavigation();
   
    const goBack = () => {
      navigation.goBack();
    };

    const goToProfile = () => {
        navigation.navigate('Profile');
    };

    const renderProfileImage = () => {
        // Check if the user has an image or not
        if (image && image.length > 0) {
            console.log("jebus"+image) 
          return (
            <Pressable onPress={goToProfile}>
                <Image
                source={{ uri: image }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
                />
            </Pressable>
          );
        } 
        else if (firstName || lastName) {
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
          return (
            <Pressable onPress={goToProfile}>
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
            </Pressable>
          );
        }
        return (
            <Pressable onPress={goToProfile}>
                <Image
                source={require('../assets/user.png')} // Replace with your default image
                style={{ width: 32, height: 32, borderRadius: 16 }}
                />
            </Pressable>
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
            
            <FontAwesomeIcon icon={faChevronLeft} size={24} color="white" />
            
            <Image source={require('../assets/icon.png')} style={{ height: 60, resizeMode:'contain'}} />
            {renderProfileImage()}
    </View>
    );
}

function Home(){
    const [image, setImage] = useState(null);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [notifCheckboxState, setNotifCheckboxState] = useState(false);
    const [data, setData] = useState(null);
    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    function createTable() {
        db.transaction(tx => {
            tx.executeSql(
            'CREATE TABLE IF NOT EXISTS menu_items (id INTEGER PRIMARY KEY AUTOINCREMENT,category TEXT, description TEXT, image TEXT, name TEXT, price REAL)'
            );
        });
    }

    function clearMenuItemsTable() {
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              'DELETE FROM menu_items',
              [],
              (_, results) => {
                resolve('Menu items table cleared successfully');
              },
              (_, error) => {
                reject(error);
              }
            );
          });
        });
    }
    
    function insertMenuItem(category, description, image, name, price) {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO menu_items (category, description, image, name, price) VALUES (?, ?, ?, ?, ?)',
            [category, description, image, name, price],
            (_, results) => {
              if (results.rowsAffected > 0) {
                console.log('Menu item inserted successfully');
              } else {
                console.warn('Failed to insert menu item');
              }
            }
          );
        });
      }
    async function fetchAndStoreMenuData() {
        try { 
            // Fetch data from your API endpoint (replace with your actual API endpoint)
            createTable();
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json',);
            const data = await response.json();
            console.log("Start", data.menu);
            
            data.menu = data.menu.map(item => {
                return {
                    ...item,
                    //image: `../assets/${item.image}`
                    image:item.image.substring(0, item.image.length - 4)
                };
            });
            setData(data.menu);
            console.log("Start", data.menu);
    
            // Create the table (only needs to be done once)
            
            clearMenuItemsTable()
                .then(message => {
                    console.log(message);
                })
                .catch(error => {
                    console.error('Error clearing menu items table:', error);
                });
            
    
            // Insert menu items into the database
            data.menu.forEach(menuItem => {
            insertMenuItem(menuItem.category, menuItem.description, menuItem.image, menuItem.name, menuItem.price);
            });
        } catch (error) {
            console.error('Error fetching and storing menu data:', error); 
        }
    }

    function getMenuItemsByCategory(category) {
        return new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM menu_items WHERE category = ?', 
              [category],
              (_, results) => {
                const menuItems = [];
                for (let i = 0; i < results.rows.length; i++) {
                    const row = results.rows.item(i);
                    menuItems.push({
                    id: row.id,
                    category: row.category,
                    description: row.description,
                    image: row.image,
                    name: row.name,
                    price: row.price, 
                  });
                }
                resolve(menuItems);
                //console.log(menuItems);
              },
              (_, error) => {
                reject(error);
              }
            );
          });
        });
    }

    function getMenuItemsByName(name) {
        return new Promise((resolve, reject) => {
            const query = `%${name}%`;
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM menu_items WHERE name LIKE ?', 
                    [query],
                    (_, results) => {
                        const menuItems = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            const row = results.rows.item(i);
                            menuItems.push({
                                id: row.id,
                                category: row.category,
                                description: row.description,
                                image: row.image,
                                name: row.name,
                                price: row.price, 
                            });
                        }
                        resolve(menuItems);
                        //console.log(menuItems);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    }


    function getAllMenuItems() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM menu_items',
            [],
            (_, results) => {
            const menuItems = [];
            for (let i = 0; i < results.rows.length; i++) {
                const row = results.rows.item(i);
                menuItems.push({
                id: row.id,
                name: row.name,
                price: row.price,
                description: row.description,
                image: row.image,
                category: row.category,
                });
            }
            resolve(menuItems);
            },
            (_, error) => {
            reject(error);
            }
        );
        });
    });
    }




    const updatePreferences = async (email,firstName, lastName, phone, image) => {
        try {
            const jsonValue = JSON.stringify({email: email, firstName: firstName, lastName: lastName, phone: phone, notifCheckboxState: notifCheckboxState, image: image})
            await AsyncStorage.setItem("userToken", jsonValue)
            console.log(jsonValue)
            
            
        } catch(e) {
            // Handle error
            Alert.alert(`An error occurred: ${e.message}`); 
        }
    }


    

    useEffect(() => {
        // Check if the user is logged in
        checkLoginStatus();
        
        fetchAndStoreMenuData();
        console.log("useEffect", data);
        // getMenuFromApiAsync();  
        // console.log("useEffect", data);
        
        getAllMenuItems()
            .then(menuItems => {
                console.log('All Menu Items:');
                menuItems.forEach(item => {
                console.log(`ID: ${item.id}, Name: ${item.name}, Price: ${item.price}, Description: ${item.description}, Image: ${item.image}, Category: ${item.category}`);
                });
            })
            .catch(error => {
                console.error('Error fetching all menu items:', error);
            });
        
    }, []); 
    /*
    useEffect(() => {
        // Check if the user is logged in
        checkLoginStatus();
    }, [email, firstName]); 
    

    useEffect(() => {
        db.transaction((tx) => {
          tx.executeSql(
            'create table if not exists menu (name text primary key not null, price integer, description text, image text, category text);'
          );
          
          for (let i = 0; i < DATA.length; ++i) {
            tx.executeSql(
              'insert into menu (name, price, description, image, category) values(?, ?, ? , ?, ?)',
              [DATA[i].name, DATA[i].price, DATA[i].description, DATA[i].image, DATA[i].category]
            );
          }

          
          console.log("database 1\n");

        });
        console.log("database 2\n"); 
      }, []);
    */

    function filter(category){
        
        getMenuItemsByCategory(category)
            .then(menuItems => {
                console.log(`Menu items in the ${category} category:`, menuItems);
                setData(menuItems)
            })
            .catch(error => {
                console.error('Error fetching menu items by category:', error);
            });
        console.log("filter", data)
    }

    function filterName(nameFud){
        getMenuItemsByName(nameFud)
            .then(menuItems => {
                console.log(`Menu items by name ${nameFud}:`, menuItems);
                setData(menuItems)
            })
            .catch(error => {
                console.error('Error fetching menu items by name:', error);
            });
        console.log("filter", data)
        if (nameFud == ''){
            getAllMenuItems()
            .then(menuItems => {
                console.log('All Menu Items:');
                menuItems.forEach(item => {
                console.log(`ID: ${item.id}, Name: ${item.name}, Price: ${item.price}, Description: ${item.description}, Image: ${item.image}, Category: ${item.category}`);
                });
                setData(menuItems)
            })
            .catch(error => {
                console.error('Error fetching all menu items:', error);
            });
        }
    }

    const getMenuFromApiAsync = async () => {
        try {
          const response = await fetch(
            'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json',
          );
          const json = await response.json();
          setData(json.menu);
          console.log(data);
          data.map((item) => { 
            db.transaction((tx) => {
            tx.executeSql(
                'insert into menu (name, price, description, image, category) values(?, ?, ? , ?, ?)',
                [item.name, item.price, item.description, item.image, item.category]
            );
            });
          })
        } catch (error) {
          console.error(error);
        }
    };

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
        updatePreferences(email,firstName,lastName,phone);
    }
    function changeSearch(input){
        setSearch(input);
        console.log(search);
        filterName(search)
        if (input == ''){
            getAllMenuItems()
            .then(menuItems => {
                console.log('All Menu Items:');
                menuItems.forEach(item => {
                console.log(`ID: ${item.id}, Name: ${item.name}, Price: ${item.price}, Description: ${item.description}, Image: ${item.image}, Category: ${item.category}`);
                });
                setData(menuItems)
            })
            .catch(error => {
                console.error('Error fetching all menu items:', error);
            });
        }
    }

    

    return(
        <View style={styles.bodyContainer}>
            <CustomHeader title="Home" image={image} firstName={firstName} lastName={lastName}/>
            
            <View style={styles.infoContainer}>
        

                <Text style={styles.titleText}>Cluck 'n' Crave</Text>
                <Text style={styles.subtitleText}>Singapore</Text>
                <View style={{flexDirection:"row"}}>
                    <Text style={[styles.bodytitleText,{flex:2}]}>Welcome to Cluck 'n' Crave! We are two college students who turned their passion for flavorful chicken into a mouthwatering reality. This cozy eatery brings you a taste of homemade goodness with a modern twist.</Text>
                    <Image source={require('../assets/heroImage.jpg')} style={{ flex:1, width: 150, height: 150, resizeMode:'cover', alignSelf:'center'}} />
                </View>
                
                
            </View>
            
            <View style={styles.subContainer}>
                <Text style={styles.orderText}>ORDER FOR DELIVERY!</Text>
                
                <View style={styles.buttonRowContainer}>
                    <Pressable style={styles.button} onPress={()=>filter("starters")}>
                        <Text style={styles.filterButtonText}>Starters</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={()=>filter("mains")}>
                        <Text style={styles.filterButtonText}>Mains</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={()=>filter("desserts")}>
                        <Text style={styles.filterButtonText}>Desserts</Text>
                    </Pressable>
                    
                </View>
                <View style={styles.searchRowContainer}>
                    <Pressable style={styles.searchButton} onPress={()=>filterName(search)}> 
                        <FontAwesomeIcon icon={faSearch} size={24} color="black" />
                    </Pressable>
                    <TextInput 
                            style={styles.inputBox} 
                            value={search}
                            onChangeText={changeSearch}
                            placeholder={'What item would you like to search?'}
                    />
                </View>
                

                
               
            </View>
            <MenuList data={data}/>
            
    
            
        
        
        
        </View>
    )
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1, 
        backgroundColor: 'white', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        alignItems:'stretch'
    },
    infoContainer: {
        padding:10,
        backgroundColor: '#495e57',

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
        flex:1,
        //width: 350,
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow:"visible",
        //padding:10,
        backgroundColor: '#F1F4F7',
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
        color:'#f4ce14',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        alignSelf: 'flex-start',
        //marginBottom: 10,

    },
    subtitleText:{
        color:'#edefee',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        alignSelf: 'flex-start',
        marginBottom: 10,

    },
    bodytitleText:{
        color:'#edefee',
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        alignSelf: 'flex-start',
        //marginBottom: 10,

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
        backgroundColor: '#edefee',
        borderRadius: 10,
        width: 100,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        margin:5,
    },
    buttonText : {
        color : '#2c2c2c',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        textAlign: 'center',
        margin: 10,
    
    },
    searchButton : {
        //backgroundColor: '#CBD2D9',
        borderRadius: 10,
        //width: 100,
        alignSelf: 'center',
        justifyContent: 'centre',
        //margin:15,
    },
    orderText:{
        color:'#333333',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        marginBottom: 5,
        
    },
    filterButtonText:{
        color:'#40535E',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        marginBottom: 5,
        alignSelf:"center"
    },
    lineText:{
        color:'#40535E',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-light',
        padding: 10,
        overflow: 'hidden',
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
    buttonRowContainer:{
        flexDirection:'row',
        justifyContent:"space-evenly",
        overflow:'hidden',
        alignContent:'center',
        color: '#495E57',
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
    },
    searchRowContainer:{
        //backgroundColor:'#DEE3E9',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignContent:'center',
        color: '#495E57',
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
    },
    item:{
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        //flexDirection:'row',
        //flex:1,
        justifyContent:'space-between',
    },
    name:{
        fontWeight: 'bold',
        fontSize: 20,
    },
    description:{
        fontStyle:'italic',
        fontSize: 15,
    },
    price:{
        fontWeight: "bold",
        fontFamily:"sans-serif-light",
        fontSize: 18,
    },
    inputBox: {
        height: 35,
        width: 340,
        alignSelf: 'center',
        margin: 10,
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
});


export default Home;