import { View, Text, StyleSheet, StatusBar, Alert, FlatList, Image, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import { Feather, EvilIcons } from '@expo/vector-icons';

// Define screen dimensions here
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const MuscleGroup = () => {
  // Get the selected muscle group
  const { muscle } = useLocalSearchParams();

  // Define useState variables
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelected] = useState(null);
  const [isflipped, setIsFlipped] = useState(false);

  // Close Modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Get the exercises for the muscle group
  const getExercises = async () => {
    setLoading(true);
    if (!muscle) {
      console.error('There is no muscle group selected!');
      Alert.alert('There is no muscle group selected!');
      return;
    };
    try {
      const { data, error } = await supabase.from('exercises').select('*').contains('primarymuscles', [muscle]);
      if (error) {
        Alert.alert(`Error retrieving exercises for ${muscle}: `, error.message);
      } else if (data) {
        if (data.length <= 0) {
          Alert.alert(`No exercises found for ${muscle}!`);
        } else {
          setExercises(data);
        }
      }
    } catch (error) {
      console.error(`Error retrieving exercises for ${muscle}: `, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExercises();
  }, []);

  // Render the data retrieved from database and display it properly
  const renderExercises = ({ item }) => {
    return (
      <TouchableOpacity style={{ padding: 15 }} onPress={() => handlePress(item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  };

  // Capitalize each exercise in the secondary muscles array
  const capitalizeArray = (array: any) => {
    return array.map(item => item.charAt(0).toUpperCase() + item.slice(1));
  }

  const toggleImage = () => {
    setIsFlipped(!isflipped);
  }

  // Render the details of the exercise
  const renderExerciseDetails = (item: any) => {
    // Handle details that could be null
    const secondaryMuscles = item.secondarymuscles.filter((muscle: any) => muscle !== null);

    return (
      <View>
        <View style={styles.modalheader}>
          <Text style={{ textAlign: 'left', flex: 1, fontWeight: 'bold', fontSize: 20 }}>{item.name}</Text>
          <TouchableOpacity onPress={() => closeModal()}>
            <Icon name='close-circle' size={24} color='#007BFF' />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'black' }}>
            {isflipped ? <Image style={{ width: 200, height: 200, resizeMode: 'contain', aspectRatio: 1 }} source={{ uri: item.imageURLs[1] }} /> : <Image style={{ width: 200, height: 200, resizeMode: 'contain' }} source={{ uri: item.imageURLs[0] }} />}
            <TouchableOpacity onPress={toggleImage}>
              <EvilIcons name="refresh" size={36} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.exercisetext}>Equipment required: {(item.equipment)[0].toUpperCase() + (item.equipment).substr(1)}</Text>
          <Text style={styles.exercisetext}>{item.primarymuscles.length <= 1 ? 'Primary Muscle' : 'Primary Muscles'}: {(item.primarymuscles)[0][0].toUpperCase() + (item.primarymuscles)[0].substr(1)}</Text>
          <Text style={styles.exercisetext}>{secondaryMuscles.length <= 1 ? 'Secondary Muscle' : 'Secondary Muscles'}: {secondaryMuscles.length === 0 ? 'NIL' : capitalizeArray(secondaryMuscles).join(", ")}</Text>
          <Text style={styles.exercisetext}>Instructions: {item.instructions}</Text>
        </ScrollView>
      </View>
    )
  };

  // Open Modal Screen when exercise is pressed
  const handlePress = (item: any) => {
    setSelected(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerarrow} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 24, textAlign: 'center', paddingRight: 30 }}>{muscle?.charAt(0).toUpperCase() + muscle?.slice(1)}</Text>
      </View>
      <FlatList
        data={exercises}
        renderItem={renderExercises}
        style={styles.flatlist}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator} />
          )
        }}
      />
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedExercise && renderExerciseDetails(selectedExercise)}
          </View>
        </View>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF',
    paddingTop: StatusBar.currentHeight
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerarrow: {
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  searchButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center'
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatlist: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  modalheader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
    maxHeight: screenHeight * 0.8,
    maxWidth: screenWidth,
  },
  exercisetext: {
    fontSize: 16,
    paddingVertical: 5
  }
});

export default MuscleGroup;