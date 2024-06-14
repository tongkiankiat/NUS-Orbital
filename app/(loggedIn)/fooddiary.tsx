import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const fooddiary = () => {

  const navg_updatediary = () => {
    router.push("../(fooddiaryscreens)/updatediary")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header_navigate}>
        <TouchableOpacity style={styles.headerarrow}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.label}>Diary</Text>
      </View>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text>Today</Text>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonheader}>
        <TouchableOpacity style={styles.button} onPress={navg_updatediary}>
          <Text style={{ textAlign: 'center' }}>Breakfast</Text>
          <Text style={{ textAlign: 'center' }}>[TIMER COUNTDOWN]</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.checklistheader}>
        <View style={styles.roundedbackground}>
          <Text style={{ textAlign: 'center' }}>Checklist</Text>
          <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', flex: 1, paddingLeft: 5, paddingTop: 15 }}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingRight: 5 }}>
              <Text>Breakfast</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingRight: 5 }}>
              <Text>Lunch</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingRight: 5 }}>
              <Text>Dinner</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingRight: 5 }}>
              <Text>Snacks</Text>
              <TouchableOpacity>
                <Text>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.roundedbackground}>
          <Text style={{ textAlign: 'center' }}>Calorie Tracker</Text>
          <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
            <Entypo name="circle" size={100} color="black" />
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <FontAwesome5 name="flag-checkered" size={18} color="black" />
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>Caloric Goal</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center' }}>
                  <Text>1000</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={18} color="black" />
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>Consumed Calories</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center' }}>
                  <Text>2000</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#E4FBFF"
  },
  header_navigate: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
    paddingTop: StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontWeight: 'bold',
    justifyContent: 'center'
  },
  headerarrow: {
    paddingRight: 10
  },
  buttonheader: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 50
  },
  button: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
  checklistheader: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  roundedbackground: {
    backgroundColor: 'white',
    width: 150,
    height: 200,
    borderRadius: 20
  }
})

export default fooddiary;