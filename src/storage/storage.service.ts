import { Injectable, Logger } from '@nestjs/common';
import * as Keyv from 'keyv';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  storagesMap = new Map<string, Keyv>();

  constructor() {
    try {
      const uri = process.env[`STORAGE_URI`];
      if (!uri) {
        this.logger.warn(
          `STORAGE_URI is undefined, will use non persistent in-memory storage`,
        );
      }

      Object.keys(StorageNamespace).forEach((namespace) => {
        try {
          const keyv = new Keyv({
            uri,
            namespace,
          });
          keyv.on('error', (err) =>
            this.logger.error(`Connection Error for namespace ${namespace}`, err),
          );
          this.storagesMap.set(namespace, keyv);
          this.logger.debug(`Storage map set for namespace: ${namespace}`);
        } catch (err) {
          this.logger.error(`Failed to initialize storage for namespace ${namespace}`, err);
        }
      });
    } catch (err) {
      this.logger.error(`Unexpected error during StorageService initialization`, err);
    }
  }

  async get(key: string, namespace: StorageNamespace): Promise<Buffer> {
    try {
      const store = this.storagesMap.get(namespace);
      if (!store) {
        this.logger.error(`No storage found for namespace: ${namespace}`);
        throw new Error(`No storage found for namespace: ${namespace}`);
      }
      this.logger.debug(`Retrieved storage for "${key}" in ${namespace}`);
      return await store.get(key);
    } catch (err) {
      this.logger.error(`Error getting key "${key}" from ${namespace}`, err);
      throw err;
    }
  }

  async has(key: string, namespace: StorageNamespace): Promise<boolean> {
    try {
      const store = this.storagesMap.get(namespace);
      if (!store) {
        this.logger.error(`No storage found for namespace: ${namespace}`);
        throw new Error(`No storage found for namespace: ${namespace}`);
      }
      const value = await store.get(key);
      this.logger.debug(`Checked storage for "${key}" in ${namespace}`);
      return !!value;
    } catch (err) {
      this.logger.error(`Error checking existence of key "${key}" in ${namespace}`, err);
      throw err;
    }
  }

  async set(key: string, value: Buffer, namespace: StorageNamespace): Promise<true> {
    try {
      const store = this.storagesMap.get(namespace);
      if (!store) {
        this.logger.error(`No storage found for namespace: ${namespace}`);
        throw new Error(`No storage found for namespace: ${namespace}`);
      }
      await store.set(key, value);
      this.logger.debug(`Set storage for "${key}" in ${namespace}`);
      return true;
    } catch (err) {
      this.logger.error(`Error setting key "${key}" in ${namespace}`, err);
      throw err;
    }
  }
}

export enum StorageNamespace {
  SCENES = 'SCENES',
  ROOMS = 'ROOMS',
  FILES = 'FILES',
}
