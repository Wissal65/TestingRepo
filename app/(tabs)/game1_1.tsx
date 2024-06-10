// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

// const App = () => {
//   const navigation = useNavigation();
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(10000000); // 50 seconds timer
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
//       // setTrashesClicked((prevTrashesClicked) => {
//       //   const newTrashesClicked = prevTrashesClicked + 1;
//       //   if (newTrashesClicked === 3) {
//       //     handleGameOver();
//       //   }
//       //   return newTrashesClicked;
//       // });
      
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
//        // Increment trashesClicked after the animation is complete
//        setTrashesClicked((prevTrashesClicked) => {
//         const newTrashesClicked = prevTrashesClicked + 1;
//         setScore(newTrashesClicked);
//         if (newTrashesClicked === 3) {
//           handleGameOver();
//         }
//         return newTrashesClicked;
//       });
//     });
//   };

//   const handleGameOver = async () => {
//     setGameOver(true);
//     const finalScore = trashesClicked + timeLeft;
//     setScore(finalScore);
//     setShowOverlay(true);
//     setShowGameOverDiv(true);
//     try {
//       await AsyncStorage.setItem('score', score.toString());
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
//     // Navigate to the new screen after 10 seconds
//     setTimeout(() => {
//       // navigation.navigate('NewScreen');
//       router.push("/game1_1");
//     }, 10000);
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
//         style={[styles.backgroundImage,
//            { width: windowWidth, height: windowHeight,}
//           ]}
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

//           {/* <Animated.View style={[styles.trash, { top: '52%', left: '27%', opacity: trash1Opacity }]}> */}
//           <Animated.View style={[ { top: windowHeight * 0.54, left: windowWidth * 0.27, opacity: trash1Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(1)}>
//               <Image
//                 source={require('@/assets/images/trash4.png')}
//                 style={styles.trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           {/* <Animated.View style={[ { top: '65%', left: '73%', opacity: trash2Opacity }]}> */}
//           <Animated.View style={[ { top: windowHeight * 0.66, left: windowWidth * 0.73, opacity: trash1Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(2)}>
//               <Image
//                 source={require('@/assets/images/paper_trash.png')}
//                 style={styles.paper_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           {/* <Animated.View style={[{ top: '67%', left: '5%', opacity: trash3Opacity }]}> */}
//           <Animated.View style={[ { top: windowHeight * 0.7, left: windowWidth * 0.05, opacity: trash1Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(3)}>
//               <Image
//                 source={require('@/assets/images/trash4.png')}
//                 style={styles.trash2}
//               />
//             </TouchableOpacity>
//           </Animated.View>

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
//     // width: 65,
//     // height: 60,
//     width: windowWidth * 0.13, // Example: 10% of window width
//     height: (windowWidth * 0.13)/(705 / 647), // Example: 8% of window height
  
//   },

//   paper_trash: {
//     position: 'absolute',
//     // width: 90,
//     // height: 60,
//     width: windowWidth * 0.27, 
//     height: (windowWidth * 0.27)/(181 / 102), 
//   },
//   trash2: {
//     position: 'absolute',
//     // width: 164,
//     // height: 160,
//     width: windowWidth * 0.5, 
//     height: (windowWidth * 0.5)/(705 / 647), 
//   },
//   scoreText: {
//     position: 'absolute',
//     top: windowHeight * 0.03,
//     left: windowWidth * 0.05,
//     color: 'white',
//     fontSize: 20,
//   },
//   timeText: {
//     position: 'absolute',
//     top: windowHeight * 0.03,
//     right: windowWidth * 0.05,
//     color: 'white',
//     fontSize: 20,
//   },
//   gameOverDiv: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: windowHeight * 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   gameOverImage: {
//     width: windowWidth * 0.5,
//     height: windowHeight * 0.7,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'black',
//     opacity: 0.5,
//   },
//   // scoreText: {
//   //   position: 'absolute',
//   //   top: 20,
//   //   left: 10,
//   //   color: 'white',
//   //   fontSize: 20,
//   // },
//   // timeText: {
//   //   position: 'absolute',
//   //   top: 20,
//   //   right: 10,
//   //   color: 'white',
//   //   fontSize: 20,
//   // },
//   // gameOverDiv: {
//   //   position: 'absolute',
//   //   top: 0,
//   //   left: 0,
//   //   right: 0,
//   //   bottom: 100,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
//   // gameOverImage: {
//   //   width: 250,
//   //   height: 350,
//   // },
//   // overlay: {
//   //   ...StyleSheet.absoluteFillObject,
//   //   backgroundColor: 'black',
//   //   opacity: 0.5,
//   // },
// });

