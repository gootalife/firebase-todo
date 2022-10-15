import { authAtom } from "atoms/atoms";
import { auth, UserOrNull } from "utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAtomValue } from "jotai";

authAtom.onMount = (setAtom) => {
    let resolvePromise: (value: UserOrNull) => void;
    const initialValue = new Promise<UserOrNull>((resolve) => {
        resolvePromise = resolve;
    });
    setAtom(initialValue);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            resolvePromise(user);
            setAtom(user);
        } else {
            resolvePromise(null);
            setAtom(null);
        }
    });
    return unsubscribe;
};

export const useAuth = () => {
    return useAtomValue(authAtom);
}