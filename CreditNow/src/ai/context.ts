import { AsyncLocalStorage } from 'async_hooks';

export const authContext = new AsyncLocalStorage<{ token: string | null }>();

export const getAuthToken = () => {
    const store = authContext.getStore();
    return store?.token || null;
};
