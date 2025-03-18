import { StateCreator, create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type StorageValue<T> = {
    state: T;
    version?: number;
};

export interface CreateStoreOptions<T> {
    storageKey: string;
    version?: number;
    onRehydrateStorage?: (state?: T) => ((state?: T) => void) | void;
    migrate?: (persistedState: unknown, version: number) => T | Promise<T>;
}

export function createPersistedStore<T extends object>(
    stateCreator: StateCreator<T>,
    options: CreateStoreOptions<T>
) {
    const persistConfig: PersistOptions<T> = {
        name: options.storageKey,
        version: options.version,
        onRehydrateStorage: options.onRehydrateStorage,
        migrate: options.migrate,
    };

    return create<T>()(
        persist(
            stateCreator,
            persistConfig
        )
    );
} 