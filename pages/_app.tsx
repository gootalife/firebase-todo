import type { AppProps } from 'next/app'
import { Layout } from 'components/Layout'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { AuthProvider } from 'components/AuthProvider'

const theme = createTheme({
  palette: {
    mode: 'light'
  }
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
