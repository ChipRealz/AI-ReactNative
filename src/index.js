import React from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import{
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
} from '@google/generative-ai';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import LoadingScreen from './LoadingScreen';


const API_KEY = "AIzaSyCPBpINn_7hFk80ztIoqPfw2V6sf78zhko";
const MODEL_NAME = "gemini-1.5-pro-latest";

const Home = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });

            const generationConfig = {
                temperature: 1,
                topK: 0,
                topP: 0.95,
                maxOutputTokens: 12000,
            };

            const safetySettings = [
                {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ];

            const chat = model.startChat({
                generationConfig,
                safetySettings,
                history: [],
            });
            
            const prompt = `
                Name: ${data.name}
                Starting place: ${data.startingPlace}
                Destination: ${data.destination}
                Duration: ${data.duration} days
                Budget: ${data.budget} VND

                Please provide a day-wise itinerary for visiting the famous and popular places, as well as locally famous places, including why they are famous and what local food to try. Also, recommend hotels, how to reach them, and any cautions to be taken care of. Please note that the budget does not include flights, trains, and hotels. The hotel and flight are may vary, and the provided information is just an estimate.
            `;

            const result = await chat.sendMessage(prompt);
            const response = result.response;
            console.log(response.text());
            navigation.navigate('Detail', { itinerary: response.text()});
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <View style={styles.container}>
        { isLoading ? (
            <LoadingScreen />
        ) : (
            <>
            <Text style={styles.heading}>
        AI Travel itinerary generator
        </Text>
        <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your Name"
                    placeholderTextColor="gray"
                />
            )}
            name="name"
            />
            {errors.name && <Text style={styles.error}>This is required.</Text>}       
            <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter starting place"
                    placeholderTextColor="gray"
                />
            )}
            name="startingPlace"
            />
            {errors.name && <Text style={styles.error}>Starting is required.</Text>}
            <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter Destination"
                    placeholderTextColor="gray"
                />
            )}
            name="destination"
            />
            {errors.name && <Text style={styles.error}>Destination is required.</Text>}
            <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter Duration in Days"
                    placeholderTextColor="gray"
                    keyboardType='numeric'
                />
            )}
            name="duration"
            />
            {errors.name && <Text style={styles.error}>Duration must be a valid number.</Text>}
            <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter Budget in VND"
                    placeholderTextColor="gray"
                    keyboardType='numeric'
                />
            )}
            name="budget"
            />
            {errors.name && <Text style={styles.error}>Budget must be a valid number.</Text>} 
            <TouchableOpacity 
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            >
                <Text style={styles.buttonText}>
                    Generate Itinerary
                    </Text>
            </TouchableOpacity>     
            </>
        )}
    </View>
  );
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding:20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 50,
        color:'white',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 7,
        paddingHorizontal: 10,
        fontSize: 15,
        borderRadius:15,
        color:'white',
    },
    error: {
        color: 'red',
        fontSize: 15,
        marginBottom:10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor:"#FF6347",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

});