import Head from 'next/head'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { path } from 'utils/path'
import { Edit, Login } from '@mui/icons-material'
import { useAuth } from 'hooks/authHook'

const Index = () => {
  const user = useAuth()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      <h1>Wellcome</h1>
      {user ? (
        <Button
          variant="contained"
          onClick={() => {
            router.push(path.todo)
          }}
          startIcon={<Edit />}
        >
          Edit ToDo
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => {
            router.push(path.login)
          }}
          startIcon={<Login />}
        >
          Login
        </Button>
      )}
    </>
  )
}

export default Index
