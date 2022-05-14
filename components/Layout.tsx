import { Header } from 'components/Header'
import { ReactNode } from 'react'
import Head from 'next/head'
import { Container } from '@mui/material'

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <Header />
      <Container>
        <main>{children}</main>
      </Container>
    </>
  )
}
