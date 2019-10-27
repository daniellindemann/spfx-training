import { IEventsService } from '../interfaces/IEventsService';
import { IEventItem } from '../interfaces/IEventItem';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IEventServiceOptions } from '../interfaces/IEventServiceOptions';

export class SPEventsService implements IEventsService {
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
}
