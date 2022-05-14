import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { auth } from 'utils/firebase'
import { User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/dist/client/router'
import { path } from 'utils/path'
import { CircularProgress, Grid } from '@mui/material'

// 共用する情報の定義
type AuthContextProps = {
  currentUser: User | null | undefined
  login: () => Promise<void>
  logout: () => Promise<void>
}

// 初期値の定義
const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  login: async () => {},
  logout: async () => {}
})

// ログイン状態を確認できるHook
export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const ignorePaths = [path.home, path.login]

  const login = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await auth.signOut()
    router.push(path.home)
  }

  // ログイン状態が変わったら通知
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
  }, [])

  const value = {
    currentUser,
    login,
    logout
  }

  // ロード画面を表示
  if (loading) {
    return (
      <>
        <Grid container alignContent="center" justifyContent="center">
          <CircularProgress color="inherit" />
        </Grid>
      </>
    )
  }

  // ログインしていないならトップページへリダイレクトさせる
  if (!currentUser && !ignorePaths.includes(router.pathname)) {
    router.push(path.home)
  }

  // ログイン状態なら子を描画する
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  )
}
