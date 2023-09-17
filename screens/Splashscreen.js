import { StyleSheet, Text, View, Image } from 'react-native';
export default function SplashScreen() {
    return (
      <View style={styles.container}>
        <Image style={styles.absoluteFill} source={ require('../assets/icon.png') }/>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom:100,
    },
});