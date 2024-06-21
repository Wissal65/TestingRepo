import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback, Text, Alert, Dimensions, useWindowDimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

type CircleZone = {
  cx: number;
  cy: number;
  radius: number;
  color: string;
};

type ImageWithZones = {
  image: any;
  zones: CircleZone[];
};


const imagesWithZones: ImageWithZones[] = [
  {
    image: require('@/assets/images/back_prob.png'),
    zones: [
      { cx: 0.79, cy: 0.32, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
      { cx: 0.8, cy: 0.49, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
    ],
  },
  
  {
    image: require('@/assets/images/back_prob2.png'),
    zones: [
        { cx: 0.2, cy: 0.56, radius: 0.12, color: 'rgba(0, 255, 0, 0)' },
        { cx: 0.12, cy: 0.46, radius: 0.06, color: 'rgba(255, 255, 0, 0)' },
        { cx: 0.85, cy: 0.415, radius: 0.06, color: 'rgba(255, 255, 0, 0)' },
    ],
  },
  
  {
    image: require('@/assets/images/back_prob3.png'),
    zones: [
        { cx: 0.32, cy: 0.64, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
        { cx: 0.48, cy: 0.32, radius: 0.14, color: 'rgba(255, 255, 0, 0)' },

    ],
  },
  {
    image: require('@/assets/images/back_prob4.png'),
    zones: [
        { cx: 0.32, cy: 0.54, radius: 0.148, color: 'rgba(0, 255, 0, 0)' },

    ],
  },
  {
    image: require('@/assets/images/back_prob5.png'),
    zones: [
        { cx: 0.32, cy: 0.54, radius: 0.148, color: 'rgba(0, 255, 0, 0)' },

    ],
  },
  // Add other images with zones here...
];


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const App = () => {
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [detectedZones, setDetectedZones] = useState<boolean[]>(new Array(imagesWithZones[0].zones.length).fill(false));



  useEffect(() => {
    const loadSounds = async () => {
      const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
      const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/right.mp3'));
      setClickSound(click);
      setCorrectSound(correct);
    };

    loadSounds();

    return () => {
      if (clickSound) {
        clickSound.unloadAsync();
      }
      if (correctSound) {
        correctSound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const saveScore = async () => {
      try {
        await AsyncStorage.setItem('score', score.toString());
      } catch (error) {
        console.error('Failed to save score to AsyncStorage', error);
      }
    };

    saveScore();
  }, [score]);

  const handleGeneralClick = () => {
    if (clickSound) {
      clickSound.replayAsync();
    }
  };

  const handleZonePress = (zoneIndex: number) => {
    if (gameOver || disableClick || selectedZones.includes(zoneIndex)) return;

    if (clickSound) {
      clickSound.replayAsync();
    }

    setSelectedZones((prevSelectedZones) => [...prevSelectedZones, zoneIndex]);
    setScore((prevScore) => prevScore + 1);

    const currentZones = imagesWithZones[currentImageIndex].zones;

    setDetectedZones((prevDetectedZones) => {
      const updatedDetectedZones = [...prevDetectedZones];
      updatedDetectedZones[zoneIndex] = true;
      return updatedDetectedZones;
    });

    if (selectedZones.length + 1 === currentZones.length) {
      if (correctSound) {
        correctSound.replayAsync();
      }

      if (currentImageIndex < imagesWithZones.length - 1) {
        setDisableClick(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => prevIndex + 1);
          setSelectedZones([]);
          setDisableClick(false);
          setDetectedZones(new Array(imagesWithZones[currentImageIndex + 1].zones.length).fill(false));
        }, 150);
      } else {
        setGameOver(true);
        setDisableClick(true);
        Alert.alert('Game Over', 'Congratulations! You completed all the images.');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      }
      if (timeLeft === 0 && !gameOver) {
        setGameOver(true);
        setDisableClick(true);
        Alert.alert('Game Over', 'Time is up.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, gameOver]);

  const currentImageWithZones = imagesWithZones[currentImageIndex];

  return (
    <TouchableWithoutFeedback onPress={handleGeneralClick}>
      <View style={styles.container}>
        <ImageBackground
          source={currentImageWithZones.image}
          style={[styles.backgroundImage, { width: windowWidth, height: windowHeight, aspectRatio: window.devicePixelRatio}]}
          resizeMode="cover"// Change to "contain" to maintain aspect ratio
        >
          {currentImageWithZones.zones.map((zone, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(index)}>
              <View
                style={[
                  styles.zone,
                  {
                    position: 'absolute',
                    top: zone.cy * windowHeight - zone.radius * windowWidth,
                    left: zone.cx * windowWidth - zone.radius * windowWidth,
                    width: zone.radius * 2 * windowWidth,
                    height: zone.radius * 2 * windowWidth,
                    borderRadius: zone.radius * windowWidth,
                    borderWidth: selectedZones.includes(index) ? 2 : 0,
                    borderColor: selectedZones.includes(index) ? 'red' : 'transparent',
                    backgroundColor: selectedZones.includes(index) ? zone.color : 'transparent',
                  },
                ]}
              />
            </TouchableWithoutFeedback>
          ))}
          
          <View style={styles.detectedZonesContainer}>
            {currentImageWithZones.zones.map((zone, index) => (
              // <Icon
              //   key={index}
              //   name="search"
              //   size={windowWidth*0.05}
              //   color="green"
              //   style={{ opacity: selectedZones.includes(index) ? 1 : 0.7, marginHorizontal: 5 }}
              // />

              <Image
         key={index}
         source={require('@/assets/images/icon_loop.png')} // Replace 'your-image-path' with the path to your image
         style={[
        {
          width: windowWidth * 0.05,
          height: windowWidth * 0.05,
          opacity: selectedZones.includes(index) ? 1 : 0.7,
          marginHorizontal: 5,
        },
      ]}
    />
            ))}
          </View>
          {/* <Text style={styles.scoreText}>Score: {score}</Text> */}
          <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zone: {
    // position: 'absolute',
    // borderWidth: 2,
    // borderColor: 'red',
    // backgroundColor: 'transparent',
  },
  detectedZonesContainer: {
    // position: 'absolute',
    // // top: 10,
    // // left: 10,
    // top:  30,
    // left: 10,
    // flexDirection: 'row',
    // backgroundColor: 'black',
    // opacity: 0.55,
    // padding: 6,
    // borderRadius: 31,
    // gap: 3
    position: 'absolute',
    top: windowHeight * 0.03,
    left: windowWidth * 0.04,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.75,
    padding: 6,
    borderRadius: 31,
    gap: 3,
  },
  detectedZone: {
    // position: 'absolute',
    // width: 15,
    // height: 15,
    // borderRadius: 10,
    backgroundColor: 'green',
    marginHorizontal: 5,
    // top:5,

  },
  scoreText: {
    // position: 'absolute',
    // top: 30,
    // left: 10,
    // color: 'white',
    // fontSize: 20,
  },
  timeText: {
    // position: 'absolute',
    // top: 30,
    // right: 10,
    // color: 'white',
    // fontSize: 20,
    position: 'absolute',
    top: windowHeight * 0.03,
    right: windowWidth * 0.04,
    color: 'white',
    fontSize: 22,
  },
});

export default App;

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback, Text, Alert, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';

// type CircleZone = {
//   cx: number;
//   cy: number;
//   radius: number;
//   color: string;
// };

// type ImageWithZones = {
//   image: any;
//   zones: CircleZone[];
// };

// const imagesWithZones: ImageWithZones[] = [
//   {
//     image: require('@/assets/images/back_prob.png'),
//     zones: [
//       { cx: 0.79, cy: 0.32, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
//       { cx: 0.8, cy: 0.49, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
//     ],
//   },
  
//   {
//     image: require('@/assets/images/back_prob2.png'),
//     zones: [
//         { cx: 0.2, cy: 0.56, radius: 0.12, color: 'rgba(0, 255, 0, 0)' },
//         { cx: 0.12, cy: 0.46, radius: 0.06, color: 'rgba(255, 255, 0, 0)' },
//         { cx: 0.85, cy: 0.415, radius: 0.06, color: 'rgba(255, 255, 0, 0)' },
//     ],
//   },
  
//   {
//     image: require('@/assets/images/back_prob3.png'),
//     zones: [
//         { cx: 0.32, cy: 0.64, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
//         { cx: 0.48, cy: 0.32, radius: 0.14, color: 'rgba(255, 255, 0, 0)' },

//     ],
//   },
//   {
//     image: require('@/assets/images/back_prob4.png'),
//     zones: [
//         { cx: 0.32, cy: 0.54, radius: 0.148, color: 'rgba(0, 255, 0, 0)' },

//     ],
//   },
//   {
//     image: require('@/assets/images/back_prob5.png'),
//     zones: [
//         { cx: 0.32, cy: 0.54, radius: 0.148, color: 'rgba(0, 255, 0, 0)' },

//     ],
//   },
//   // Add other images with zones here...
// ];


// const App = () => {
//   const [selectedZones, setSelectedZones] = useState<CircleZone[]>([]);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(50);
//   const [gameOver, setGameOver] = useState(false);
//   const [disableClick, setDisableClick] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
//   const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
//   const [detectedZones, setDetectedZones] = useState<boolean[]>(new Array(imagesWithZones[currentImageIndex].zones.length).fill(false));
//   const [currentImageZones, setCurrentImageZones] = useState<CircleZone[]>([]);

  

//   const windowWidth = Dimensions.get('window').width;
//   const windowHeight = Dimensions.get('window').height;

//   useEffect(() => {
//     const loadSounds = async () => {
//       const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
//       const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/right.mp3'));
//       setClickSound(click);
//       setCorrectSound(correct);
//     };

//     loadSounds();

//     return () => {
//       if (clickSound) {
//         clickSound.unloadAsync();
//       }
//       if (correctSound) {
//         correctSound.unloadAsync();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const saveScore = async () => {
//       try {
//         await AsyncStorage.setItem('score', score.toString());
//       } catch (error) {
//         console.error('Failed to save score to AsyncStorage', error);
//       }
//     };

//     saveScore();
//   }, [score]);

  
//   const handleGeneralClick = () => {
//     if (clickSound) {
//       clickSound.replayAsync();
//     }
//   };

//   const handleZonePress = (zone: CircleZone, index: number) => {
//     if (gameOver || disableClick) return;
//     if (clickSound) {
//       clickSound.replayAsync();
//     }

//     setSelectedZones((prevSelectedZones) => [...prevSelectedZones, zone]);
//     setScore((prevScore) => prevScore + 1);

//     const currentZones = imagesWithZones[currentImageIndex].zones;
//     if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
//       if (correctSound) {
//         correctSound.replayAsync();
//       }

//       setDetectedZones((prevDetectedZones) => {
//         const updatedDetectedZones = [...prevDetectedZones];
//         updatedDetectedZones[index] = true;
//         return updatedDetectedZones;
//       });

//       if (currentImageIndex < imagesWithZones.length - 1) {
//         setDisableClick(true);
//         setTimeout(() => {
//           setCurrentImageIndex((prevIndex) => prevIndex + 1);
//           setSelectedZones([]);
//           setDisableClick(false);
//           setDetectedZones(new Array(imagesWithZones[currentImageIndex + 1].zones.length).fill(false));
//         }, 150);
//       } else {
//         setGameOver(true);
//         setDisableClick(true);
//         Alert.alert('Game Over', 'Congratulations! You completed all the images.');
//       }
//     } else if (selectedZones.length === currentZones.length - 1 && !currentZones.includes(zone)) {
//       setGameOver(true);
//       setDisableClick(true);
//       Alert.alert('Game Over', 'You clicked the wrong zone.');
//     }
//   };
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!gameOver && timeLeft > 0) {
//         setTimeLeft((prevTime) => prevTime - 1);
//       }
//       if (timeLeft === 0 && !gameOver) {
//         setGameOver(true);
//         setDisableClick(true);
//         Alert.alert('Game Over', 'Time is up.');
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timeLeft, gameOver]);

//   const currentImageWithZones = imagesWithZones[currentImageIndex];

  

//   return (
//     <TouchableWithoutFeedback onPress={handleGeneralClick}>
//       <View style={styles.container}>
//         <ImageBackground
//           source={currentImageWithZones.image}
//           style={[styles.backgroundImage, { width: windowWidth, height: windowHeight, aspectRatio: window.devicePixelRatio}]}
//           resizeMode="cover"// Change to "contain" to maintain aspect ratio
//         >
//           {currentImageWithZones.zones.map((zone, index) => (
//             <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone, index)}>
//               <View
//                 style={[
//                   styles.zone,
//                   {
//                     // top: `${zone.cy * 100}%`,
//                     // left: `${zone.cx * 100}%`,
//                     // width: zone.radius * windowWidth * 2,
//                     // height: zone.radius * windowWidth * 2,
//                     // borderRadius: zone.radius * windowWidth,
//                     // backgroundColor: zone.color,
//                     top: zone.cy * windowHeight - zone.radius * windowWidth,
//                     left: zone.cx * windowWidth - zone.radius * windowWidth,
//                     width: zone.radius * 2 * windowWidth,
//                     height: zone.radius * 2 * windowWidth,
//                     borderRadius: zone.radius * windowWidth,
//                     backgroundColor: zone.color,
//                   },
//                 ]}
//               />
//             </TouchableWithoutFeedback>
//           ))}
//           <View style={styles.detectedZonesContainer}>
//             {currentImageWithZones.zones.map((zone, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.detectedZone,
//                   { opacity: detectedZones[index] ? 1 : 0.2 }
//                 ]}
//               />
//             ))}
//           </View>
//           <Text style={styles.scoreText}>Score: {score}</Text>
//           <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
//         </ImageBackground>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   zone: {
//     position: 'absolute',
//     borderWidth: 2,
//     borderColor: 'red',
//     backgroundColor: 'transparent',
//     // transform: [{ translateX: -50 }, { translateY: -50 }],
//   },
//   detectedZonesContainer: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     flexDirection: 'row',
//   },
//   detectedZone: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: 'green',
//     marginHorizontal: 5,
//   },
//   scoreText: {
//     position: 'absolute',
//     top: 30,
//     left: 10,
//     color: 'white',
//     fontSize: 20,
//   },
//   timeText: {
//     position: 'absolute',
//     top: 30,
//     right: 10,
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default App;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// the second code

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback, Text, Alert, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';

// type CircleZone = {
//   cx: number;
//   cy: number;
//   radius: number;
//   color: string;
// };

// type ImageWithZones = {
//   image: any;
//   originalWidth: number;
//   originalHeight: number;
//   zones: CircleZone[];
// };

// const imagesWithZones: ImageWithZones[] = [
//   {
//     image: require('@/assets/images/back_prob.png'),
//     originalWidth: 430, // Replace with the original width of your image in pixels
//     originalHeight: 932, // Replace with the original height of your image in pixels
//     zones: [
//       { cx: 0.79, cy: 0.32, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
//       { cx: 0.8, cy: 0.49, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
//     ],
//   },
// ];

// const App = () => {
//   const [selectedZones, setSelectedZones] = useState<CircleZone[]>([]);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(50);
//   const [gameOver, setGameOver] = useState(false);
//   const [disableClick, setDisableClick] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
//   const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);

//   const windowWidth = Dimensions.get('window').width;
//   const windowHeight = Dimensions.get('window').height;

//   useEffect(() => {
//     const loadSounds = async () => {
//       const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
//       const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/right.mp3'));
//       setClickSound(click);
//       setCorrectSound(correct);
//     };

//     loadSounds();

//     return () => {
//       if (clickSound) {
//         clickSound.unloadAsync();
//       }
//       if (correctSound) {
//         correctSound.unloadAsync();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const saveScore = async () => {
//       try {
//         await AsyncStorage.setItem('score', score.toString());
//       } catch (error) {
//         console.error('Failed to save score to AsyncStorage', error);
//       }
//     };

//     saveScore();
//   }, [score]);

//   const handleGeneralClick = () => {
//     if (clickSound) {
//       clickSound.replayAsync();
//     }
//   };

//   const handleZonePress = (zone: CircleZone) => {
//     if (gameOver || disableClick) return;
//     if (clickSound) {
//       clickSound.replayAsync();
//     }

//     setSelectedZones((prevSelectedZones) => [...prevSelectedZones, zone]);
//     setScore((prevScore) => prevScore + 1);

//     const currentZones = imagesWithZones[currentImageIndex].zones;
//     if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
//       if (correctSound) {
//         correctSound.replayAsync();
//       }

//       if (currentImageIndex < imagesWithZones.length - 1) {
//         setDisableClick(true);
//         setTimeout(() => {
//           setCurrentImageIndex((prevIndex) => prevIndex + 1);
//           setSelectedZones([]);
//           setDisableClick(false);
//         }, 150);
//       } else {
//         setGameOver(true);
//         setDisableClick(true);
//         Alert.alert('Game Over', 'Congratulations! You completed all the images.');
//       }
//     } else if (selectedZones.length === currentZones.length - 1 && !currentZones.includes(zone)) {
//       setGameOver(true);
//       setDisableClick(true);
//       Alert.alert('Game Over', 'You clicked the wrong zone.');
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!gameOver && timeLeft > 0) {
//         setTimeLeft((prevTime) => prevTime - 1);
//       }
//       if (timeLeft === 0 && !gameOver) {
//         setGameOver(true);
//         setDisableClick(true);
//         Alert.alert('Game Over', 'Time is up.');
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timeLeft, gameOver]);

//   const currentImageWithZones = imagesWithZones[currentImageIndex];
//   const imageAspectRatio = currentImageWithZones.originalWidth / currentImageWithZones.originalHeight;

//   let imageWidth, imageHeight;
//   if (windowWidth / windowHeight > imageAspectRatio) {
//     imageWidth = windowHeight * imageAspectRatio;
//     imageHeight = windowHeight;
//   } else {
//     imageWidth = windowWidth;
//     imageHeight = windowWidth / imageAspectRatio;
//   }

//   return (
//     <TouchableWithoutFeedback onPress={handleGeneralClick}>
//       <View style={styles.container}>
//         <ImageBackground
//           source={currentImageWithZones.image}
//           style={[styles.backgroundImage, { width: imageWidth, height: imageHeight }]}
//           resizeMode="cover"
//         >
//           {currentImageWithZones.zones.map((zone, index) => (
//             <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone)}>
//               <View
//                 style={[
//                   styles.zone,
//                   {
//                     top: zone.cy * imageHeight,
//                     left: zone.cx * imageWidth,
//                     width: zone.radius * 2 * imageWidth,
//                     height: zone.radius * 2 * imageWidth,
//                     borderRadius: zone.radius * imageWidth,
//                     backgroundColor: zone.color,
//                   },
//                 ]}
//               />
//             </TouchableWithoutFeedback>
//           ))}
//           <Text style={styles.scoreText}>Score: {score}</Text>
//           <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
//         </ImageBackground>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   zone: {
//     position: 'absolute',
//     borderWidth: 2,
//     borderColor: 'red',
//     backgroundColor: 'transparent',
//   },
//   scoreText: {
//     position: 'absolute',
//     top: 30,
//     left: 10,
//     color: 'white',
//     fontSize: 20,
//   },
//   timeText: {
//     position: 'absolute',
//     top: 30,
//     right: 10,
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default App;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback, Text, Alert, Dimensions, Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';

// type CircleZone = {
//   cx: number;
//   cy: number;
//   radius: number;
//   color: string;
// };

// type ImageWithZones = {
 
//   mainImage: any;
//   zones: CircleZone[];
// };

// const imagesWithZones: ImageWithZones[] = [
//   { // Placeholder or dummy image for styling
//     mainImage: require('@/assets/images/prob1_.png'), // Main image where zones are clicked
//     zones: [
//       { cx: 0.79, cy: 0.32, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
//       { cx: 0.8, cy: 0.49, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
//     ],
//   },
// ];

// const App = () => {
//   const [selectedZones, setSelectedZones] = useState<CircleZone[]>([]);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(50);
//   const [gameOver, setGameOver] = useState(false);
//   const [disableClick, setDisableClick] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
//   const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);

//   useEffect(() => {
//     const loadSounds = async () => {
//       const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
//       const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/right.mp3'));
//       setClickSound(click);
//       setCorrectSound(correct);
//     };

//     loadSounds();

//     return () => {
//       if (clickSound) {
//         clickSound.unloadAsync();
//       }
//       if (correctSound) {
//         correctSound.unloadAsync();
//       }
//     };
//   }, []);

//   const handleZonePress = (zone: CircleZone) => {
//     if (gameOver || disableClick) return;

//     setSelectedZones((prevSelectedZones) => [...prevSelectedZones, zone]);
//     setScore((prevScore) => prevScore + 1);

//     const currentZones = imagesWithZones[currentImageIndex].zones;
//     if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
//       if (correctSound) {
//         correctSound.replayAsync();
//       }

//       if (currentImageIndex < imagesWithZones.length - 1) {
//         setDisableClick(true);
//         setTimeout(() => {
//           setCurrentImageIndex((prevIndex) => prevIndex + 1);
//           setSelectedZones([]);
//           setDisableClick(false);
//         }, 150);
//       } else {
//         setGameOver(true);
//         setDisableClick(true);
//         Alert.alert('Game Over', 'Congratulations! You completed all the images.');
//       }
//     } else if (selectedZones.length === currentZones.length - 1 && !currentZones.includes(zone)) {
//       setGameOver(true);
//       setDisableClick(true);
//       Alert.alert('Game Over', 'You clicked the wrong zone.');
//     }
//   };

//   const currentImage = imagesWithZones[currentImageIndex];
//   console.log('Main image source:', currentImage.mainImage); // Log main image source
//   // Check if the main image object has valid dimensions
//   const mainImageWidth = Dimensions.get('window').width * 0.9; // Assuming main image takes 90% of the screen width
//   let mainImageHeight = 0;
//   if (currentImage.mainImage && currentImage.mainImage.width && currentImage.mainImage.height) {
//     mainImageHeight = mainImageWidth * (currentImage.mainImage.height / currentImage.mainImage.width);
//   }
//   console.log('Main image dimensions:', mainImageWidth, mainImageHeight); // Log main image dimensions

//   return (
//     <TouchableWithoutFeedback>
//       <View style={styles.container}>
//         <ImageBackground
//           blurRadius={8}
//           source={require('@/assets/images/back8.png')}
//           style={styles.backgroundImage}
//           resizeMode="cover"
//         >
//           <View style={styles.imageContainer}>
//             <Image
//               source={currentImage.mainImage}
//               style={[styles.mainImage, { width: mainImageWidth, height: mainImageHeight }]}
//               // resizeMode="contain"
//             />
//             {currentImage.zones.map((zone, index) => (
//               <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone)}>
//                 <View
//                   style={[
//                     styles.zone,
//                     {
//                       top: zone.cy * mainImageHeight - (zone.radius * mainImageHeight),
//                       left: zone.cx * mainImageWidth - (zone.radius * mainImageWidth),
//                       width: zone.radius * 2 * mainImageWidth,
//                       height: zone.radius * 2 * mainImageHeight,
//                       borderRadius: zone.radius * mainImageWidth,
//                       backgroundColor: zone.color,
//                     },
//                   ]}
//                 />
//               </TouchableWithoutFeedback>
//             ))}
//           </View>
//           <Text style={styles.scoreText}>Score: {score}</Text>
//           <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
//         </ImageBackground>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     // justifyContent: 'center',
//     // alignItems: 'center',
//   },
//   imageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mainImage: {
//     position: 'absolute',
//   },
//   zone: {
//     position: 'absolute',
//     borderWidth: 2,
//     borderColor: 'red',
//     backgroundColor: 'transparent',
//   },
//   scoreText: {
//     position: 'absolute',
//     top: 30,
//     left: 10,
//     color: 'white',
//     fontSize: 20,
//   },
//   timeText: {
//     position: 'absolute',
//     top: 30,
//     right: 10,
//     color: 'white',
//     fontSize: 20,
//   },
// });

// export default App;
