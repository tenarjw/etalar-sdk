// redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '.';

// Typowany dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Typowany selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
