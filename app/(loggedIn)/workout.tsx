import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { searchExercises } from './ExerciseService';

export default function ExercisesComponent() {
    const [search, setSearch] = useState('');
    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        const { data, error } = await searchExercises(search);
        if (error) {
            setError(error);
        } else {
            setExercises(data);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={search}
                onChangeText={setSearch}
                placeholder="Search exercises"
            />
            <Button title="Search" onPress={handleSearch} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text>{item.category}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

