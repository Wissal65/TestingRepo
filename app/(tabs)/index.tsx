import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const App = () => {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50); // 50 seconds timer
  const [gameOver, setGameOver] = useState(false);
  const [trashesClicked, setTrashesClicked] = useState(0);
  const [trash1Opacity] = useState(new Animated.Value(1));
  const [trash2Opacity] = useState(new Animated.Value(1));
  const [trash3Opacity] = useState(new Animated.Value(1));
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
  const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showGameOverDiv, setShowGameOverDiv] = useState(false);
  const [gameOverDivOpacity] = useState(new Animated.Value(0));
  const [gameOverImagePosition] = useState(new Animated.Value(0));

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
      // setTrashesClicked((prevTrashesClicked) => {
      //   const newTrashesClicked = prevTrashesClicked + 1;
      //   if (newTrashesClicked === 3) {
      //     handleGameOver();
      //   }
      //   return newTrashesClicked;
      // });
      
      if (trashNumber === 1) {
        animateTrash(trash1Opacity);
      } else if (trashNumber === 2) {
        animateTrash(trash2Opacity);
      } else if (trashNumber === 3) {
        animateTrash(trash3Opacity);
      }
    }
  };

  const animateTrash = (opacity:Animated.Value) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      console.log('Animation completed');
      playSound(disappearSound);
       // Increment trashesClicked after the animation is complete
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
    setShowOverlay(true);
    setShowGameOverDiv(true);
    try {
      await AsyncStorage.setItem('score', score.toString());
      console.log('Score saved successfully.');
    } catch (error) {
      console.error('Error saving score:', error);
    }

    // Show the game over message with animation
    Animated.timing(gameOverDivOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      playSound(appearSound);
    });

    // Animate the game over image position
    Animated.timing(gameOverImagePosition, {
      toValue: 100, // Adjust as needed
      duration: 1000, // Adjust as needed
      useNativeDriver: true,
    }).start();
    // Navigate to the new screen after 10 seconds
    setTimeout(() => {
      // navigation.navigate('NewScreen');
      router.push("/game1_2");
    }, 10000);
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
        style={styles.backgroundImage}
      >
        {/* Overlay */}
        {showOverlay && (
          <View style={styles.overlay} />
        )}

        <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>
          {/* Game Over Div */}
          {showGameOverDiv && (
            <Animated.View style={[styles.gameOverDiv, { opacity: gameOverDivOpacity }]}>
              <Animated.Image
                source={require('@/assets/images/A2.png')}
                style={[styles.gameOverImage, { transform: [{ translateY: gameOverImagePosition }] }]}
              />
            </Animated.View>
          )}

          <Animated.View style={[styles.trash, { top: '52%', left: '27%', opacity: trash1Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(1)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles.trash}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.trash, { top: '65%', left: '73%', opacity: trash2Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(2)}>
              <Image
                source={require('@/assets/images/paper_trash.png')}
                style={styles.paper_trash}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.trash2, { top: '67%', right: '49%', opacity: trash3Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(3)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles.trash2}
              />
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.scoreText}>Score: {score}</Text>
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
    width: 65,
    height: 60,
  },

  paper_trash: {
    position: 'absolute',
    width: 90,
    height: 60,
  },
  trash2: {
    position: 'absolute',
    width: 164,
    height: 160,
  },
  scoreText: {
    position: 'absolute',
    top: 20,
    left: 10,
    color: 'white',
    fontSize: 20,
  },
  timeText: {
    position: 'absolute',
    top: 20,
    right: 10,
    color: 'white',
    fontSize: 20,
  },
  gameOverDiv: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverImage: {
    width: 250,
    height: 350,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.5,
  },
});

export default App;
