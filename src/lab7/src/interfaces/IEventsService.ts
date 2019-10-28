import { IEventItem } from './IEventItem';

export interface IEventsService {
  get(): Promise<IEventItem[]>;
  addEventToCalendar(event: IEventItem): Promise<any>;
}
