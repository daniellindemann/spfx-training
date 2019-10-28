import * as React from 'react';
import styles from './EventList.module.scss';
import { IEventListProps } from './IEventListProps';
import { escape } from '@microsoft/sp-lodash-subset';

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
                </tr>
                {this.props.items &&
                  this.props.items.map(item => {
                    return (
                      <tr key={item.ID}>
                        <td>{item.Title}</td>
                        <td>{item.StartDate}</td>
                        <td>{item.EndDate}</td>
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
}
