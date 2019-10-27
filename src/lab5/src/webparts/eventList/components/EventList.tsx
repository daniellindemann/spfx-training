import * as React from 'react';
import styles from './EventList.module.scss';
import { IEventListProps } from './IEventListProps';
import { escape, find } from '@microsoft/sp-lodash-subset';

export default class EventList extends React.Component<IEventListProps, {}> {
  public render(): React.ReactElement<IEventListProps> {
    return (
      <div className={styles.eventList}>
        <div className={styles.container}>
          <div className={styles.row}>
            <table>
              <tbody>
                <tr>
                  <th>Event</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Join</th>
                </tr>
                {this.props.items &&
                  this.props.items.map(item => {
                    return (
                      <tr key='{item.ID}'>
                        <td>{item.Title}</td>
                        <td>{item.StartDate}</td>
                        <td>{item.EndDate}</td>
                        <td><a href={'/add/' + item.ID} onClick={ (e) => { e.preventDefault(); this.addToCalendar(item.ID); } }>join</a></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  public addToCalendar(itemId: number) {
    const item = find(this.props.items, { ID: itemId });
    this.props.eventsService.addEventToCalendar(item)
      .then((calendarEvent) => {
        console.log(calendarEvent);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
