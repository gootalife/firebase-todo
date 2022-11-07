import { Twitter } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useAuth } from 'hooks/authHook'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { signInWithTwitter } from 'utils/firebase'
import { firebaseAdmin } from 'utils/firebaseAdmin'
import { path } from 'utils/path'

const Login = () => {
  const user = useAuth()
  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      <h1>Login</h1>
      <Button variant="contained" onClick={signInWithTwitter} startIcon={<Twitter />}>
        Sign in with Twitter
      </Button>
    </>
  )
}

export default Login

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const accessToken = req.cookies['accessToken']
  try {
    await firebaseAdmin.auth().verifyIdToken(accessToken)
    return {
      redirect: {
        destination: path.home,
        permanent: false
      }
    }
  } catch {}
  return {
    props: {}
  }
}
