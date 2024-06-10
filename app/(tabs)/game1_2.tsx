// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';

// const SecondGame = () => {
//   const [finalScore, setFinalScore] = useState(0);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(5000); // 50 seconds timer
//   const [gameOver, setGameOver] = useState(false);
//   const [trashesClicked, setTrashesClicked] = useState(0);
//   const [trash1Opacity] = useState(new Animated.Value(1));
//   const [trash2Opacity] = useState(new Animated.Value(1));
//   const [trash3Opacity] = useState(new Animated.Value(1));
//   const [trash4Opacity] = useState(new Animated.Value(1));
//   const [trash5Opacity] = useState(new Animated.Value(1));
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

//       if (trashNumber === 1) {
//         animateTrash(trash1Opacity);
//       } else if (trashNumber === 2) {
//         animateTrash(trash2Opacity);
//       } else if (trashNumber === 3) {
//         animateTrash(trash3Opacity);
//       }else if (trashNumber === 4) {
//         animateTrash(trash4Opacity);
//       }else if (trashNumber === 5) {
//         animateTrash(trash5Opacity);
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
//         if (newTrashesClicked === 5) {
//           handleGameOver();
//         }
//         return newTrashesClicked;
//       });
//     });
//   };

//   const handleGameOver = async () => {
//     setGameOver(true);
//     const currentGameScore = trashesClicked + timeLeft;
//     setScore(currentGameScore);
    
//     // Retrieve the score from the first game
//     let firstGameScore = 0;
//     try {
//       const storedScore = await AsyncStorage.getItem('score');
//       if (storedScore !== null) {
//         firstGameScore = parseInt(storedScore, 10);
//       }
//     } catch (error) {
//       console.error('Error retrieving score from the first game:', error);
//     }

//     const finalScore = currentGameScore + firstGameScore;
//     setScore(finalScore);
//     // setFinalScore(finalScore);
//     setShowOverlay(true);
//     setShowGameOverDiv(true);

//     try {
//       await AsyncStorage.setItem('finalScore', finalScore.toString());
//       console.log('Final score saved successfully.');
//     } catch (error) {
//       console.error('Error saving final score:', error);
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
//       router.push("/game1_3");
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

//   useEffect(() => {
//     // Retrieve the final score from AsyncStorage when the component mounts
//     const retrieveFinalScore = async () => {
//       try {
//         const score = await AsyncStorage.getItem('finalScore');
//         if (score !== null) {
//           setFinalScore(parseInt(score, 10)); // Parse score to integer
//         }
//       } catch (error) {
//         console.error('Error retrieving final score:', error);
//       }
//     };

//     retrieveFinalScore();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require('@/assets/images/back2.png')}
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
//                 source={require('@/assets/images/A3.png')}
//                 style={[styles.gameOverImage, { transform: [{ translateY: gameOverImagePosition }] }]}
//               />
//             </Animated.View>
//           )}

//           <Animated.View style={[styles.trash, { top: '57%', left: '46%', opacity: trash1Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(1)}>
//               <Image
//                 source={require('@/assets/images/bottle_trash.png')}
//                 style={styles.bottle_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={[styles.trash, { top: '59%', left: '75%', opacity: trash4Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(4)}>
//               <Image
//                 source={require('@/assets/images/lemonade_trash.png')}
//                 style={styles.lemonade_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={[styles.trash, { top: '62%', left: '86%', opacity: trash2Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(2)}>
//               <Image
//                 source={require('@/assets/images/paper_trash.png')}
//                 style={styles.paper_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={[styles.apple_trash, { top: '69%', right: '34%', opacity: trash3Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(3)}>
//               <Image
//                 source={require('@/assets/images/apple_trash.png')}
//                 style={styles.apple_trash}
//               />
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View style={[styles.trash2, { top: '85%', right: '70%', opacity: trash5Opacity }]}>
//             <TouchableOpacity onPress={() => handleTrashClick(5)}>
//               <Image
//                 source={require('@/assets/images/paper2_trash.png')}
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
//     width: 65,
//     height: 60,
//   },
//   bottle_trash: {
//     position: 'absolute',
//     width: 45,
//     height: 20,
//   },

//   paper_trash: {
//     position: 'absolute',
//     width: 70,
//     height: 40,
//   },
//   apple_trash: {
//     position: 'absolute',
//     width: 50,
//     height: 30,
//   },
//   lemonade_trash: {
//     position: 'absolute',
//     width: 30,
//     height: 20,
//   },
//   trash2: {
//     position: 'absolute',
//     width: 70,
//     height: 50,
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
//     bottom: 100,
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

// export default SecondGame;



