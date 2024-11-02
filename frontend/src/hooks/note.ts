import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import {
    fetchAllNotes,
    fetchNoteList,
    fetchNoteDetail,
    createNewNote,
    updateNoteInfo,
    deleteNotes,
} from '../service/noteService.ts';
import { RootState } from '../store';

import { resetNoteInfo, setNoteInfo } from '../store/noteSlice.ts';
import { NoteReq, NoteUpdateReq, NoteParams, NoteDeleteParams} from '../api/note';
import { AppDispatch } from '../store';

// 自定义 Hook 来处理 Note 相关的 dispatch 操作
export function useDispatchNote() {
    const dispatch = useDispatch<AppDispatch>();

    // 获取所有 Note
    const getAllNotes = useCallback(() => {
        return dispatch(fetchAllNotes());
    }, [dispatch]);

    // 获取 Note 列表
    const getNoteList = useCallback((params: NoteParams) => {
        return dispatch(fetchNoteList(params));
    }, [dispatch]);

    // 获取 Note 详情
    const getNoteDetail = useCallback((noteId: number) => {
        return dispatch(fetchNoteDetail(noteId));
    }, [dispatch]);

    // 创建新的 Note
    const addNewNote = useCallback((notebookId: number, noteData: NoteReq) => {
        return dispatch(createNewNote({ notebookId: notebookId, data: noteData }));
    }, [dispatch]);

    // 更新 Note 信息
    const updateNote = useCallback((noteId: number, noteData: NoteUpdateReq) => {
        return dispatch(updateNoteInfo({ noteId, data: noteData }));
    }, [dispatch]);

    // 删除 Note
    const removeNote = useCallback((deleteParams: NoteDeleteParams) => {
        return dispatch(deleteNotes(deleteParams));
    }, [dispatch]);


    // 设置部分 Note 信息（部分更新）
    const setNotePartialInfo = useCallback((noteInfo: Partial<NoteReq>) => {
        dispatch(setNoteInfo(noteInfo));
    }, [dispatch]);


    // 重置 Note 信息
    const resetNote = useCallback(() => {
        dispatch(resetNoteInfo());
    }, [dispatch]);

    return {
        getAllNotes,
        getNoteList,
        getNoteDetail,
        addNewNote,
        updateNote,
        removeNote,
        setNotePartialInfo,
        resetNote,
    };
}

// 创建一个类型化的 useSelector 钩子
export const useNoteSelector: TypedUseSelectorHook<RootState> = useSelector;
