// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';

// const App = () => {
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(100); // 50 seconds timer
//   const [gameOver, setGameOver] = useState(false);
//   const [trashesClicked, setTrashesClicked] = useState(0);
//   const [trash1Opacity] = useState(new Animated.Value(1));
//   const [trash2Opacity] = useState(new Animated.Value(1));
//   const [trash3Opacity] = useState(new Animated.Value(1));
//   const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
//   const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
//   const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [showGameOverDiv, setShowGameOverDiv] = useState(false);
//   const [gameOverDivOpacity] = useState(new Animated.Value(0));
//   const [gameOverImagePosition] = useState(new Animated.Value(0));

//   useEffect(() => {
//     const loadSounds = async () => {
//       const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
//       const { sound: disappear } = await Audio.Sound.createAsync(require('@/assets/disappear.wav'));
//       const { sound: appear } = await Audio.Sound.createAsync(require('@/assets/appear.wav'));
//       setClickSound(click);
//       setDisappearSound(disappear);
//       setAppearSound(appear);
//     };

//     loadSounds();

//     return () => {
//       if (clickSound) {
//         clickSound.unloadAsync();
//       }
//       if (disappearSound) {
//         disappearSound.unloadAsync();
//       }
//       if (appearSound) {
//         appearSound.unloadAsync();
//       }
//     };
//   }, []);

//   const playSound = async (sound: Audio.Sound | null) => {
//     if (sound) {
//       await sound.replayAsync();
//     }
//   };

//   const handleScreenClick = async () => {
//     playSound(clickSound);
//   };

//   const handleTrashClick = (trashNumber: Number) => {
//     if (!gameOver) {
//       playSound(clickSound);
//       setTrashesClicked((prevTrashesClicked) => {
//         const newTrashesClicked = prevTrashesClicked + 1;
//         if (newTrashesClicked === 3) {
//           handleGameOver();
//         }
//         return newTrashesClicked;
//       });

//       if (trashNumber === 1) {
//         animateTrash(trash1Opacity);
//       } else if (trashNumber === 2) {
//         animateTrash(trash2Opacity);
//       } else if (trashNumber === 3) {
//         animateTrash(trash3Opacity);
//       }
//     }
//   };

//   const animateTrash = (opacity:Animated.Value) => {
//     Animated.timing(opacity, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start(() => {
//       console.log('Animation completed');
//       playSound(disappearSound);
//     });
//   };

//   const handleGameOver = async () => {
//     setGameOver(true);
//     const finalScore = trashesClicked + timeLeft;
//     setScore(finalScore);
//     setShowOverlay(true);
//     setShowGameOverDiv(true);
//     try {
//       await AsyncStorage.setItem('score', finalScore.toString());
//       console.log('Score saved successfully.');
//     } catch (error) {
//       console.error('Error saving score:', error);
//     }

//     // Show the game over message with animation
//     Animated.timing(gameOverDivOpacity, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start(() => {
//       playSound(appearSound);
//     });

//     // Animate the game over image position
//     Animated.timing(gameOverImagePosition, {
//       toValue: 100, // Adjust as needed
//       duration: 1000, // Adjust as needed
//       useNativeDriver: true,
//     }).start();
//   };


//   useEffect(() => {
//     if (timeLeft === 0 || gameOver) {
//       handleGameOver();
//     } else {
//       const timer = setTimeout(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft, gameOver]);

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require('@/assets/images/back1.png')}
//         style={styles.backgroundImage}
//       >
//         {/* Overlay */}
//         {showOverlay && (
//           <View style={styles.overlay} />
//         )}

//         <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>
//           {/* Game Over Div */}
//           {showGameOverDiv && (
//             <Animated.View style={[styles.gameOverDiv, { opacity: gameOverDivOpacity }]}>
//               <Animated.Image
//                 source={require('@/assets/images/A2.png')}
//                 style={[styles.gameOverImage, { transform: [{ translateY: gameOverImagePosition }] }]}
//               />
//             </Animated.View>
//           )}

