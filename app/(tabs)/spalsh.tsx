import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const ImageWithTextButton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('@/assets/images/earth.png')} // Replace with your image path
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.mainText}>هيا لنبدأ !</Text>
            <Text style={styles.smallText}>مستقبلي في المحافظة على بيئتي</Text>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>ابدأ</Text>
            </TouchableOpacity>
        </View>
    );
};

const handlePress = () => {
    // Handle button press action here
    console.log('Button Pressed');
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.05,
    },
    imageContainer: {
        marginBottom: height * 0.05,
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
    },
    mainText: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        marginBottom: height * 0.02,
        color: '#0C364D',
        textAlign: 'center',
    },
    smallText: {
        fontSize: width * 0.05,
        marginBottom: height * 0.02,
        color: '#0C364D',
        textAlign: 'center',
        fontWeight:400
    },
    button: {
        width: width * 0.8,
        height: height * 0.06,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        backgroundColor: '#0C364D',
        paddingVertical: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
});

export default ImageWithTextButton;
