import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntApp, theme as antTheme } from 'antd';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from './contexts/ThemeContext';

const theme = {
  token: {
    colorPrimary: '#0d6efd',
    colorLink: '#0d6efd',
    borderRadius: 10,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
};

export default function App() {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider 
      theme={{
        ...theme,
        algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
      }}
    >
      <AntApp>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
