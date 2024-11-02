import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    queryNoteSourceAll,
    queryNoteSourceDetail,
    queryNoteSourceList,
    createNoteSource,
    updateNoteSource,
    deleteNoteSource,
    updateNoteSourceNotebooks,
    NoteSourceReq,
    NoteSourceParams,
    NoteSourceDeleteParams,
    NoteSourceUpdateReq,
    NoteSourceNotebookReq,
} from '../api/notesource';

// Fetch all note sources
export const fetchAllNoteSources = createAsyncThunk(
    'noteSource/fetchAllNoteSources',
    async (_, { rejectWithValue }) => {
        try {
            return await queryNoteSourceAll();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch all note sources');
        }
    }
);

// Fetch note source detail
export const fetchNoteSourceDetail = createAsyncThunk(
    'noteSource/fetchNoteSourceDetail',
    async (noteSourceId: number, { rejectWithValue }) => {
        try {
            return await queryNoteSourceDetail(noteSourceId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch note source details');
        }
    }
);

// Fetch note source list (paginated)
export const fetchNoteSourceList = createAsyncThunk(
    'noteSource/fetchNoteSourceList',
    async (params: NoteSourceParams, { rejectWithValue }) => {
        try {
            return await queryNoteSourceList(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch note source list');
        }
    }
);

// Create a new note source
export const createNewNoteSource = createAsyncThunk(
    'noteSource/createNewNoteSource',
    async ({ notebookId, data }: { notebookId: number; data: NoteSourceReq }, { rejectWithValue }) => {
        try {
            return await createNoteSource({ notebookId, data });
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to create note source');
        }
    }
);

// Update note source
export const updateNoteSourceInfo = createAsyncThunk(
    'noteSource/updateNoteSourceInfo',
    async ({ noteSourceId, data }: { noteSourceId: number; data: NoteSourceUpdateReq }, { rejectWithValue }) => {
        try {
            await updateNoteSource(noteSourceId, data);
            return { ...data, id: noteSourceId };
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update note source');
        }
    }
);

// Update note source's related notebooks
export const updateNoteSourceNotebookRelations = createAsyncThunk(
    'noteSource/updateNoteSourceNotebookRelations',
    async ({ noteSourceId, data }: { noteSourceId: number; data: NoteSourceNotebookReq }, { rejectWithValue }) => {
        try {
            return await updateNoteSourceNotebooks(noteSourceId, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update note source notebooks');
        }
    }
);

// Delete note sources
export const deleteNoteSources = createAsyncThunk(
    'noteSource/deleteNoteSources',
    async (params: NoteSourceDeleteParams, { rejectWithValue }) => {
        try {
            await deleteNoteSource(params);
            return  params.pk;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to delete note sources');
        }
    }
);