import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SecondGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50); // 50 seconds timer
  const [gameOver, setGameOver] = useState(false);
  const [trashesClicked, setTrashesClicked] = useState(0);
  const [trash1Opacity] = useState(new Animated.Value(1));
  const [trash2Opacity] = useState(new Animated.Value(1));
  const [trash3Opacity] = useState(new Animated.Value(1));
  const [trash4Opacity] = useState(new Animated.Value(1));
  const [trash5Opacity] = useState(new Animated.Value(1));
  const [iconOpacities] = useState([new Animated.Value(0.6), new Animated.Value(0.6), new Animated.Value(0.6), new Animated.Value(0.6), new Animated.Value(0.6)]);
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

  const handleTrashClick = (trashNumber: Number) => {
    if (!gameOver) {
      playSound(clickSound);

      if (trashNumber === 1) {
        animateTrash(trash1Opacity,0);
      } else if (trashNumber === 2) {
        animateTrash(trash2Opacity,1);
      } else if (trashNumber === 3) {
        animateTrash(trash3Opacity,2);
      }else if (trashNumber === 4) {
        animateTrash(trash4Opacity,3);
      }else if (trashNumber === 5) {
        animateTrash(trash5Opacity, 4);
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
        if (newTrashesClicked === 5) {
          handleGameOver();
        }
        return newTrashesClicked;
      });
    });
  };
  const handleGameOver = async () => {
    setGameOver(true);
    const currentGameScore = trashesClicked + timeLeft;
    setScore(currentGameScore);
    
    // Retrieve the score from the first game
    let firstGameScore = 0;
    try {
      const storedScore = await AsyncStorage.getItem('score');
      if (storedScore !== null) {
        firstGameScore = parseInt(storedScore, 10);
      }
    } catch (error) {
      console.error('Error retrieving score from the first game:', error);
    }

    const finalScore = currentGameScore + firstGameScore;
    setScore(finalScore);

    try {
      await AsyncStorage.setItem('finalScore', finalScore.toString());
      console.log('Final score saved successfully.');
    } catch (error) {
      console.error('Error saving final score:', error);
    }

    if (trashesClicked === 5) {
      setTimeout(() => {
        router.push("/game1_3");
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

  // useEffect(() => {
  //   // Retrieve the final score from AsyncStorage when the component mounts
  //   const retrieveFinalScore = async () => {
  //     try {
  //       const score = await AsyncStorage.getItem('finalScore');
  //       if (score !== null) {
  //         setFinalScore(parseInt(score, 10)); // Parse score to integer
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving final score:', error);
  //     }
  //   };

  //   retrieveFinalScore();
  // }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/back2.png')}
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
          <Animated.View style={[{ top: windowHeight * 0.56, left: windowWidth * 0.4, opacity: trash1Opacity }]}>
          {/* <Animated.View style={[styles.trash, { top: '57%', left: '46%', opacity: trash1Opacity }]}> */}
            <TouchableOpacity onPress={() => handleTrashClick(1)}>
              <Image
                source={require('@/assets/images/bottle_trash.png')}
                style={styles.bottle_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ top: windowHeight * 0.725, left: windowWidth * 0.77, opacity: trash4Opacity }]}>
          {/* <Animated.View style={[styles.trash, { top: '59%', left: '75%', opacity: trash4Opacity }]}> */}
            <TouchableOpacity onPress={() => handleTrashClick(4)}>
              <Image
                source={require('@/assets/images/lemonade_trash.png')}
                style={styles.lemonade_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ top: windowHeight * 0.608, left: windowWidth * 0.84, opacity: trash2Opacity }]}>
          {/* <Animated.View style={[styles.trash, { top: '62%', left: '86%', opacity: trash2Opacity }]}> */}
            <TouchableOpacity onPress={() => handleTrashClick(2)}>
              <Image
                source={require('@/assets/images/paper_trash.png')}
                style={styles.paper_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ top: windowHeight * 0.745, left: windowWidth * 0.39, opacity: trash3Opacity }]}>
          {/* <Animated.View style={[styles.apple_trash, { top: '69%', right: '34%', opacity: trash3Opacity }]}> */}
            <TouchableOpacity onPress={() => handleTrashClick(3)}>
              <Image
                source={require('@/assets/images/apple_trash.png')}
                style={styles.apple_trash}
              />
            </TouchableOpacity>
          </Animated.View>
           
          <Animated.View style={[{ top: windowHeight * 0.84, left: windowWidth * 0.05, opacity: trash5Opacity }]}>
          {/* <Animated.View style={[styles.trash2, { top: '85%', right: '70%', opacity: trash5Opacity }]}> */}
            <TouchableOpacity onPress={() => handleTrashClick(5)}>
              <Image
                source={require('@/assets/images/paper2_trash.png')}
                style={styles.paper_trash2}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* <Text style={styles.scoreText}>Score: {score}</Text> */}
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
    // width: 65,
    // height: 60,
    width: 65,
    height: 60,
    // width: windowWidth * 0.13,
    // height: (windowWidth * 0.13) / (705 / 647),
  },
  bottle_trash: {
    position: 'absolute',
    // width: 45,
    // height: 20,
    //448X308
    width: windowWidth * 0.18,
    height: (windowWidth * 0.16) / (448/ 308),
  },

  paper_trash: {
    position: 'absolute',
    // width: 70,
    // height: 40,
    width: windowWidth * 0.19,
    height: (windowWidth * 0.17) / (448/ 308),
  },
  apple_trash: {
    position: 'absolute',
    // width: 50,
    // height: 30,
    //448X308
    width: windowWidth * 0.18,
    height: (windowWidth * 0.18) / (448/ 308),
  },
  lemonade_trash: {
    position: 'absolute',
    // width: 30,
    // height: 20,
      //448X308
      width: windowWidth * 0.1,
      height: (windowWidth * 0.1) / (448/ 308),
  },
  paper_trash2: {
    position: 'absolute',
    // width: 70,
    // height: 50,
    //204X116
    width: windowWidth * 0.35,
    height: (windowWidth * 0.35) / (204/ 116),
  },
  // scoreText: {
  //   position: 'absolute',
  //   top: windowHeight * 0.03,
  //   left: windowWidth * 0.05,
  //   color: 'white',
  //   fontSize: 22,
  // },
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

export default SecondGame;
