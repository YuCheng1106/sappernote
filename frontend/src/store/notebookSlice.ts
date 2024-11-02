import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllNotebooks,
    fetchNotebooksByUser,
    fetchNotebookDetail,
    fetchNotebookList,
    createNewNotebook,
    updateNotebooks,
    deleteNotebooks,
    updateNotebookSources, fetchNotebookDetailByUuid
} from '../service/notebookService';
import { NotebookRes, NotebookListRes } from '../api/notebook';
import {createNewNote, deleteNotes, updateNoteInfo} from "../service/noteService.ts";
import {NoteRes} from "../api/note.ts";
import {createNewNoteSource, deleteNoteSources} from "../service/notesourceService.ts";
import {NoteSourceRes} from "../api/notesource.ts";

// Notebook State interface
export interface NotebookState {
    notebooks: NotebookRes[];
    notebookDetails: NotebookRes | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    total: number;
    selectSource: number[]
}

// Initial state
const initialState: NotebookState = {
    notebooks: [],
    notebookDetails: null,
    status: 'idle',
    error: null,
    total: 0,
    selectSource: []
};

// Notebook slice
const notebookSlice = createSlice({
    name: 'notebook',
    initialState,
    reducers: {
        // Reset notebook information
        resetNotebookInfo: (state) => {
            state.notebooks = [];
            state.selectSource = [];
            state.notebookDetails = null;
            state.status = 'idle';
            state.error = null;
            state.total = 0;
        },
        // Set partial notebook information
        setNotebookInfo: (state, action: PayloadAction<Partial<NotebookRes>>) => {
            if (state.notebookDetails) {
                state.notebookDetails = { ...state.notebookDetails, ...action.payload };
            }
        },
        selectNotebookSources: (state, action: PayloadAction<number[]>) => {
            state.selectSource = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch all notebooks
        builder
            .addCase(fetchAllNotebooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllNotebooks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notebooks = action.payload;
            })
            .addCase(fetchAllNotebooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch notebooks by user
        builder
            .addCase(fetchNotebooksByUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotebooksByUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notebooks = action.payload;
            })
            .addCase(fetchNotebooksByUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch notebook list (paginated)
        builder
            .addCase(fetchNotebookList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotebookList.fulfilled, (state, action: PayloadAction<NotebookListRes>) => {
                state.status = 'succeeded';
                state.notebooks = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(fetchNotebookList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch notebook details
        builder
            .addCase(fetchNotebookDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotebookDetail.fulfilled, (state, action: PayloadAction<NotebookRes>) => {
                state.status = 'succeeded';
                state.notebookDetails = action.payload;
            })
            .addCase(fetchNotebookDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch notebook details
        builder
            .addCase(fetchNotebookDetailByUuid.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotebookDetailByUuid.fulfilled, (state, action: PayloadAction<NotebookRes>) => {
                state.status = 'succeeded';
                state.notebookDetails = action.payload;
            })
            .addCase(fetchNotebookDetailByUuid.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Create a new notebook
        builder
            .addCase(createNewNotebook.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNewNotebook.fulfilled, (state, action: PayloadAction<NotebookRes>) => {
                state.status = 'succeeded';
                state.notebooks.push(action.payload)
            })
            .addCase(createNewNotebook.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(createNewNoteSource.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNewNoteSource.fulfilled, (state, action: PayloadAction<NoteSourceRes>) => {
                state.status = 'succeeded';
                if(state && state.notebookDetails && state.notebookDetails.source)
                    state.notebookDetails.source.push(action.payload);
            })
            .addCase(createNewNoteSource.rejected, (state, action) => {
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
                state?.notebookDetails?.notes?.push(action.payload);
            })
            .addCase(createNewNote.rejected, (state, action) => {
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
                if(state && state.notebookDetails && state.notebookDetails.notes)
                    state.notebookDetails.notes = state?.notebookDetails?.notes.filter((note) => !action.payload.includes(note.id));
            })
            .addCase(deleteNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Delete sources
        builder
            .addCase(deleteNoteSources.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteNoteSources.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if(state && state.notebookDetails && state.notebookDetails.source)
                    state.notebookDetails.source = state?.notebookDetails?.source.filter((source) => !action.payload.includes(source.id));
            })
            .addCase(deleteNoteSources.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        builder
            .addCase(updateNoteInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateNoteInfo.fulfilled, (state, action: PayloadAction<NoteRes>) => {
                state.status = 'succeeded';
                if(state && state.notebookDetails && state.notebookDetails.notes){
                    const index = state.notebookDetails.notes.findIndex((note) => note.id === action.payload.id);
                    if (index !== -1) {
                        state.notebookDetails.notes[index] = action.payload;
                    }
                }
            })
            .addCase(updateNoteInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Update notebook information
        builder
            .addCase(updateNotebooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateNotebooks.fulfilled, (state, action: PayloadAction<NotebookRes>) => {
                state.status = 'succeeded';
                const index = state.notebooks.findIndex((notebook) => notebook.id === action.payload.id);
                if (index !== -1) {
                    state.notebooks[index] = action.payload;
                }
            })
            .addCase(updateNotebooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Delete notebooks
        builder
            .addCase(deleteNotebooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteNotebooks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notebooks = state.notebooks.filter((notebook) => !action.payload.includes(notebook.id));
            })
            .addCase(deleteNotebooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Update notebook sources
        builder
            .addCase(updateNotebookSources.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateNotebookSources.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (state.notebookDetails) {
                    state.notebookDetails.source = action.payload.source;
                }
            })
            .addCase(updateNotebookSources.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export actions
export const { resetNotebookInfo, setNotebookInfo, selectNotebookSources} = notebookSlice.actions;

// Export reducer
export default notebookSlice.reducer;
