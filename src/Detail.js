import React from 'react'
import { 
    View, 
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingScreen from './LoadingScreen';

const renderItinerary = (text) => {
    const formattedText = text.replace(/\*\*/g, "").replace(/\*/g, "");
    const dayWiseItinerary = []
    const lines = formattedText.split("\n");

    let currentDayDetails = [];
    let currentDayTitle = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith("Day")) {
            if (currentDayDetails.length > 0) {
                dayWiseItinerary.push({ 
                    day: currentDayTitle, 
                    details: currentDayDetails 
                });
            }
            currentDayTitle = line;
            currentDayDetails = [];
        } else {
            currentDayDetails.push(
                <Text key={i} style={styles.itinerary}>
                    {line}
                    </Text>
            );
        }
    }


    if (currentDayDetails.length > 0) {
        dayWiseItinerary.push({ 
            day: currentDayTitle, 
            details: currentDayDetails 
        });
    }

    return dayWiseItinerary.map((dayData, index) => (
        <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{dayData.day}</Text>
            {dayData.details}
        </View>
    ));
};


const Detail = ( { route }) => {
    const navigation = useNavigation();
    const { itinerary, isLoading} = route.params;
    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Travel Itinerary</Text>
                </View>
                <FlatList
                    data = {renderItinerary(itinerary)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => item}
                />
                </>
            )}
        </SafeAreaView>
    )
}

export default Detail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    dayContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    dayTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itinerary: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },

});