import * as React from 'react';
import styles from './EventList.module.scss';
import { IEventListProps } from './IEventListProps';
import { escape, find } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface IEventListState {
  hideDialog: boolean;
  dialogTitle: string;
  dialogMessage: string;
}

export default class EventList extends React.Component<IEventListProps, IEventListState> {

  constructor(props) {
    super(props);

    this.state = {
      hideDialog: true,
      dialogTitle: null,
      dialogMessage: null
    };
  }

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
                      <tr key={item.ID}>
                        <td>{item.Title}</td>
                        <td>{format(new Date(item.StartDate as string), 'ccc, dd. MMMM yyyy hh:mm', { locale: de })}</td>
                        <td>{format(new Date(item.EndDate as string), 'ccc, dd. MMMM yyyy hh:mm', { locale: de })}</td>
                        <td><DefaultButton text="Join" href={'/add/' + item.ID} onClick={ (e) => { e.preventDefault(); this.addToCalendar(item.ID); } } /></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <Dialog hidden={this.state.hideDialog} onDismiss={this.closeDialog} dialogContentProps={{
              type: DialogType.largeHeader,
              title: this.state.dialogTitle,
              subText: this.state.dialogMessage
            }} modalProps={{isBlocking: false, containerClassName: 'ms-dialogMainOverride'}}>
              <DialogFooter>
                <PrimaryButton onClick={this.closeDialog} text="OK"/>
              </DialogFooter>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  public closeDialog = ():void => {
    this.setState({ hideDialog: true });
  }

  public addToCalendar(itemId: number) {
    const item = find(this.props.items, { ID: itemId });
    this.props.eventsService.addEventToCalendar(item)
    .then((calendarEvent) => {
      this.setState({
        hideDialog: false,
        dialogTitle: 'Neuer Termin erstellt',
        dialogMessage: `Termin '${calendarEvent.subject}' von ${format(new Date(calendarEvent.start.dateTime), 'ccc, dd. MMMM yyyy hh:mm', { locale: de })} bis ${format(new Date(calendarEvent.end.dateTime), 'ccc, dd. MMMM yyyy hh:mm', { locale: de })} wurde in deinem Kalender erstellt.`
      });
    })
    .catch((err) => {
      debugger;
      this.setState({
        hideDialog: false,
        dialogTitle: 'Error',
        dialogMessage: 'Termin konnte nicht erstellt werden. Bitte wende dich an deinen Administrator.'
      });
    });
  }
}

