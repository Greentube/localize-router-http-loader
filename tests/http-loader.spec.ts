import { LocalizeRouterHttpLoader } from '../src/http-loader';
import { Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Routes } from '@angular/router';
import { getTestBed, TestBed } from '@angular/core/testing';
import { LocalizeRouterSettings } from 'localize-router';
import { Http } from '@angular/http';
import { Location } from '@angular/common';

class FakeTranslateService {

}

class FakeLocation {
  path(): string {
    return '';
  }
}


describe('LocalizeRouterHttpLoader', () => {
  let injector: Injector;
  let loader: LocalizeRouterHttpLoader;
  let translate: TranslateService;
  let location: Location;
  let settings: LocalizeRouterSettings;

  let routes: Routes;
  let locales: string[];
  // let prefix = 'PREFIX.';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: TranslateService, useClass: FakeTranslateService },
        { provide: Location, useClass: FakeLocation }
      ]
    });
    routes = [
      { path: '', redirectTo: 'some/path' },
      {
        path: 'some/path', children: [
        { path: '', redirectTo: 'nothing' },
        { path: 'else/:id', redirectTo: 'nothing/else' }
      ]
      }
    ];
    locales = ['en', 'de', 'fr'];
    localStorage.removeItem('LOCALIZE_LOCAL_STORAGE');
    injector = getTestBed();
    translate = injector.get(TranslateService);
    location = injector.get(Location);
    settings = injector.get(LocalizeRouterSettings);
    loader = new LocalizeRouterHttpLoader(translate, location, settings, injector.get(Http));
  });

});
