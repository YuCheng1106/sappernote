import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllNotes,
    fetchNoteList,
    fetchNoteDetail,
    createNewNote,
    updateNoteInfo,
    deleteNotes,
} from '../service/noteService';
import { NoteRes, NoteListRes } from '../api/note';

// Note State interface
export interface NoteState {
    notes: NoteRes[];
    noteDetails: NoteRes | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    total: number;
}

// Initial state
const initialState: NoteState = {
    notes: [],
    noteDetails: null,
    status: 'idle',
    error: null,
    total: 0,
};

// Note slice
const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        // Reset note information
        resetNoteInfo: (state) => {
            state.notes = [];
            state.noteDetails = null;
            state.status = 'idle';
            state.error = null;
            state.total = 0;
        },
        // Set partial note information
        setNoteInfo: (state, action: PayloadAction<Partial<NoteRes>>) => {
            if (state.noteDetails) {
                state.noteDetails = { ...state.noteDetails, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch all notes
        builder
            .addCase(fetchAllNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notes = action.payload;
            })
            .addCase(fetchAllNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch note list (paginated)
        builder
            .addCase(fetchNoteList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNoteList.fulfilled, (state, action: PayloadAction<NoteListRes>) => {
                state.status = 'succeeded';
                state.notes = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchNoteList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch note details
        builder
            .addCase(fetchNoteDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNoteDetail.fulfilled, (state, action: PayloadAction<NoteRes>) => {
                state.status = 'succeeded';
                state.noteDetails = action.payload;
            })
            .addCase(fetchNoteDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Create a new note
        builder
            .addCase(createNewNote.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNewNote.fulfilled, (state, action: PayloadAction<NoteRes>) => {
                state.status = 'succeeded';
                state.notes.push(action.payload);
            })
            .addCase(createNewNote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Update note information
        builder
            .addCase(updateNoteInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateNoteInfo.fulfilled, (state, action: PayloadAction<NoteRes>) => {
                state.status = 'succeeded';
                const index = state.notes.findIndex((note) => note.id === action.payload.id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            })
            .addCase(updateNoteInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Delete notes
        builder
            .addCase(deleteNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notes = state.notes.filter((note) => !action.payload.includes(note.id));
            })
            .addCase(deleteNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

    },
});

// Export actions
export const { resetNoteInfo, setNoteInfo } = noteSlice.actions;

// Export reducer
export default noteSlice.reducer;
