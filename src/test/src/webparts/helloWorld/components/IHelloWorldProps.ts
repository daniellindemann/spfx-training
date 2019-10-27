import { IEventItem } from '../../../interfaces/IEventItem';
import { IEventService } from '../../../interfaces/IEventService';

export interface IHelloWorldProps {
  // description: string;
  items: IEventItem[];
  eventsService: IEventService;
}