// export default App;


/////////////////////////////////


// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

// const App = () => {
//   const navigation = useNavigation();
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(10000000); // 50 seconds timer
//   const [gameOver, setGameOver] = useState(false);
//   const [trashesClicked, setTrashesClicked] = useState(0);
//   const [trash1Opacity] = useState(new Animated.Value(1));
//   const [trash2Opacity] = useState(new Animated.Value(1));
//   const [trash3Opacity] = useState(new Animated.Value(1));
//   const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
//   const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
//   const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);
//   // const [showOverlay, setShowOverlay] = useState(false);
//   // const [showGameOverDiv, setShowGameOverDiv] = useState(false);
//   // const [gameOverDivOpacity] = useState(new Animated.Value(0));
//   // const [gameOverImagePosition] = useState(new Animated.Value(0));
//   const [trashIcons, setTrashIcons] = useState<boolean[]>([true, true, true]);

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
//       // setTrashesClicked((prevTrashesClicked) => {
//       //   const newTrashesClicked = prevTrashesClicked + 1;
//       //   if (newTrashesClicked === 3) {
//       //     handleGameOver();
//       //   }
//       //   return newTrashesClicked;
//       // });
//       if (trashNumber === 1) {
//         animateTrash(trash1Opacity, 0);
//       } else if (trashNumber === 2) {
//         animateTrash(trash2Opacity, 1);
//       } else if (trashNumber === 3) {
//         animateTrash(trash3Opacity, 2);
//       }
//       // if (trashNumber === 1) {
//       //   animateTrash(trash1Opacity);
//       // } else if (trashNumber === 2) {
//       //   animateTrash(trash2Opacity);
//       // } else if (trashNumber === 3) {
//       //   animateTrash(trash3Opacity);
//       // }
//     }
//   };

//   // const animateTrash = (opacity:Animated.Value) => {
//   //   Animated.timing(opacity, {
//   //     toValue: 0,
//   //     duration: 500,
//   //     useNativeDriver: true,
//   //   }).start(() => {
//   //     console.log('Animation completed');
//   //     playSound(disappearSound);
//   //      // Increment trashesClicked after the animation is complete
//   //      setTrashesClicked((prevTrashesClicked) => {
//   //       const newTrashesClicked = prevTrashesClicked + 1;
//   //       setScore(newTrashesClicked);
//   //       if (newTrashesClicked === 3) {
//   //         handleGameOver();
//   //       }
//   //       return newTrashesClicked;
//   //     });
//   //   });
//   // };
//   const animateTrash = (opacity: Animated.Value, iconIndex: number) => {
//     Animated.timing(opacity, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start(() => {
//       console.log('Animation completed');
//       playSound(disappearSound);
//       setTrashIcons((prevTrashIcons) => {
//         const newTrashIcons = [...prevTrashIcons];
//         newTrashIcons[iconIndex] = false;
//         return newTrashIcons;
//       });
//       setTrashesClicked((prevTrashesClicked) => {
//         const newTrashesClicked = prevTrashesClicked + 1;
//         setScore(newTrashesClicked);
//         if (newTrashesClicked === 3) {
//           handleGameOver();
//         }
//         return newTrashesClicked;
//       });
//     });
//   };

//   const handleGameOver = async () => {
//     setGameOver(true);
//     const finalScore = trashesClicked + timeLeft;
//     setScore(finalScore);
//     // setShowOverlay(true);
//     // setShowGameOverDiv(true);
//     try {
//       await AsyncStorage.setItem('score', score.toString());
//       console.log('Score saved successfully.');
//     } catch (error) {
//       console.error('Error saving score:', error);
//     }

//     // Show the game over message with animation
//     // Animated.timing(gameOverDivOpacity, {
//     //   toValue: 1,
//     //   duration: 500,
//     //   useNativeDriver: true,
//     // }).start(() => {
//     //   playSound(appearSound);
//     // });

//     // Animate the game over image position
//     // Animated.timing(gameOverImagePosition, {
//     //   toValue: 100, // Adjust as needed
//     //   duration: 1000, // Adjust as needed
//     //   useNativeDriver: true,
//     // }).start();
//     // // Navigate to the new screen after 10 seconds
//     // setTimeout(() => {
//     //   // navigation.navigate('NewScreen');
//     //   router.push("/game1_1");
//     // }, 10000);
//     if (trashesClicked === 3) {
//       // router.push("/game1_2");
//       // return;
//       setTimeout(() => {
//           // navigation.navigate('NewScreen');
//           router.push("/game1_2");
//         }, 1000);
//     }
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
//         style={[styles.backgroundImage,
//            { width: windowWidth, height: windowHeight,}
//           ]}
//       >
//         {/* Overlay */}
//         {/* {showOverlay && (
//           <View style={styles.overlay} />
//         )} */}

