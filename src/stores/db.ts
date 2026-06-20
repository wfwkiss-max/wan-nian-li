import Dexie, { type EntityTable } from 'dexie';
import type { Schedule } from '../core/types';

const db = new Dexie('WanNianLiDB') as Dexie & {
  schedules: EntityTable<Schedule, 'id'>;
};

db.version(1).stores({
  schedules: 'id, date, type, createdAt',
});

export { db };
