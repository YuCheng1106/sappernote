import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    queryNoteAll,
    queryNoteDetail,
    queryNoteList,
    createNote,
    updateNote,
    deleteNote,
    NoteReq,
    NoteParams,
    NoteDeleteParams,
    NoteUpdateReq,
} from '../api/note';

// 获取所有笔记
export const fetchAllNotes = createAsyncThunk(
    'note/fetchAllNotes',
    async (_, { rejectWithValue }) => {
        try {
            return await queryNoteAll();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch all notes');
        }
    }
);

// 获取笔记详情
export const fetchNoteDetail = createAsyncThunk(
    'note/fetchNoteDetail',
    async (noteId: number, { rejectWithValue }) => {
        try {
            return await queryNoteDetail(noteId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch note details');
        }
    }
);

// 获取笔记列表（分页）
export const fetchNoteList = createAsyncThunk(
    'note/fetchNoteList',
    async (params: NoteParams, { rejectWithValue }) => {
        try {
            return await queryNoteList(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch note list');
        }
    }
);

// 创建笔记
export const createNewNote = createAsyncThunk(
    'note/createNewNote',
    async ({ notebookId, data }: { notebookId: number; data: NoteReq }, { rejectWithValue }) => {
        try {
            return await createNote({ notebookId, data }); // 这里传递对象参数
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to create note');
        }
    }
);


// 更新笔记
export const updateNoteInfo = createAsyncThunk(
    'note/updateNoteInfo',
    async ({ noteId, data }: { noteId: number; data: NoteUpdateReq }, { rejectWithValue }) => {
        try {
            await updateNote(noteId, data);
            return {...data, id: noteId};
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update note');
        }
    }
);



// 批量删除笔记
export const deleteNotes = createAsyncThunk(
    'note/deleteNotes',
    async (params: NoteDeleteParams, { rejectWithValue }) => {
        try {
            return await deleteNote(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to delete notes');
        }
    }
);
