import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

const LoadingScreen = () => {
    const loadingTexts = [
        "Loading...",
        "Cooking special Itinerary...",
        "Planing your adventure...",
        "Exploring destinations..."
    ];
    const [currentText, setCurrentText] = React.useState(loadingTexts[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
        setCurrentText((prevText) => {
            const currentIndex = loadingTexts.indexOf(prevText);
            const nextIndex = (currentIndex + 1) % loadingTexts.length;
            return loadingTexts[nextIndex];
        });
    }, 2000);
    return () => clearInterval(interval);
}, []);


  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.text}>{currentText}</Text>
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        color:'white',
        fontSize:20,
        marginTop:20
    }
})