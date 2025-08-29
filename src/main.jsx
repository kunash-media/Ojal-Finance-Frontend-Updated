import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DarkModeProvider } from './components/contextDarkMode/DarkModeContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from './components/Theme/theme.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <ThemeProvider theme={createAppTheme(false)}> {/* Initial theme */}
        <App />
      </ThemeProvider>
    </DarkModeProvider>
  </StrictMode>,
)
