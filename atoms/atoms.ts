import { atom } from 'jotai'
import { UserOrNull } from 'utils/firebase';

export const authAtom = atom<Promise<UserOrNull> | UserOrNull>(null);