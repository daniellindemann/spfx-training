import { IEventItem } from './IEventItem';

export interface IEventService {
  get(): Promise<IEventItem[]>;
  addEventToCalendar(event: IEventItem): Promise<any>;
}


