import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/background_profile.png')} style={styles.backgroundImage} />

      {/* First Part: Profile Image and Name */}
      <View style={styles.profileContainer}>
        <Avatar
          rounded
          size={width * 0.36} // Responsive avatar size
          source={require('@/assets/images/a.png')}
          containerStyle={styles.avatar}
        />
        <Text style={styles.nameText}>محمد علي</Text>
      </View>

      {/* Second Part: Rank and Score */}
      <View style={styles.rankContainer}>
        <View style={styles.rankCircle}>
          <Text style={styles.rankText}>1</Text>
        </View>
        <View style={styles.scoreCard}>
          <Icon name="diamond" type="font-awesome" color="#00aced" size={25} />
          <Text style={styles.scoreText}>200</Text>
        </View>
      </View>

      {/* Third Part: Actions and Menu */}
      <View style={styles.CardContainer}>
      <View style={styles.actionsContainer}>
        <View style={styles.actionCard}>
          <Text style={styles.actionText}>الاهتزاز</Text>
          {/* <Icon name="mobile" type="font-awesome" size={25} /> */}
          <Image style={styles.iconImage} 
          source={require('@/assets/images/vibration.png')}/>
        </View>
        <View style={styles.actionCard}>
          <Text style={styles.actionText}>موسيقى</Text>
          <Icon name="music" type="font-awesome" size={25}/>
        </View>
        <View style={styles.actionCard}>
          <Text style={styles.actionText}>صوت</Text>
          <Icon name="volume-up" type="font-awesome" size={25}/>
        </View>
        <View style={styles.actionCard}>
          <Text style={styles.actionText}>إعادة اللعب</Text>
          <Icon name="power-off" type="font-awesome"size={25} color={'red'}/>
        </View>
      </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: height * 0.05,
  },
  avatar: {
    borderColor: '#04E762',
    borderWidth: 3,
  },
  nameText: {
    fontSize: width * 0.08,
    marginTop: height * 0.015,
    fontWeight: 'bold',
  },
  rankContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.015,
    bottom: height * 0.03
  },
  rankCircle: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: (width * 0.18) / 2,
    backgroundColor: '#18ABB1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.05,
    borderRightWidth: 2,
    borderLeftWidth: 0.5,
    borderBottomWidth: 3.9,
    borderBottomColor: '#D3D3D3',
    borderRightColor: '#D3D3D3',
    borderLeftColor: '#D3D3D3',
  },
  rankText: {
    color: 'white',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  scoreCard: {
    // width: width*0.3,
    width: width*0.5,
    flexDirection: 'row',
    alignItems: 'center',
    // padding: width * 0.05,
    padding: width * 0.065,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Adds a shadow for Android
    shadowColor: '#000', // Adds a shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'center',
  },
  scoreText: {
    marginLeft: width * 0.03,
    fontSize: width * 0.056,
    color: '#D3D3D3',
    fontWeight:'bold',
  },
  CardContainer:{
    // backgroundColor: '#18ABB1',
    backgroundColor: 'rgba(24, 171, 177, 0.25)',
    flex: 1,
    borderTopStartRadius: 32,
    borderTopEndRadius: 32,
    paddingVertical: height*0.01,
  },
  actionsContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: height * 0.02,
    
  },
  actionCard: {
    width: width* 0.4,
    alignItems: 'center',
    padding: width * 0.055,
    margin: width* 0.03,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Adds a shadow for Android
    shadowColor: '#000', // Adds a shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  actionText: {
    marginBottom: height * 0.01,
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  iconImage:{
    width: width*0.088,
    height: height*0.0399
  }
});

export default ProfilePage;
