import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllNoteSources,
    fetchNoteSourceList,
    fetchNoteSourceDetail,
    createNewNoteSource,
    updateNoteSourceInfo,
    deleteNoteSources,
} from '../service/notesourceService';
import { NoteSourceRes, NoteSourceListRes } from '../api/notesource';

// Note Source State interface
export interface NoteSourceState {
    noteSources: NoteSourceRes[];
    noteSourceDetails: NoteSourceRes | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    total: number;
}

// Initial state
const initialState: NoteSourceState = {
    noteSources: [],
    noteSourceDetails: null,
    status: 'idle',
    error: null,
    total: 0,
};

// Note Source slice
const noteSourceSlice = createSlice({
    name: 'noteSource',
    initialState,
    reducers: {
        // Reset note source information
        resetNoteSourceInfo: (state) => {
            state.noteSources = [];
            state.noteSourceDetails = null;
            state.status = 'idle';
            state.error = null;
            state.total = 0;
        },
        // Set partial note source information
        setNoteSourceInfo: (state, action: PayloadAction<Partial<NoteSourceRes>>) => {
            if (state.noteSourceDetails) {
                state.noteSourceDetails = { ...state.noteSourceDetails, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch all note sources
        builder
            .addCase(fetchAllNoteSources.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllNoteSources.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.noteSources = action.payload;
            })
            .addCase(fetchAllNoteSources.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch note source list (paginated)
        builder
            .addCase(fetchNoteSourceList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNoteSourceList.fulfilled, (state, action: PayloadAction<NoteSourceListRes>) => {
                state.status = 'succeeded';
                state.noteSources = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchNoteSourceList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch note source details
        builder
            .addCase(fetchNoteSourceDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNoteSourceDetail.fulfilled, (state, action: PayloadAction<NoteSourceRes>) => {
                state.status = 'succeeded';
                state.noteSourceDetails = action.payload;
            })
            .addCase(fetchNoteSourceDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Create a new note source
        builder
            .addCase(createNewNoteSource.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNewNoteSource.fulfilled, (state, action: PayloadAction<NoteSourceRes>) => {
                state.status = 'succeeded';
                state.noteSources.push(action.payload);
            })
            .addCase(createNewNoteSource.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Update note source information
        builder
            .addCase(updateNoteSourceInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateNoteSourceInfo.fulfilled, (state, action: PayloadAction<NoteSourceRes>) => {
                state.status = 'succeeded';
                const index = state.noteSources.findIndex((source) => source.id === action.payload.id);
                if (index !== -1) {
                    state.noteSources[index] = action.payload;
                }
            })
            .addCase(updateNoteSourceInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Delete note sources
        builder
            .addCase(deleteNoteSources.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteNoteSources.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.noteSources = state.noteSources.filter((source) => !action.payload.includes(source.id));
            })
            .addCase(deleteNoteSources.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

    },
});

// Export actions
export const { resetNoteSourceInfo, setNoteSourceInfo } = noteSourceSlice.actions;

// Export reducer
export default noteSourceSlice.reducer;
