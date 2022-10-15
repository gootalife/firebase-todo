import { Header } from 'components/Header'
import { ReactNode } from 'react'
import { Container } from '@mui/material'

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <Container>
        <main>{children}</main>
      </Container>
    </>
  )
}
