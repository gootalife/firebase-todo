import Head from 'next/head'
import { authAtom } from 'atoms/atoms'
import { useAtom } from 'jotai'

const User = () => {
  const [currentUser] = useAtom(authAtom)
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
