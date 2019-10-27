import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape, find } from '@microsoft/sp-lodash-subset';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Log } from '@microsoft/sp-core-library';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface IHelloWorldWebState {
  hideDialog: boolean;
  dialogTitle: string;
  dialogMessage: string;
}

export default class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldWebState> {

  constructor(props) {
    super(props);

    this.state = {
      hideDialog: true,
      dialogTitle: null,
      dialogMessage: null
    };
  }

  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
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
                {
                  this.props.items && this.props.items.map(item => {
                    return <tr key="{item.ID}">
                      <td>{item.Title}</td>
                      <td>{item.StartDate}</td>
                      <td>{item.EndDate}</td>
                      <td><a href={'/add/' + item.ID} onClick={ (e) => { e.preventDefault(); this.addToCalendar(item.ID); } }>join</a></td>
                    </tr>;
                  })
                }
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

  public closeDialog= ():void => {
    this.setState({ hideDialog: true });
  }

  public addToCalendar(itemId: number) {
    const item = find(this.props.items, { ID: itemId });
    this.props.eventsService.addEventToCalendar(item)
      .then((calendarEvent) => {
        debugger;
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
