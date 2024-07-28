import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, StatusBar, Alert, TouchableOpacity } from 'react-native';
import SharedHeader from '../components/sharedheader';
import { supabase } from '../../lib/supabase';
import { CoinsContext } from '../context/CoinsContext';
import { FontAwesome5 } from '@expo/vector-icons';

// Define screen dimensions
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const Rewards = () => {
  // Get coins from useContext
  const { coins, setCoins } = useContext(CoinsContext);

  // Define useState variables
  const [loading, setLoading] = useState(false);

  // Rewards List
  const rewards = [
    { key: 'Fitness Shirt', value: 1000 },
    { key: '1-month Free Gym Membership', value: 50000 },
    { key: 'Protein Powder (500g)', value: 5000 },
    { key: 'Shaker Bottle', value: 10000 },
    { key: '1-Day Gym Pass', value: 10000 }
  ];

  const select_reward = (reward: any) => {
    Alert.alert(`${reward.key}`, 'Are you sure you want to purchase this reward?', [{ text: 'Yes', onPress: () => confirm_reward(reward.value) }, { text: 'No' }]);
  }

  const confirm_reward = async (value: number) => {
    setLoading(true);
    if (coins < value) {
      Alert.alert('Error', 'You do not have sufficient coins to purchase this!');
      setLoading(false);
      return;
    };

    const user = await supabase.auth.getUser();
    if (!user) {
      console.error('No such user!');
      return;
    };
    const uuid = user.data.user?.id;

    try {
      const { error:updateError } = await supabase.from('users').update({ 'coins': coins - value }).eq('id', uuid);
      if (updateError) {
        Alert.alert('Error updating coins: ', updateError.message);
      };
      setCoins(coins - value);
    } catch (error: any) {
      Alert.alert('Error updating coins: ', error.message);
    } finally {
      setLoading(false);
    };
  };

  const renderRewards = ({ item }) => {
    return (
      <TouchableOpacity style={styles.reward} onPress={() => select_reward(item)}>
        <Text>{item.key}</Text>
        <Text>{item.value} <FontAwesome5 name="coins" size={20} color="gold" /></Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <SharedHeader />
      <View style={styles.rewards_page}>
        <Text style={styles.rewards_header}>Available Rewards</Text>
        <FlatList
          data={rewards}
          renderItem={renderRewards}
          keyExtractor={item => item.key}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4FBFF'
  },
  coinsborder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10
  },
  text: {
    fontSize: 30
  },
  rewards_page: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20
  },
  rewards_header: {
    fontSize: 40,
    paddingBottom: StatusBar.currentHeight
  },
  reward: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: screenWidth * 0.9,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 10
  }
});

export default Rewards;