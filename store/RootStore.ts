import { useContext } from 'react';
import { AuthStore, AuthStoreHydration } from './AuthStore';
import { GlobalStore } from './GlobalStore';
import { StoreContext } from './RootStoreContext';

export type RootStoreHydration = {
  authStore?: AuthStoreHydration;
  globalStore?: any;
};

export class RootStore {
  authStore: AuthStore;
  globalStore: GlobalStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.globalStore = new GlobalStore(this);
  }

  hydrate(hydrationData: RootStoreHydration) {
    const { authStore, globalStore } = hydrationData;

    if (authStore) {
      this.authStore.hydrate(authStore);
    }
    if (globalStore) {
      this.globalStore.hydrate(globalStore);
    }
  }
}

export const useRootStore: () => RootStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }

  return context;
}

