// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, Image, TouchableWithoutFeedback, Text, Alert, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Animatable from 'react-native-animatable';
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
//     image: require('@/assets/images/prob1_.png'),
//     zones: [
//       { cx: 0.72, cy: 0.23, radius: 0.1, color: 'rgba(0, 255, 0, 0)' },
//       { cx: 0.92, cy: 0.73, radius: 0.1, color: 'rgba(255, 255, 0, 0)' },
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
//   const [imageDimensions, setImageDimensions] = useState({ width: 1, height: 1 });

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

//     setSelectedZones(prevSelectedZones => [...prevSelectedZones, zone]);
//     setScore(prevScore => prevScore + 1);

//     const currentZones = imagesWithZones[currentImageIndex].zones;
//     if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
//       if (correctSound) {
//         correctSound.replayAsync();
//       }

//       if (currentImageIndex < imagesWithZones.length - 1) {
//         setDisableClick(true);
//         setTimeout(() => {
//           setCurrentImageIndex(prevIndex => prevIndex + 1);
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
//         setTimeLeft(prevTime => prevTime - 1);
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

//   const handleImageLayout = (event) => {
//     const { width, height } = event.nativeEvent.layout;
//     setImageDimensions({ width, height });
//   };

//   return (
//     <TouchableWithoutFeedback onPress={handleGeneralClick}>
//       <View style={styles.container}>
//         <ImageBackground
//           blurRadius={8}
//           source={require('@/assets/images/back8.png')}
//           style={styles.backgroundImage}
//           resizeMode="cover"
//         >
//           <View style={styles.overlay} />
//           <View style={styles.imageContainer}>
//             <Animatable.View
//               key={currentImageIndex}
//               animation="fadeIn"
//               duration={500}
//               style={[styles.imageWrapper, { width: Dimensions.get('window').width * 0.91, height: Dimensions.get('window').height * 0.65 }]}
//             >
//               <Image
//                 source={currentImageWithZones.image}
//                 style={styles.image}
//                 resizeMode="contain"
//                 onLayout={handleImageLayout}
//               />
//             </Animatable.View>
//             {currentImageWithZones.zones.map((zone, index) => (
//               <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone)}>
//                 <View
//                   style={[
//                     styles.zone,
//                     {
//                       top: zone.cy * imageDimensions.height - zone.radius * imageDimensions.width,
//                       left: zone.cx * imageDimensions.width - zone.radius * imageDimensions.width,
//                       width: zone.radius * 2 * imageDimensions.width,
//                       height: zone.radius * 2 * imageDimensions.width,
//                       borderRadius: zone.radius * imageDimensions.width,
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
//     resizeMode: 'cover',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255, 190, 11, 0.16)', // #FFBE0B with 31% opacity
//   },
//   imageContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
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


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableWithoutFeedback, Text, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';

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
    image: require('@/assets/images/prob1_.png'),
    zones: [
      { cx: 0.89, cy: 0.45, radius: 0.16, color: 'rgba(0, 255, 0, 0)' }, // Relative coordinates for smaller screens
      { cx: 0.9, cy: 0.73, radius: 0.13, color: 'rgba(255, 255, 0, 0)' }, // Relative coordinates for smaller screens
    ],
  },
  // Add other images with zones here...
];
// Relative coordinates for smaller screens
const relativeCoordinatesSmall = [
      { cx: 0.89, cy: 0.41, radius: 0.13, color: 'rgba(0, 255, 0, 0)' },
      { cx: 0.90, cy: 0.73, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },

  // Add more relative coordinates for smaller screens as needed
];

