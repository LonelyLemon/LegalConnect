import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
  return useSelector((state: { root: RootState }) => selector(state.root));
};
