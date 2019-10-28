import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Log, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'EventListWebPartStrings';
import EventList from './components/EventList';
import { IEventListProps } from './components/IEventListProps';
import { IEventsService } from '../../interfaces/IEventsService';
import { MockEventsService } from '../../services/MockEventsService';
import { SPEventsService } from '../../services/SPEventsService';

export interface IEventListWebPartProps {
  description: string;
  listname: string;
}

export default class EventListWebPart extends BaseClientSideWebPart<IEventListWebPartProps> {

  private eventsService: IEventsService;

  protected onInit(): Promise<void> {
    this.eventsService = Environment.type == EnvironmentType.Local ? new MockEventsService() : new SPEventsService(this.context, this.properties);

    return Promise.resolve();
  }

  public render(): void {
    if(!this.properties.listname) {
      this.context.statusRenderer.renderError(this.domElement, 'Configure the list that contains the event data via webpart properties.');
      return;
    }

    this.eventsService.get()
      .then((events) => {
        Log.info('EventListWebPart', `Got ${events ? events.length : 0} events`, this.context.serviceScope);

        const element: React.ReactElement<IEventListProps > = React.createElement(
          EventList,
          {
            description: this.properties.description,
            items: events,
            eventsService: this.eventsService
          }
        );

        ReactDom.render(element, this.domElement);
      })
      .catch((err) => {
        this.context.statusRenderer.renderError(this.domElement, err.message ? err.message : 'Unable to get event data');
        Log.warn('EventListWebPart', err.message, this.context.serviceScope);
      });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listname', {
                  label: strings.ListnameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