//         <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>
//           {/* Game Over Div */}
//           {/* {showGameOverDiv && (
//             <Animated.View style={[styles.gameOverDiv, { opacity: gameOverDivOpacity }]}>
//               <Animated.Image
//                 source={require('@/assets/images/A2.png')}
//                 style={[styles.gameOverImage, { transform: [{ translateY: gameOverImagePosition }] }]}
//               />
//             </Animated.View>
//           )} */}
//            {/* Render trash icons */}
//            <View style={styles.detectedZonesContainer}>
//             {trashIcons.map((visible, index) => (
//               visible ? (
//                 <Icon
//                   key={index}
//                   name="trash"
//                   size={windowWidth * 0.05}
//                   color="green"
//                   style={{ marginHorizontal: 5 }}
//                 />
//               ) : null
//             ))}
//           </View>

//           {/* <Animated.View style={[styles.trash, { top: '52%', left: '27%', opacity: trash1Opacity }]}> */}
//           <Animated.View style={[ { top: windowHeight * 0.54, left: windowWidth * 0.27, opacity: trash1Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(1)}>
//               <Image
//                 source={require('@/assets/images/trash4.png')}
//                 style={styles.trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           {/* <Animated.View style={[ { top: '65%', left: '73%', opacity: trash2Opacity }]}> */}
//           <Animated.View style={[ { top: windowHeight * 0.66, left: windowWidth * 0.73, opacity: trash2Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(2)}>
//               <Image
//                 source={require('@/assets/images/paper_trash.png')}
//                 style={styles.paper_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           {/* <Animated.View style={[{ top: '67%', left: '5%', opacity: trash3Opacity }]}> */}
//           <Animated.View style={[ { top: windowHeight * 0.7, left: windowWidth * 0.05, opacity: trash3Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(3)}>
//               <Image
//                 source={require('@/assets/images/trash4.png')}
//                 style={styles.trash2}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           {/* <Text style={styles.scoreText}>Score: {score}</Text> */}
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
//     // width: 65,
//     // height: 60,
//     width: windowWidth * 0.13, // Example: 10% of window width
//     height: (windowWidth * 0.13)/(705 / 647), // Example: 8% of window height
  
//   },

//   paper_trash: {
//     position: 'absolute',
//     // width: 90,
//     // height: 60,
//     width: windowWidth * 0.27, 
//     height: (windowWidth * 0.27)/(181 / 102), 
//   },
//   trash2: {
//     position: 'absolute',
//     // width: 164,
//     // height: 160,
//     width: windowWidth * 0.5, 
//     height: (windowWidth * 0.5)/(705 / 647), 
//   },
//   scoreText: {
//     position: 'absolute',
//     top: windowHeight * 0.03,
//     left: windowWidth * 0.05,
//     color: 'white',
//     fontSize: 20,
//   },
//   timeText: {
//     position: 'absolute',
//     top: windowHeight * 0.03,
//     right: windowWidth * 0.05,
//     color: 'white',
//     fontSize: 20,
//   },
//   detectedZonesContainer: {
//     position: 'absolute',
//     // top: 10,
//     // left: 10,
//     // top:  30,
//     // left: 10,
//     top: windowHeight * 0.03,
//     left: windowWidth * 0.05,
//     flexDirection: 'row',
//     backgroundColor: 'black',
//     opacity: 0.55,
//     padding: 6,
//     borderRadius: 31,
//     gap: 3
//   },
//   detectedZone: {
//     // position: 'absolute',
//     // width: 15,
//     // height: 15,
//     // borderRadius: 10,
//     backgroundColor: 'green',
//     marginHorizontal: 5,
//     // top:5,

//   },
//   gameOverDiv: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: windowHeight * 0.2,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   gameOverImage: {
//     width: windowWidth * 0.5,
//     height: windowHeight * 0.7,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'black',
//     opacity: 0.5,
//   },
//   // scoreText: {
//   //   position: 'absolute',
//   //   top: 20,
//   //   left: 10,
//   //   color: 'white',
//   //   fontSize: 20,
//   // },
//   // timeText: {
//   //   position: 'absolute',
//   //   top: 20,
//   //   right: 10,
//   //   color: 'white',
//   //   fontSize: 20,
//   // },
//   // gameOverDiv: {
//   //   position: 'absolute',
//   //   top: 0,
//   //   left: 0,
//   //   right: 0,
//   //   bottom: 100,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   // },
//   // gameOverImage: {
//   //   width: 250,
//   //   height: 350,
//   // },
//   // overlay: {
//   //   ...StyleSheet.absoluteFillObject,
//   //   backgroundColor: 'black',
//   //   opacity: 0.5,
//   // },

