import { Text, TouchableOpacity, View, StyleSheet, StatusBar, Alert } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const Register_allergies = () => {

    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    const data = [
        { key: '1', value: 'Milk' },
        { key: '2', value: 'Eggs' },
        { key: '3', value: 'Fish' },
        { key: '4', value: 'Crustacean' },
        { key: '5', value: 'Tree Nuts' },
        { key: '6', value: 'Peanuts' },
        { key: '7', value: 'Wheat' },
        { key: '8', value: 'Soybeans' },
        { key: '9', value: 'Sesame' }
    ];

    const updateDetails = async () => {
        setLoading(true);
        const user = await supabase.auth.getUser();
        const uuid = user.data.user?.id;

        try {
            if (!user) {
                Alert.alert('Error', 'No user logged in!');
                setLoading(false);
                return;
            };

            const { error: updateError } = await supabase.from('users').update({
                allergies: selected
            }).eq('id', uuid);

            if (updateError) {
                Alert.alert('Error occured: ', updateError.message);
                return;
            };
        } catch (error) {
            console.error('Error occured: ', error);
            setLoading(false);
            return;
        } finally {
            setLoading(false);
            router.push('registration_mealtimes');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { router.push('registrationdetails') }} style={{ paddingHorizontal: 20 }}>
                <Feather name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <View style={styles.multipleselectlist}>
                <Text style={{ alignSelf: 'center', paddingBottom: 10 }}>Do you have any allergies?</Text>
                <MultipleSelectList
                    setSelected={(value: any) => setSelected(value)}
                    data={data}
                    save="value"
                    label="Allergies"
                    placeholder='Allergies'
                // search = {false}
                />
                <TouchableOpacity style={styles.button} onPress={updateDetails}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#E4FBFF'
    },
    multipleselectlist: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default Register_allergies;