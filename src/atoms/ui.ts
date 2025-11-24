import {atom, useAtomValue, useSetAtom} from 'jotai';

// 任务列表抽屉开关状态
const taskDrawerOpenAtom = atom<boolean>(false);

export const useTaskDrawerOpen = () => useAtomValue(taskDrawerOpenAtom);
export const useSetTaskDrawerOpen = () => useSetAtom(taskDrawerOpenAtom);

// Model Generation抽屉开关状态
const modelGenerationDrawerOpenAtom = atom<boolean>(false);

export const useModelGenerationDrawerOpen = () => useAtomValue(modelGenerationDrawerOpenAtom);
export const useSetModelGenerationDrawerOpen = () => useSetAtom(modelGenerationDrawerOpenAtom);

// InputPanel 当前视图状态
const inputPanelViewAtom = atom<'source' | 'history'>('source');

export const useInputPanelView = () => useAtomValue(inputPanelViewAtom);
export const useSetInputPanelView = () => useSetAtom(inputPanelViewAtom);
