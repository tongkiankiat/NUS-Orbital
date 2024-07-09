import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'

// TODO: Under the 'NUS' tab, create buttons to each canteen in NUS, then add the respective food items inside each canteen tab

const CategorySearch = () => {

  // Move to muscle groups screen
  const nextScreen = (selectedMuscleGroup: string) => {
    router.push({
      pathname: '../components/musclegroup',
      params: {
        muscle: selectedMuscleGroup
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowcontainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('neck')}>
            <Image style={styles.image} source={require('../../assets/images/neck.png')} />
            <Text>Neck</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('traps')}>
            <Image style={styles.image} source={require('../../assets/images/traps.png')} />
            <Text>Traps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('shoulders')}>
            <Image style={styles.image} source={require('../../assets/images/shoulders.png')} />
            <Text>Shoulders</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('biceps')}>
            <Image style={styles.image} source={require('../../assets/images/biceps.png')} />
            <Text>Biceps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('triceps')}>
            <Image style={styles.image} source={require('../../assets/images/triceps.png')} />
            <Text>Triceps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('chest')}>
            <Image style={styles.image} source={require('../../assets/images/chest.png')} />
            <Text>Chest</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('forearms')}>
            <Image style={styles.image} source={require('../../assets/images/forearm.png')} />
            <Text>Forearms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('abdominals')}>
            <Image style={styles.image} source={require('../../assets/images/abs.png')} />
            <Text>Abdominals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('quadriceps')}>
            <Image style={styles.image} source={require('../../assets/images/quads.png')} />
            <Text>Quadriceps</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('middle back')}>
            <Image style={styles.image} source={require('../../assets/images/back.png')} />
            <Text>Middle Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('lower back')}>
            <Image style={styles.image} source={require('../../assets/images/back.png')} />
            <Text>Lower Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('lats')}>
            <Image style={styles.image} source={require('../../assets/images/back.png')} />
            <Text>Lats</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('glutes')}>
            <Image style={styles.image} source={require('../../assets/images/glutes.png')} />
            <Text>Glutes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('hamstrings')}>
            <Image style={styles.image} source={require('../../assets/images/quads.png')} />
            <Text>Hamstrings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => nextScreen('calves')}>
            <Image style={styles.image} source={require('../../assets/images/calves.png')} />
            <Text>Calves</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF'
  },
  rowcontainer: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 110,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    resizeMode: 'contain',
    width: 20,
    height: 20
  }
})

export default CategorySearch;
