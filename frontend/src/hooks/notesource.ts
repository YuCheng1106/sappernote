import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import {
    fetchAllNoteSources,
    fetchNoteSourceList,
    fetchNoteSourceDetail,
    createNewNoteSource,
    updateNoteSourceInfo,
    deleteNoteSources,
    updateNoteSourceNotebookRelations,
} from '../service/notesourceService';
import { RootState } from '../store';

import { resetNoteSourceInfo, setNoteSourceInfo } from '../store/notesourceSlice';
import { NoteSourceReq, NoteSourceUpdateReq, NoteSourceParams, NoteSourceDeleteParams, NoteSourceNotebookReq } from '../api/notesource';
import { AppDispatch } from '../store';

// Custom hook for handling Note Source dispatch operations
export function useDispatchNoteSource() {
    const dispatch = useDispatch<AppDispatch>();

    // Fetch all note sources
    const getAllNoteSources = useCallback(() => {
        return dispatch(fetchAllNoteSources());
    }, [dispatch]);

    // Fetch paginated list of note sources
    const getNoteSourceList = useCallback((params: NoteSourceParams) => {
        return dispatch(fetchNoteSourceList(params));
    }, [dispatch]);

    // Fetch detail of a specific note source
    const getNoteSourceDetail = useCallback((noteSourceId: number) => {
        return dispatch(fetchNoteSourceDetail(noteSourceId));
    }, [dispatch]);

    // Create a new note source
    const addNewNoteSource = useCallback((notebookId: number, noteSourceData: NoteSourceReq) => {
        return dispatch(createNewNoteSource({ notebookId: notebookId, data: noteSourceData }));
    }, [dispatch]);

    // Update a note source
    const updateNoteSource = useCallback((noteSourceId: number, noteSourceData: NoteSourceUpdateReq) => {
        return dispatch(updateNoteSourceInfo({ noteSourceId, data: noteSourceData }));
    }, [dispatch]);

    // Delete note sources
    const removeNoteSources = useCallback((deleteParams: NoteSourceDeleteParams) => {
        return dispatch(deleteNoteSources(deleteParams));
    }, [dispatch]);

    // Update note source's associated notebooks
    const updateNoteSourceNotebooks = useCallback((noteSourceId: number, notebookData: NoteSourceNotebookReq) => {
        return dispatch(updateNoteSourceNotebookRelations({ noteSourceId, data: notebookData }));
    }, [dispatch]);

    // Set partial note source information
    const setNoteSourcePartialInfo = useCallback((noteSourceInfo: Partial<NoteSourceReq>) => {
        dispatch(setNoteSourceInfo(noteSourceInfo));
    }, [dispatch]);

    // Reset note source information
    const resetNoteSource = useCallback(() => {
        dispatch(resetNoteSourceInfo());
    }, [dispatch]);

    return {
        getAllNoteSources,
        getNoteSourceList,
        getNoteSourceDetail,
        addNewNoteSource,
        updateNoteSource,
        removeNoteSources,
        updateNoteSourceNotebooks,
        setNoteSourcePartialInfo,
        resetNoteSource,
    };
}

// Typed useSelector hook for note source state
export const useNoteSourceSelector: TypedUseSelectorHook<RootState> = useSelector;
