import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          colorLink: '#4f46e5',
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Layout: {
            siderBg: '#1e1b4b',
            triggerBg: '#312e81',
          },
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(99, 102, 241, 0.3)',
            darkItemHoverBg: 'rgba(255,255,255,0.06)',
            darkItemColor: '#c7d2fe',
            darkItemSelectedColor: '#fff',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