// });

// export default App;



// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

// const App = () => {
//   const navigation = useNavigation();
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(50); // 50 seconds timer
//   const [gameOver, setGameOver] = useState(false);
//   const [trashesClicked, setTrashesClicked] = useState(0);
//   const [trash1Opacity] = useState(new Animated.Value(1));
//   const [trash2Opacity] = useState(new Animated.Value(1));
//   const [trash3Opacity] = useState(new Animated.Value(1));
//   const [iconOpacities] = useState([new Animated.Value(0.3), new Animated.Value(0.3), new Animated.Value(0.3)]);
//   const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
//   const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
//   const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);

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

//   const handleTrashClick = (trashNumber: number) => {
//     if (!gameOver) {
//       playSound(clickSound);
//       if (trashNumber === 1) {
//         animateTrash(trash1Opacity, 0);
//       } else if (trashNumber === 2) {
//         animateTrash(trash2Opacity, 1);
//       } else if (trashNumber === 3) {
//         animateTrash(trash3Opacity, 2);
//       }
//     }
//   };

//   const animateTrash = (opacity: Animated.Value, iconIndex: number) => {
//     Animated.timing(opacity, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start(() => {
//       playSound(disappearSound);
//       Animated.timing(iconOpacities[iconIndex], {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();
//       setTrashesClicked((prevTrashesClicked) => {
//         const newTrashesClicked = prevTrashesClicked + 1;
//         setScore(newTrashesClicked);
//         if (newTrashesClicked === 3) {
//           handleGameOver();
//         }
//         return newTrashesClicked;
//       });
//     });
//   };

//   const handleGameOver = async () => {
//     setGameOver(true);
//     const finalScore = trashesClicked + timeLeft;
//     setScore(finalScore);
//     try {
//       await AsyncStorage.setItem('score', score.toString());
//       console.log('Score saved successfully.');
//     } catch (error) {
//       console.error('Error saving score:', error);
//     }

//     if (trashesClicked === 3) {
//       setTimeout(() => {
//         router.push("/game1_2");
//       }, 1000);
//     }
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
//         style={[styles.backgroundImage, { width: windowWidth, height: windowHeight }]}
//       >
//         <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>
//           <View style={styles.detectedZonesContainer}>
//             {iconOpacities.map((opacity, index) => (
//               <Animated.View key={index} style={{ opacity }}>
//                 <Icon
//                   name="trash"
//                   size={windowWidth * 0.05}
//                   color="green"
//                   style={{ marginHorizontal: 5 }}
//                 />
//               </Animated.View>
//             ))}
//           </View>

//           <Animated.View style={[{ top: windowHeight * 0.54, left: windowWidth * 0.27, opacity: trash1Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(1)}>
//               <Image
//                 source={require('@/assets/images/trash4.png')}
//                 style={styles.trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={[{ top: windowHeight * 0.66, left: windowWidth * 0.73, opacity: trash2Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(2)}>
//               <Image
//                 source={require('@/assets/images/paper_trash.png')}
//                 style={styles.paper_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={[{ top: windowHeight * 0.7, left: windowWidth * 0.05, opacity: trash3Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(3)}>
//               <Image
//                 source={require('@/assets/images/trash4.png')}
//                 style={styles.trash2}
//               />
//             </TouchableOpacity>
//           </Animated.View>

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
//     width: windowWidth * 0.13,
//     height: (windowWidth * 0.13) / (705 / 647),
//   },
//   paper_trash: {
//     position: 'absolute',
//     width: windowWidth * 0.27,
//     height: (windowWidth * 0.27) / (181 / 102),
//   },
//   trash2: {
//     position: 'absolute',
//     width: windowWidth * 0.5,
//     height: (windowWidth * 0.5) / (705 / 647),
//   },
//   timeText: {
//     position: 'absolute',
//     top: windowHeight * 0.03,
//     right: windowWidth * 0.05,
//     color: 'white',
//     fontSize: 20,
//   },
//   detectedZonesContainer: {
//     position: 'absolute',
//     top: windowHeight * 0.03,
//     left: windowWidth * 0.05,
//     flexDirection: 'row',
//     backgroundColor: 'black',
//     opacity: 0.55,
//     padding: 6,
//     borderRadius: 31,
//     gap: 3,
//   },
// });

