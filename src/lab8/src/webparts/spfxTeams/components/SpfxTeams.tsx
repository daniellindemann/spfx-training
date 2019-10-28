import * as React from 'react';
import styles from './SpfxTeams.module.scss';
import { ISpfxTeamsProps } from './ISpfxTeamsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class SpfxTeams extends React.Component<ISpfxTeamsProps, {}> {
  public render(): React.ReactElement<ISpfxTeamsProps> {
    return (
      <div className={ styles.spfxTeams }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
            <p className={ styles.description }>{escape(this.props.title)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
