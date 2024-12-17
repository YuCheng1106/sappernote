import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import {
    fetchNotebookList,
    fetchNotebookDetail,
    fetchNotebookDetailByUuid,
    createNewNotebook,
    updateNotebooks,
    deleteNotebooks,
    updateNotebookSources, fetchNotebooksByUser
} from '../service/notebookService.ts';
import { RootState } from '../store';

import { resetNotebookInfo, setNotebookInfo, selectNotebookSources } from '../store/notebookSlice.ts';
import { NotebookReq, NotebookUpdateReq, NotebookParams, NotebookDeleteParams, NotebookSourceReq } from '../api/notebook';
import { AppDispatch } from '../store';

// 自定义 Hook 来处理 Notebook 相关的 dispatch 操作
export function useDispatchNotebook() {
    const dispatch = useDispatch<AppDispatch>();

    // 获取所有 Notebook
    const getAllNotebooks = useCallback(() => {
        return dispatch(fetchNotebooksByUser());
    }, [dispatch]);

    // 获取 Notebook 列表
    const getNotebookList = useCallback((params: NotebookParams) => {
        return dispatch(fetchNotebookList(params));
    }, [dispatch]);

    // 获取 Notebook 详情
    const getNotebookDetail = useCallback((notebookId: number) => {
        return dispatch(fetchNotebookDetail(notebookId));
    }, [dispatch]);

    const getNotebookDetailByUuid = useCallback((notebookUuid: string) => {
        return dispatch(fetchNotebookDetailByUuid(notebookUuid));
    }, [dispatch]);

    // 创建新的 Notebook
    const addNewNotebook = useCallback((notebookData: NotebookReq) => {
        return dispatch(createNewNotebook(notebookData));
    }, [dispatch]);

    // 更新 Notebook 信息
    const updateNotebookInfo = useCallback((notebookId: number, notebookData: NotebookUpdateReq) => {
        return dispatch(updateNotebooks({ notebookId, data: notebookData }));
    }, [dispatch]);

    // 删除 Notebook
    const removeNotebook = useCallback((deleteParams: NotebookDeleteParams) => {
        return dispatch(deleteNotebooks(deleteParams));
    }, [dispatch]);

    // 更新 Notebook 的来源
    const modifyNotebookSources = useCallback((notebookId: number, sourceData: NotebookSourceReq) => {
        return dispatch(updateNotebookSources({ notebookId, data: sourceData }));
    }, [dispatch]);


    const modifyNotebookSourcesSelect = useCallback((sourceIds: number[]) => {
        dispatch(selectNotebookSources(sourceIds));
    }, [dispatch]);


    // 设置部分 Notebook 信息（部分更新）
    const setNotebookPartialInfo = useCallback((notebookInfo: Partial<NotebookReq>) => {
        dispatch(setNotebookInfo(notebookInfo));
    }, [dispatch]);

    // 重置 Notebook 信息
    const resetNotebook = useCallback(() => {
        dispatch(resetNotebookInfo());
    }, [dispatch]);

    return {
        getAllNotebooks,
        getNotebookList,
        getNotebookDetail,
        getNotebookDetailByUuid,
        addNewNotebook,
        updateNotebookInfo,
        removeNotebook,
        modifyNotebookSources,
        modifyNotebookSourcesSelect,
        setNotebookPartialInfo,
        resetNotebook,
    };
}

// 创建一个类型化的 useSelector 钩子
export const useNotebookSelector: TypedUseSelectorHook<RootState> = useSelector;