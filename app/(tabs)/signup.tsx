import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState<{ uri: string } | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0); // Initialize with 0 for the first image
  const defaultImages = [
    require('@/assets/images/a.png'), // Replace with your images paths
    require('@/assets/images/b.png'),
    require('@/assets/images/c.png'),
    require('@/assets/images/d.png'),
  ];

  const chooseImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
        setSelectedOptionIndex(0); // Clear previously selected option border
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlayContainer}>
        <Image
          source={require('@/assets/images/world_green.png')} // Adjust path as per your folder structure
          style={styles.overlayImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>معلومات الطفل</Text>
        <Text style={[styles.chooseImageText, styles.rightAlign]}>اختر الصورة الرمزية</Text>
        <TouchableOpacity onPress={chooseImage}>
          <Image
            source={profileImage ? profileImage : defaultImages[selectedOptionIndex]}
            style={[
              styles.profileImage,
              profileImage && selectedOptionIndex === null ? styles.selectedProfileImage : null,
            ]}
          />
        </TouchableOpacity>
        <View style={styles.imageOptionsContainer}>
          {defaultImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setProfileImage(image);
                setSelectedOptionIndex(index); // Set selected option index
              }}
            >
              <View style={[styles.optionContainer, selectedOptionIndex === index && styles.selectedOptionImageContainer]}>
                <Image
                  source={image}
                  style={[
                    styles.optionImage,
                    selectedOptionIndex === index && styles.selectedOptionImage,
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.chooseImageText, styles.rightAlign]}>أدخل أسمك</Text>
        <TextInput
          style={styles.input}
          placeholder=" الإسم"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.button} onPress={() => console.log('Name:', name, 'Image:', profileImage)}>
          <Text style={styles.buttonText}>التالي </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Simple white background for the entire screen
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  overlayImage: {
    width: width * 0.66, // Adjust as per your requirement
    height: width * 0.66, // Adjust as per your requirement
    left: width * -0.06,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
    marginTop: height * 0.065,
  },
  title: {
    fontSize: height * 0.04,
    fontWeight: 'bold',
    color: '#002D75',
    marginBottom: height * 0.04,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedProfileImage: {
    borderColor: 'blue', // Border color for selected profile image
  },
  chooseImageText: {
    fontSize: height * 0.02,
    color: '#4D4D4D',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  rightAlign: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  imageOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionContainer: {
    margin: 5,
    overflow: 'hidden',
    borderRadius: (width * 0.15) / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOptionImageContainer: {
    borderColor: 'transparent', // Border color for selected option image container
  },
  optionImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
  },
  selectedOptionImage: {
    borderWidth: 2,
    borderColor: 'blue', // Border color for selected option image
  },
  input: {
    width: width * 0.92,
    height: height * 0.065,
    borderColor: '#D7D7D7',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    textAlign: 'right',
    borderBottomWidth: 6,
    borderBottomColor: '#D3D3D3',
  },
  button: {
    position: 'absolute',
    width: width * 0.86,
    height: height * 0.066,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#0C364D',
    textAlign: 'right',
    bottom: 25,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default App;
