import { supabase } from './supabaseClient';

/**
 * Save a parsed CV to the user's profile.
 * @param {string} userId - The Supabase Auth User ID.
 * @param {string} name - A descriptive name for the saved CV.
 * @param {object} cvData - The parsed CV data object.
 * @returns {Promise<object>} - Returns the inserted record or throws an error.
 */
export async function saveResume(userId, name, cvData) {
    if (!userId) throw new Error("User must be logged in to save a resume.");

    const { data, error } = await supabase
        .from('user_resumes')
        .insert([
            { user_id: userId, name, cv_data: cvData }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Fetch all saved resumes for a specific user.
 * @param {string} userId - The Supabase Auth User ID.
 * @returns {Promise<Array>} - Returns an array of saved resume records.
 */
export async function getUserResumes(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from('user_resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Delete a specific saved resume.
 * @param {string} resumeId - The UUID of the resume record.
 * @returns {Promise<void>}
 */
export async function deleteResume(resumeId) {
    const { error } = await supabase
        .from('user_resumes')
        .delete()
        .eq('id', resumeId);

    if (error) throw error;
}
