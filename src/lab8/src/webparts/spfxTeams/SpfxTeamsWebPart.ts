import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpfxTeamsWebPartStrings';
import SpfxTeams from './components/SpfxTeams';
import { ISpfxTeamsProps } from './components/ISpfxTeamsProps';
import { Context } from '@microsoft/teams-js';

export interface ISpfxTeamsWebPartProps {
  description: string;
}

export default class SpfxTeamsWebPart extends BaseClientSideWebPart<ISpfxTeamsWebPartProps> {

  private _msTeamsContext: Context;

  protected onInit(): Promise<any> {
    let promise = Promise.resolve();
    if(this.context.microsoftTeams) {
      promise = new Promise((resolve, reject) => {
        this.context.microsoftTeams.getContext((ctx) => {
          this._msTeamsContext = ctx;
          resolve();
        });
      });
    }
    return promise;
  }

  public render(): void {
    let title;
    if(this._msTeamsContext) {
      title = `From Teams with ❤: ${this._msTeamsContext.teamName}`;
    }
    else {
      title = `From SharePoint with ❤: ${this.context.pageContext.web.title}`;
    }

    const element: React.ReactElement<ISpfxTeamsProps> = React.createElement(
      SpfxTeams,
      {
        title: title,
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
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