// Relative coordinates for larger screens
const relativeCoordinatesLarge = [
  // { cx: 0.3, cy: 0.4, radius: 0.1, color: 'rgba(0, 255, 0, 0)' },
  // { cx: 0.7, cy: 0.6, radius: 0.1, color: 'rgba(0, 255, 0, 0)' },
      { cx: 0.89, cy: 0.45, radius: 0.16, color: 'rgba(0, 255, 0, 0)' },
      { cx: 0.9, cy: 0.73, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
  // Add more relative coordinates for larger screens as needed
];


const App = () => {
  const [selectedZones, setSelectedZones] = useState<CircleZone[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(50);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [disableClick, setDisableClick] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [clickSound, setClickSound] = useState<Audio.Sound>();
  const [correctSound, setCorrectSound] = useState<Audio.Sound>();
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 1, height: 1 });
  const [currentImageZones, setCurrentImageZones] = useState<CircleZone[]>([]);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
        const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/right.mp3'));
        setClickSound(click);
        setCorrectSound(correct);
      } catch (error) {
        console.error('Failed to load sounds', error);
      }
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
  }, [clickSound, correctSound]);

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

  const handleZonePress = (zone: CircleZone) => {
    if (gameOver || disableClick) return;
    if (clickSound) {
      clickSound.replayAsync();
    }

    setSelectedZones(prevSelectedZones => [...prevSelectedZones, zone]);
    setScore(prevScore => prevScore + 1);

    const currentZones = currentImageZones;
    if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
      if (correctSound) {
        correctSound.replayAsync();
      }

      if (currentImageIndex < imagesWithZones.length - 1) {
        setDisableClick(true);
        setTimeout(() => {
          setCurrentImageIndex(prevIndex => prevIndex + 1);
          setSelectedZones([]);
          setDisableClick(false);
        }, 150);
      } else {
        setGameOver(true);
        setDisableClick(true);
        Alert.alert('Game Over', 'Congratulations! You completed all the images.');
      }
    } else if (selectedZones.length === currentZones.length - 1 && !currentZones.includes(zone)) {
      setGameOver(true);
      setDisableClick(true);
      Alert.alert('Game Over', 'You clicked the wrong zone.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && timeLeft > 0) {
        setTimeLeft(prevTime => prevTime - 1);
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

  const handleImageLayout = (event: { nativeEvent: { layout: { width: number; height: number } } }) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });

    // Calculate aspect ratio of the image
    const aspectRatio = width / height;

    // Determine which set of coordinates to use based on the width of the image
    const coordinates = width <= 375 ? relativeCoordinatesSmall : relativeCoordinatesLarge;

    // Adjust coordinates of zones based on image aspect ratio
    const adjustedZones = coordinates.map(zone => ({
      ...zone,
      cx: zone.cx * width, // Adjust x-coordinate
      cy: zone.cy * height, // Adjust y-coordinate
      radius: zone.radius * width // Adjust radius
    }));

    // Update the adjusted zones
    setCurrentImageZones(adjustedZones);
  };

  return (
    <TouchableWithoutFeedback onPress={handleGeneralClick}>
      <View style={styles.container}>
        <ImageBackground
          blurRadius={8}
          source={require('@/assets/images/back8.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.imageContainer}>
            <Animatable.View
              key={currentImageIndex}
              animation="fadeIn"
              duration={500}
              style={[styles.imageWrapper, { width: Dimensions.get('window').width * 0.91, height: Dimensions.get('window').height * 0.65 }]}
            >
              <Image
                source={currentImageWithZones.image}
                style={styles.image}
                resizeMode="contain"
                onLayout={handleImageLayout}
              />
            </Animatable.View>
            {currentImageZones.map((zone, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone)}>
                <View
                  style={[
                    styles.zone,
                    {
                      top: zone.cy - zone.radius,
                      left: zone.cx - zone.radius,
                      width: zone.radius * 2,
                      height: zone.radius * 2,
                      borderRadius: zone.radius,
                      backgroundColor: zone.color,
                    },
                  ]}
                />
              </TouchableWithoutFeedback>
            ))}
          </View>
          <Text style={styles.scoreText}>Score: {score}</Text>
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
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 190, 11, 0.16)', // #FFBE0B with 31% opacity
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  zone: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'transparent',
  },
  scoreText: {
    position: 'absolute',
    top: 30,
    left: 10,
    color: 'white',
    fontSize: 20,
  },
  timeText: {
    position: 'absolute',
    top: 30,
    right: 10,
    color: 'white',
    fontSize: 20,
  },
});

export default App;
