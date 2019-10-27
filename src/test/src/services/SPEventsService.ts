import { IEventService } from '../interfaces/IEventService';
import { IEventItem } from '../interfaces/IEventItem';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IEventServiceOptions } from '../interfaces/IEventServiceOptions';

export class SPEventsService implements IEventService {
  constructor(private context: WebPartContext, private options: IEventServiceOptions) {}

  public get(): Promise<IEventItem[]> {
    const selects = [
      'ID',
      'Title',
      'StartDate',
      'EndDate'
    ];
    const filters = [
      `EndDate ge datetime'${new Date().toISOString()}'`
    ];
    const orders = [
      `StartDate asc`
    ];

    return new Promise<IEventItem[]>((resolve, reject) => {
      this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${this.options.listname}')/items?$select=${selects.join()}&$filter=${filters.join(' and ')}&$orderBy=${orders.join(',')}`, SPHttpClient.configurations.v1)
        .then((res: SPHttpClientResponse) => {
          return res.json();
        })
        .then((json) => {
          if(json.error) {
            reject(json.error);
            return;
          }

          resolve(json.value as IEventItem[]);
        });
    });
  }

  public addEventToCalendar(event: IEventItem): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      debugger;
      this.context.msGraphClientFactory.getClient()
        .then((client) => {
          client.api('me/events')
            .version('v1.0')
            .post({
              subject: event.Title,
              start: {
                datetime: event.StartDate instanceof Date ? (event.StartDate as Date).toISOString() : event.StartDate,
                timezone: 'UTC'
              },
              end: {
                datetime: event.EndDate instanceof Date ? (event.EndDate as Date).toISOString() : event.EndDate,
                timezone: 'UTC'
              }
            })
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        });
    });
  }
}
