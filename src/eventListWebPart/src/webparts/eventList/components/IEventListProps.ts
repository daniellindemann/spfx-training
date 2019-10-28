import { IEventItem } from '../../../interfaces/IEventItem';
import { IEventsService } from '../../../interfaces/IEventsService';

export interface IEventListProps {
  description: string;
  items: IEventItem[];
  eventsService: IEventsService;
}
