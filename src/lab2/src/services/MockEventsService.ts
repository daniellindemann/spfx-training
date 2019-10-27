import { IEventsService } from '../interfaces/IEventsService';
import { IEventItem } from '../interfaces/IEventItem';

export class MockEventsService implements IEventsService {

  private static Items: IEventItem[] = [
    { ID: 1, Title: 'Event 01', StartDate: '2019-10-28T11:03:24Z', EndDate: '2019-10-28T12:03:24Z' },
    { ID: 2, Title: 'Event 02', StartDate: '2019-11-02T15:47:06Z', EndDate: '2019-11-02T16:47:06Z' },
    { ID: 3, Title: 'Event 03', StartDate: '2019-10-29T09:00:00Z', EndDate: '2019-10-29T10:00:00Z' },
    { ID: 4, Title: 'An event with an very long long long long and special title', StartDate: '2019-11-05T18:24:17Z', EndDate: '2019-11-05T19:24:17Z' },
    { ID: 5, Title: 'Global Microsoft 365 Developer Bootcamp', StartDate: '2019-10-29T10:00:00Z', EndDate: '2019-10-29T17:00:00Z' }
  ];

  public get(): Promise<IEventItem[]> {
    return Promise.resolve(MockEventsService.Items);
  }
}
