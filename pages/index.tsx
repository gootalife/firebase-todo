import Head from 'next/head'
import { ToDo } from 'components/ToDo'

const Index = () => {
  return (
    <>
      <Head>
        <title>ToDoApp</title>
      </Head>
      <h1>ToDoApp</h1>
      <ToDo></ToDo>
    </>
  )
}

export default Index
