import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { firebaseAdmin } from 'utils/firebaseAdmin'
import { path } from 'utils/path'

const User = () => {
  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      <h1>User</h1>
    </>
  )
}

export default User

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const accessToken = req.cookies['accessToken']
  try {
    await firebaseAdmin.auth().verifyIdToken(accessToken)
    return { props: {} }
  } catch {
    return {
      redirect: {
        destination: path.home,
        permanent: false
      }
    }
  }
}
