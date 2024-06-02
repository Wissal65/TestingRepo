import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableWithoutFeedback, Text } from 'react-native';

type CircleZone = {
  cx: number;
  cy: number;
  radius: number;
  color: string;
};

const App = () => {
  const [selectedZone, setSelectedZone] = useState<CircleZone | null>(null);

  const zones: CircleZone[] = [
    { cx: 120, cy: 320, radius: 57, color: 'rgba(255, 255, 0, 0.3)' },
  ];

  const handleZonePress = (zone: CircleZone) => {
    setSelectedZone(zone);
  };

  const renderZones = () => {
    return zones.map((zone, index) => (
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
              borderColor: 'red', // Red border
              backgroundColor: 'transparent', // No background color
            },
          ]}
        />
      </TouchableWithoutFeedback>
    ));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        blurRadius={8}
        source={require('@/assets/images/back7.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/prob6_.png')}
            style={styles.image}
          />
          {renderZones()}
        </View>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 190, 11, 0.16)', // #FFBE0B with 31% opacity
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '91%', // Adjust size as needed
    height: '65%', // Adjust size as needed
  },
  zone: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red', // Red border color
    backgroundColor: 'transparent', // No background color
  },
  coordinateText: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    color: 'white',
    fontSize: 20,
  },
});

export default App;
