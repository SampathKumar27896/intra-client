    // app/providers.tsx (Client Component)
    'use client';
    import { Provider } from 'react-redux';
    import { store } from '../store'; // Adjust path as needed

    export function StoreProvider({ children }: { children: React.ReactNode }) {
      return <Provider store={store}>{children}</Provider>;
    }