// export default App;


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const App = () => {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); // 50 seconds timer
  const [gameOver, setGameOver] = useState(false);
  const [trashesClicked, setTrashesClicked] = useState(0);
  const [trash1Opacity] = useState(new Animated.Value(1));
  const [trash2Opacity] = useState(new Animated.Value(1));
  const [trash3Opacity] = useState(new Animated.Value(1));
  const [iconOpacities] = useState([new Animated.Value(0.6), new Animated.Value(0.6), new Animated.Value(0.6)]);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
  const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
      const { sound: disappear } = await Audio.Sound.createAsync(require('@/assets/disappear.wav'));
      const { sound: appear } = await Audio.Sound.createAsync(require('@/assets/appear.wav'));
      setClickSound(click);
      setDisappearSound(disappear);
      setAppearSound(appear);
    };

    loadSounds();

    return () => {
      if (clickSound) {
        clickSound.unloadAsync();
      }
      if (disappearSound) {
        disappearSound.unloadAsync();
      }
      if (appearSound) {
        appearSound.unloadAsync();
      }
    };
  }, []);

  const playSound = async (sound: Audio.Sound | null) => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  const handleScreenClick = async () => {
    playSound(clickSound);
  };

  const handleTrashClick = (trashNumber: number) => {
    if (!gameOver) {
      playSound(clickSound);
      if (trashNumber === 1) {
        animateTrash(trash1Opacity, 0);
      } else if (trashNumber === 2) {
        animateTrash(trash2Opacity, 1);
      } else if (trashNumber === 3) {
        animateTrash(trash3Opacity, 2);
      }
    }
  };

  const animateTrash = (opacity: Animated.Value, iconIndex: number) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      playSound(disappearSound);
      Animated.timing(iconOpacities[iconIndex], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTrashesClicked((prevTrashesClicked) => {
        const newTrashesClicked = prevTrashesClicked + 1;
        setScore(newTrashesClicked);
        if (newTrashesClicked === 3) {
          handleGameOver();
        }
        return newTrashesClicked;
      });
    });
  };

  const handleGameOver = async () => {
    setGameOver(true);
    const finalScore = trashesClicked + timeLeft;
    setScore(finalScore);
    try {
      await AsyncStorage.setItem('score', score.toString());
      console.log('Score saved successfully.');
    } catch (error) {
      console.error('Error saving score:', error);
    }

    if (trashesClicked === 3) {
      setTimeout(() => {
        router.push("/game1_2");
      }, 1000);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 || gameOver) {
      handleGameOver();
    } else {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameOver]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/back1.png')}
        style={[styles.backgroundImage, { width: windowWidth, height: windowHeight }]}
      >
        <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>
          <View style={styles.detectedZonesContainer}>
            {iconOpacities.map((opacity, index) => (
              <Animated.View key={index} style={{ opacity }}>
                <Image
                  source={require('@/assets/images/trash_icon.png')} // Replace with your icon image
                  style={styles.icon}
                />
              </Animated.View>
            ))}
          </View>

          <Animated.View style={[{ top: windowHeight * 0.54, left: windowWidth * 0.27, opacity: trash1Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(1)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles.trash}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[{ top: windowHeight * 0.66, left: windowWidth * 0.73, opacity: trash2Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(2)}>
              <Image
                source={require('@/assets/images/paper_trash.png')}
                style={styles.paper_trash}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[{ top: windowHeight * 0.7, left: windowWidth * 0.05, opacity: trash3Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(3)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles.trash2}
              />
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
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
  trash: {
    position: 'absolute',
    width: windowWidth * 0.13,
    height: (windowWidth * 0.13) / (705 / 647),
  },
  paper_trash: {
    position: 'absolute',
    width: windowWidth * 0.27,
    height: (windowWidth * 0.27) / (181 / 102),
  },
  trash2: {
    position: 'absolute',
    width: windowWidth * 0.5,
    height: (windowWidth * 0.5) / (705 / 647),
  },
  timeText: {
    position: 'absolute',
    top: windowHeight * 0.05,
    right: windowWidth * 0.05,
    color: 'white',
    fontSize: 22,
  },
  detectedZonesContainer: {
    position: 'absolute',
    top: windowHeight * 0.05,
    left: windowWidth * 0.05,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.75,
    padding: 6,
    borderRadius: 31,
    gap: 3,
  },
  icon: {
    width: windowWidth * 0.04,
    height: windowWidth * 0.045,
    marginHorizontal: 5,
  },
});

export default App;
