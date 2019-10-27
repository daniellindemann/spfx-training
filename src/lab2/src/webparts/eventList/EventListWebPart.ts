import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Log } from '@microsoft/sp-core-library';
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

export interface IEventListWebPartProps {
  description: string;
}

export default class EventListWebPart extends BaseClientSideWebPart<IEventListWebPartProps> {

  private eventsService: IEventsService;

  protected onInit(): Promise<void> {
    this.eventsService = new MockEventsService();

    return Promise.resolve();
  }

  public render(): void {
    this.eventsService.get()
      .then((events) => {
        Log.info('EventListWebPart', `Got ${events ? events.length : 0} events`, this.context.serviceScope);

        const element: React.ReactElement<IEventListProps > = React.createElement(
          EventList,
          {
            description: this.properties.description,
            items: events
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
