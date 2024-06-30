// ExerciseService.js
import { supabase } from '../../config/supabaseClient.js';

export async function searchExercises(searchTerm) {
    try {
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .ilike('name', `%${searchTerm}%`); // Case-insensitive partial match

        if (error) {
            console.error('Error fetching exercises:', error);
            return { error };
        }

        return { data };
    } catch (err) {
        console.error('Unexpected error in searchExercises:', err);
        return { error: err.message };
    }
}
