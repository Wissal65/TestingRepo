// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
// import Bird from './Bird';
// import Pipe from './Pipe';

// const { width, height } = Dimensions.get('window');

// const App = () => {
//   const BIRD_SIZE = 50;
//   const GRAVITY = 3;
//   const JUMP_HEIGHT = 50;
//   const PIPE_WIDTH = 60;
//   const PIPE_HEIGHT = 300;
//   const GAP = 200;

//   const [birdBottom, setBirdBottom] = useState(height / 2);
//   const [pipesLeft, setPipesLeft] = useState(width);
//   const [pipesNegHeight, setPipesNegHeight] = useState(0);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [score, setScore] = useState(0);

//   const gameTimerId = useRef<number | null>(null);
//   const pipesTimerId = useRef<number | null>(null);

//   // Handle bird falling due to gravity
//   useEffect(() => {
//     if (birdBottom > 0) {
//       gameTimerId.current = window.setInterval(() => {
//         setBirdBottom(birdBottom => birdBottom - GRAVITY);
//       }, 30);
//       return () => clearInterval(gameTimerId.current!);
//     }
//   }, [birdBottom]);

//   // Handle pipe movement and reset
//   useEffect(() => {
//     if (pipesLeft > -PIPE_WIDTH) {
//       pipesTimerId.current = window.setInterval(() => {
//         setPipesLeft(pipesLeft => pipesLeft - 5);
//       }, 30);
//       return () => clearInterval(pipesTimerId.current!);
//     } else {
//       setPipesLeft(width);
//       setPipesNegHeight(-Math.random() * (PIPE_HEIGHT / 2)); // Randomize pipe height
//       setScore(score => score + 1);
//     }
//   }, [pipesLeft]);

//   // Handle collision detection
//   useEffect(() => {
//     console.log(`Bird Bottom: ${birdBottom}`);
//     console.log(`Pipes Left: ${pipesLeft}`);
//     console.log(`Pipe Negative Height: ${pipesNegHeight}`);

//     if (
//       ((birdBottom < (pipesNegHeight + PIPE_HEIGHT) || birdBottom > (pipesNegHeight + PIPE_HEIGHT + GAP)) &&
//       (pipesLeft > (width / 2 - BIRD_SIZE / 2) && pipesLeft < (width / 2 + BIRD_SIZE / 2)))
//     ) {
//       console.log('Game Over Condition Met');
//       gameOver();
//     }
//   }, [birdBottom, pipesLeft]);

//   // Game over function
//   const gameOver = () => {
//     clearInterval(gameTimerId.current!);
//     clearInterval(pipesTimerId.current!);
//     setIsGameOver(true);
//   };

//   // Handle jump
//   const jump = () => {
//     console.log('Jump');
//     if (!isGameOver && birdBottom < height - BIRD_SIZE) {
//       setBirdBottom(birdBottom => birdBottom + JUMP_HEIGHT);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={jump}>
//       <View style={styles.container}>
//         <Bird birdBottom={birdBottom} birdLeft={width / 2 - BIRD_SIZE / 2} birdSize={BIRD_SIZE} />
//         <Pipe pipeLeft={pipesLeft} pipeWidth={PIPE_WIDTH} pipeHeight={PIPE_HEIGHT} pipeBottom={pipesNegHeight + PIPE_HEIGHT + GAP} />
//         <Pipe pipeLeft={pipesLeft} pipeWidth={PIPE_WIDTH} pipeHeight={PIPE_HEIGHT} pipeBottom={pipesNegHeight} />
//         <Text style={styles.scoreText}>Score: {score}</Text>
//         {isGameOver && <Text style={styles.gameOver}>Game Over</Text>}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#71c5cf',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   scoreText: {
//     position: 'absolute',
//     top: 30,
//     left: 10,
//     color: 'white',
//     fontSize: 20,
//   },
//   gameOver: {
//     position: 'absolute',
//     top: height / 2,
//     fontSize: 48,
//     color: 'red',
//   },
// });

// export default App;
