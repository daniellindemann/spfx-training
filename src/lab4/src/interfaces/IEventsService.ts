import { IEventItem } from './IEventItem';

export interface IEventsService {
  get(): Promise<IEventItem[]>;
}


