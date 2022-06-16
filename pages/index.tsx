import Head from 'next/head'
import { ToDo } from 'components/ToDo'
import { useAuth } from 'contexts/AuthProvider'
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
          <h1>ToDo List</h1>
          <ToDo></ToDo>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <Button variant="contained" onClick={async () => await login()}>
            Login with google
          </Button>
        </>
      )}
    </>
  )
}

export default Index
