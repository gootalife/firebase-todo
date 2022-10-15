import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { auth } from 'utils/firebase'
import { useRouter } from 'next/dist/client/router'
import { path } from 'utils/path'
import { CircularProgress, Grid } from '@mui/material'
import { authAtom } from 'atoms/atoms'
import { useAtom } from 'jotai'

// 初期値の定義
const AuthContext = createContext({})

// ログイン状態を確認できるHook
export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useAtom(authAtom)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const ignorePaths = [path.home, path.login]

  // ログイン状態が変わったら通知
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
  })

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
      <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
    </>
  )
}
