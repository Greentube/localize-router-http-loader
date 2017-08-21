import { LocalizeParser, LocalizeRouterSettings, ILocalizeRouterParserConfig } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import { Http, Response } from '@angular/http';
import { Routes } from '@angular/router';
import { Location } from '@angular/common';

export class LocalizeRouterHttpLoader extends LocalizeParser {
  private _dataLoaded: boolean;

  /**
   * CTOR
   * @param translate
   * @param location
   * @param settings
   * @param http
   * @param path
   */
  constructor(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, private http: Http, private path: string = 'assets/locales.json') {
    super(translate, location, settings);
    this._dataLoaded = false;
  }

  /**
   * Initialize or append routes
   * @param routes
   * @returns {Promise<any>}
   */
  load(routes: Routes): Promise<any> {
    return new Promise((resolve: any) => {
      if (this._dataLoaded) {
        this.init(routes).then(resolve);
      } else {
        this.http.get(`${this.path}`)
          .map((res: Response) => res.json())
          .subscribe((data: ILocalizeRouterParserConfig) => {
            this._dataLoaded = true;
            this.locales = data.locales;
            this.prefix = data.prefix || '';
            this.init(routes).then(resolve);
          });
      }
    });
  }

}
