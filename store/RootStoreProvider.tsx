import detect from '@/utils/detect';
import { enableStaticRendering } from 'mobx-react';
import { ReactNode } from 'react';
import { RootStore, RootStoreHydration } from './RootStore';
import { StoreContext } from './RootStoreContext';

enableStaticRendering(detect.isNodeJS);

let store: RootStore;

function initializeStore(initialData?: RootStoreHydration): RootStore {
    const _store = store ?? new RootStore();

    if (initialData) {
        _store.hydrate(initialData);
    }
    // For SSG and SSR always create a new store
    if (detect.isNodeJS) return _store;
    // Create the store once in the client
    if (!store) store = _store;

    return _store;
}

export function RootStoreProvider({
    children,
    hydrationData
}: {
    children: ReactNode;
    hydrationData?: RootStoreHydration;
}) {
    const store = initializeStore(hydrationData);

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
}
