import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Log, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'HelloWorldWebPartStrings';
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import { IEventService } from '../../interfaces/IEventService';
import { MockEventsService } from '../../services/MockEventsServices';
import { SPEventsService } from '../../services/SPEventsService';

export interface IHelloWorldWebPartProps {
  listname: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  private static EventListWebPartSource: string = 'EventListWebPartString';

  private eventService: IEventService = null;

  protected onInit(): Promise<void> {
    // get's only called once after page load
    this.eventService = Environment.type == EnvironmentType.Local ? new MockEventsService() : new SPEventsService(this.context, this.properties);
    return Promise.resolve();
  }

  public render(): void {

    this.eventService.get().then((events) => {
      Log.info(HelloWorldWebPart.EventListWebPartSource, `Got ${events ? events.length : 0} events`, this.context.serviceScope);

      const element: React.ReactElement<IHelloWorldProps> = React.createElement(
        HelloWorld,
        {
          eventsService: this.eventService,
          items: events
        }
      );

      ReactDom.render(element, this.domElement);
    })
    .catch((err) => {
      this.context.statusRenderer.renderError(this.domElement, err.message ? err.message : 'Unable to get event data');
      Log.warn(HelloWorldWebPart.EventListWebPartSource, err.message, this.context.serviceScope);
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
                PropertyPaneTextField('listname', {
                  label: strings.ListNameFieldLabel,
                  placeholder: strings.ListNamePlaceholder
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
