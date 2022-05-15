import Head from 'next/head'
import { ToDo } from 'components/ToDo'
import { useAuth } from 'components/AuthProvider'
import { Button } from '@mui/material'

const Index = () => {
  const { currentUser, login } = useAuth()

  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      {currentUser ? (
        <>
          <h1>ToDoApp</h1>
          <ToDo></ToDo>
        </>
      ) : (
        <>
          <h1>ログイン</h1>
          <Button variant="contained" onClick={async () => await login()}>
            Login with google
          </Button>
        </>
      )}
    </>
  )
}

export default Index