//           <Animated.View style={[styles.trash, { top: '55%', left: '25%', opacity: trash1Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(1)}>
//               <Image
//                 source={require('@/assets/images/trash.png')}
//                 style={styles.trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Image
//             source={require('@/assets/images/flies.png')}
//             style={[styles.flies, { top: '50%', left: '25%' }]}
//           />

//           <Animated.View style={[styles.trash, { top: '65%', left: '73%', opacity: trash2Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(2)}>
//               <Image
//                 source={require('@/assets/images/paper_trash.png')}
//                 style={styles.paper_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={[styles.trash2, { top: '78%', right: '60%', opacity: trash3Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(3)}>
//               <Image
//                 source={require('@/assets/images/trash.png')}
//                 style={styles.trash2}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Image
//             source={require('@/assets/images/bad_smell.png')}
//             style={[styles.bad_smell, { top: '68%', right: '70%' }]}
//           />

//           <Text style={styles.scoreText}>Score: {score}</Text>
//           <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
//         </TouchableOpacity>
//       </ImageBackground>
//     </View>
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
//   trash: {
//     position: 'absolute',
//     width: 70,
//     height: 40,
//   },
//   flies: {
//     position: 'absolute',
//     width: 80,
//     height: 60,
//   },
//   paper_trash: {
//     position: 'absolute',
//     width: 90,
//     height: 60,
//   },
//   trash2: {
//     position: 'absolute',
//     width: 130,
//     height: 80,
//   },
//   bad_smell: {
//     position: 'absolute',
//     width: 50,
//     height: 80,
//   },
//   scoreText: {
//     position: 'absolute',
//     top: 20,
//     left: 10,
//     color: 'white',
//     fontSize: 20,
//   },
//   timeText: {
//     position: 'absolute',
//     top: 20,
//     right: 10,
//     color: 'white',
//     fontSize: 20,
//   },
//   gameOverDiv: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   gameOverImage: {
//     width: 250,
//     height: 350,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'black',
//     opacity: 0.5,
//   },
// });

// export default App;


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
//       clickSound?.unloadAsync();
//       correctSound?.unloadAsync();
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

//   const handleGeneralClick = () => clickSound?.replayAsync();

//   const handleZonePress = (zone: CircleZone) => {
//     if (gameOver || disableClick) return;
//     clickSound?.replayAsync();

//     setSelectedZones((prev) => [...prev, zone]);
//     setScore((prev) => prev + 1);

//     const currentZones = imagesWithZones[currentImageIndex].zones;
//     if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
//       correctSound?.replayAsync();
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
//       if (!gameOver && timeLeft > 0) setTimeLeft((prev) => prev - 1);
//       if (timeLeft === 0 && !gameOver) {
//         setGameOver(true);
//         setDisableClick(true);
//         Alert.alert('Game Over', 'Time is up.');
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timeLeft, gameOver]);

//   useEffect(() => {
//     const adjustZonesForScreen = () => {
//       const adjustedZones = imagesWithZones[currentImageIndex].zones.map(zone => {
//         const { cx, cy, radius } = zone;
//         let adjustedCx = cx * windowWidth;
//         let adjustedCy = cy * windowHeight;
//         let adjustedRadius = radius * windowWidth; // Use windowWidth for radius to maintain aspect ratio

//         // Specific adjustments for problematic devices
//         if ((windowWidth === 360 && windowHeight === 740) || (windowWidth === 375 && windowHeight === 667)) {
//           adjustedCx = cx * windowWidth;
//           adjustedCy = cy * windowHeight;
//           adjustedRadius = radius * windowWidth * 0.8; // Adjust radius size for these specific devices
//         }

//         return { ...zone, cx: adjustedCx, cy: adjustedCy, radius: adjustedRadius };
//       });

//       setCurrentImageZones(adjustedZones);
//     };

//     adjustZonesForScreen();
//   }, [windowWidth, windowHeight, currentImageIndex]);

//   const currentImageWithZones = imagesWithZones[currentImageIndex];

