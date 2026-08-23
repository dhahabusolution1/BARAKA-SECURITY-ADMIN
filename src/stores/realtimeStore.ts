import { create } from 'zustand';

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected';

type RealtimeState = {
  status: RealtimeStatus;
  setStatus: (status: RealtimeStatus) => void;
};

export const useRealtimeStore = create<RealtimeState>((set) => ({
  status: 'connecting',
  setStatus: (status) => set({ status }),
}));
