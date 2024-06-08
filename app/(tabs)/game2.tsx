import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableWithoutFeedback, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable'; // Import Animatable library
import { Audio } from 'expo-av';
type CircleZone = {
  cx: number;
  cy: number;
  radius: number;
  color: string;
};

type ImageWithZones = {
  image: any; // Image source
  zones: CircleZone[];
};

const imagesWithZones: ImageWithZones[] = [
  {
    image: require('@/assets/images/prob1_.png'),
    zones: [
      { cx: 290, cy: 169, radius: 75, color: 'rgba(0, 255, 0, 0.2)' },
      { cx: 290, cy: 320, radius: 58, color: 'rgba(255, 255, 0, 0.3)' },
    ],
  },
  {
    image: require('@/assets/images/prob4.png'),
    zones: [
        { cx: 36, cy: 300, radius: 27, color: 'rgba(0, 255, 0, 0.2)' },
        { cx: 330, cy: 270, radius: 26, color: 'rgba(0, 255, 0, 0.2)' },
        { cx: 74, cy: 400, radius: 65, color: 'rgba(255, 255, 0, 0.3)' },
    ],
  },
  {
    image: require('@/assets/images/prob2_.png'),
    zones: [
      { cx: 170, cy: 171, radius: 57, color: 'rgba(0, 255, 0, 0.2)' },
      { cx: 105, cy: 450, radius: 66, color: 'rgba(255, 255, 0, 0.3)' },
    ],
  },
  {
    image: require('@/assets/images/prob5_.png'),
    zones: [
        { cx: 86, cy: 360, radius: 62, color: 'rgba(255, 255, 0, 0.3)' },
    ],
  },  {
    image: require('@/assets/images/prob6_.png'),
    zones: [
        { cx: 120, cy: 320, radius: 57, color: 'rgba(255, 255, 0, 0.3)' },
    ],
  },
];

const App = () => {
  const [selectedZones, setSelectedZones] = useState<CircleZone[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50); // Initial time left
  const [gameOver, setGameOver] = useState(false); // State to track game over
  const [disableClick, setDisableClick] = useState(false); // State to disable click after game over
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track current image
  
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null); // State for click sound
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null); // State for correct sound
  
  useEffect(() => {
    // Load sounds
    const loadSounds = async () => {
        const { sound: click } = await Audio.Sound.createAsync(require('@/assets/tap.mp3'));
      const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/right.mp3'));
      setClickSound(click);
      setCorrectSound(correct);
    };

    loadSounds();

    return () => {
      // Unload sounds
      if (clickSound) {
        clickSound.unloadAsync();
      }
      if (correctSound) {
        correctSound.unloadAsync();
      }
    };
  }, []);

//   useEffect(() => {
//     const loadScore = async () => {
//       try {
//         const savedScore = await AsyncStorage.getItem('score');
//         if (savedScore !== null) {
//           setScore(parseInt(savedScore, 10));
//         }
//       } catch (error) {
//         console.error('Failed to load score from AsyncStorage', error);
//       }
//     };

//     loadScore();
//   }, []);

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
    if (gameOver || disableClick) return; // Do nothing if game is over or click is disabled
    // Play click sound
    if (clickSound) {
        clickSound.replayAsync();
      }
    setSelectedZones(prevSelectedZones => [...prevSelectedZones, zone]);
    setScore(prevScore => prevScore + 1); // Increment score

    const currentZones = imagesWithZones[currentImageIndex].zones;
    if (selectedZones.length === currentZones.length - 1 && currentZones.includes(zone)) {
      // Play correct sound
      if (correctSound) {
        correctSound.replayAsync();
      }

      // If the last zone is clicked correctly, move to the next image
      if (currentImageIndex < imagesWithZones.length - 1) {
        setDisableClick(true); // Disable click while transitioning to next image
        setTimeout(() => {
          setCurrentImageIndex(prevIndex => prevIndex + 1);
          setSelectedZones([]); // Reset selected zones for the next image
        //   imageViewRef.current?.fadeIn(200);
          setDisableClick(false); // Re-enable click after image transition
        }, 150); // Adjust delay as needed
      } else {
        // If all images are completed, game over
        setGameOver(true);
        setDisableClick(true);
        Alert.alert('Game Over', 'Congratulations! You completed all the images.');
      }
    } else if (selectedZones.length === currentZones.length - 1 && !currentZones.includes(zone)) {
      // If the last zone clicked is incorrect, game over
      setGameOver(true);
      setDisableClick(true);
      Alert.alert('Game Over', 'You clicked the wrong zone.');
    }
  };

  useEffect(() => {
    // Update time every second
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
    // Clear interval on unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, [timeLeft, gameOver]); // Rerun effect when timeLeft or gameOver state changes

  const imageViewRef = useRef<Animatable.View>(null); // Define a ref for Animatable.View

  const currentImageWithZones = imagesWithZones[currentImageIndex];

  return (
    <TouchableWithoutFeedback onPress={handleGeneralClick}>
    <View style={styles.container}>
      <ImageBackground
        blurRadius={8}
        source={require('@/assets/images/back8.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <View style={styles.imageContainer}>
          <Animatable.View // Use Animatable.View for animation
             key={currentImageIndex} // Assign ref to Animatable.View
            animation="fadeIn" // Fade-in animation
            duration={500} // Duration of animation
            style={styles.imageWrapper}
          >
            <Image
              source={currentImageWithZones.image}
              style={styles.image}
            />
          </Animatable.View>
          {currentImageWithZones.zones.map((zone, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(zone)}>
              <View
                style={[
                  styles.zone_,
                  {
                    top: zone.cy - zone.radius,
                    left: zone.cx - zone.radius,
                    width: zone.radius * 2,
                    height: zone.radius * 2,
                    borderRadius: zone.radius,
                  },
                ]}
              />
            </TouchableWithoutFeedback>
          ))}
          {selectedZones.map((zone, index) => (
            <View
              key={index}
              style={[
                styles.zone,
                {
                  top: zone.cy - zone.radius,
                  left: zone.cx - zone.radius,
                  width: zone.radius * 2,
                  height: zone.radius * 2,
                  borderRadius: zone.radius,
                  borderColor: 'red', // Yellow border
                  backgroundColor: 'transparent', // No background color
                },
              ]}
            />
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
    flex: 1
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
  width: '91%', // Adjust size as needed
  height: '65%', // Adjust size as needed
},
image: {
  flex: 1,
  width: '100%', // Adjust size as needed
  height: '100%', // Adjust size as needed
},
zone: {
  position: 'absolute',
  borderWidth: 2,
  borderColor: 'red', // Red border color
  backgroundColor: 'transparent', // No background color
},
zone_: {
  position: 'absolute',
  borderWidth: 0,
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