//   return (
//     <TouchableWithoutFeedback onPress={handleGeneralClick}>
//       <View style={styles.container}>
//         <ImageBackground
//           source={currentImageWithZones.image}
//           style={[styles.backgroundImage, { width: windowWidth, height: windowHeight }]}
//           resizeMode="cover"
//         >
//           {currentImageZones.map((zone, index) => (
//             <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone)}>
//               <View
//                 style={[
//                   styles.zone,
//                   {
//                     top: zone.cy - zone.radius,
//                     left: zone.cx - zone.radius,
//                     width: zone.radius * 2,
//                     height: zone.radius * 2,
//                     borderRadius: zone.radius,
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

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback, Text, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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

// Relative coordinates for smaller screens
const relativeCoordinatesSmall: CircleZone[] = [
  { cx: 0.79, cy: 0.28, radius: 0.13, color: 'rgba(0, 255, 0, 0)' },
  { cx: 0.8, cy: 0.49, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
  // Add more relative coordinates for smaller screens as needed
];

// Relative coordinates for larger screens
const relativeCoordinatesLarge: CircleZone[] = [
  { cx: 0.79, cy: 0.32, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
  { cx: 0.8, cy: 0.49, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
  // Add more relative coordinates for larger screens as needed
];

const imagesWithZones: ImageWithZones[] = [
  {
    image: require('@/assets/images/back_prob.png'),
    // zones: Dimensions.get('window').height <= 360 ? relativeCoordinatesSmall : relativeCoordinatesLarge,
   zones :  windowHeight <= 740 
      ? relativeCoordinatesSmall
      : relativeCoordinatesLarge,
  },
  // Add other images with zones here...
];

const App = () => {
  const [selectedZones, setSelectedZones] = useState<CircleZone[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [currentImageZones, setCurrentImageZones] = useState<CircleZone[]>([]);


  useEffect(() => {
    const loadSounds = async () => {
      const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
      const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/right.mp3'));
      setClickSound(click);
      setCorrectSound(correct);
    };

    loadSounds();

    return () => {
      clickSound?.unloadAsync();
      correctSound?.unloadAsync();
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

  const handleGeneralClick = () => clickSound?.replayAsync();

  const handleZonePress = (zone: CircleZone) => {
    if (gameOver || disableClick) return;
    clickSound?.replayAsync();

    setSelectedZones((prev) => [...prev, zone]);
    setScore((prev) => prev + 1);

    const currentZones = imagesWithZones[currentImageIndex].zones;
    if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
      correctSound?.replayAsync();
      if (currentImageIndex < imagesWithZones.length - 1) {
        setDisableClick(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => prevIndex + 1);
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
      if (!gameOver && timeLeft > 0) setTimeLeft((prev) => prev - 1);
      if (timeLeft === 0 && !gameOver) {
        setGameOver(true);
        setDisableClick(true);
        Alert.alert('Game Over', 'Time is up.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, gameOver]);

  useEffect(() => {
    setCurrentImageZones(imagesWithZones[currentImageIndex].zones);
  }, [currentImageIndex]);

  const currentImageWithZones = imagesWithZones[currentImageIndex];

  return (
    <TouchableWithoutFeedback onPress={handleGeneralClick}>
      <View style={styles.container}>
        <ImageBackground
          source={currentImageWithZones.image}
          style={[styles.backgroundImage, { width: windowWidth, height: windowHeight }]}
          resizeMode="cover"
        >
          {currentImageZones.map((zone, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone)}>
              <View
                style={[
                  styles.zone,
                  {
                    top: zone.cy * windowHeight - zone.radius * windowWidth,
                    left: zone.cx * windowWidth - zone.radius * windowWidth,
                    width: zone.radius * 2 * windowWidth,
                    height: zone.radius * 2 * windowWidth,
                    borderRadius: zone.radius * windowWidth,
                    backgroundColor: zone.color,
                  },
                ]}
              />
            </TouchableWithoutFeedback>
          ))}
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
    justifyContent: 'center',
    alignItems: 'center',
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
