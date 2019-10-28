import * as React from 'react';
import styles from './EventList.module.scss';
import { IEventListProps } from './IEventListProps';
import { escape, find } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';

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
                        <td>{item.StartDate}</td>
                        <td>{item.EndDate}</td>
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
        dialogMessage: `Der Termin wurde in deinem Kalender erstellt.`
      });
    })
    .catch((err) => {
      this.setState({
        hideDialog: false,
        dialogTitle: 'Error',
        dialogMessage: 'Termin konnte nicht erstellt werden. Bitte wende dich an deinen Administrator.'
      });
    });
  }
}

