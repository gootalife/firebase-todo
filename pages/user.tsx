import Head from 'next/head'
import { useAuth } from 'contexts/AuthProvider'

const User = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      {currentUser && (
        <>
          <h1>User</h1>
        </>
      )}
    </>
  )
}

export default User
