import { LocalizeRouterHttpLoader } from '../src/http-loader';
import { Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { getTestBed, inject, TestBed } from '@angular/core/testing';
import {
  ALWAYS_SET_PREFIX, CACHE_MECHANISM, CACHE_NAME, CacheMechanism, DEFAULT_LANG_FUNCTION,
  LocalizeRouterSettings, USE_CACHED_LANG
} from 'localize-router';
import { Http, HttpModule, ResponseOptions, Response, XHRBackend } from '@angular/http';
import { Location } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';

class FakeTranslateService {

}

class FakeLocation {
  path(): string {
    return '';
  }
}

describe('LocalizeRouterHttpLoader try 2', () => {
  let injector: Injector;
  let loader: LocalizeRouterHttpLoader;
  let translate: TranslateService;
  let location: Location;
  let settings: LocalizeRouterSettings;
  let http: Http;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpModule],
      providers: [
        { provide: TranslateService, useClass: FakeTranslateService },
        { provide: Location, useClass: FakeLocation },
        { provide: XHRBackend, useClass: MockBackend },
        { provide: USE_CACHED_LANG, useValue: true },
        { provide: DEFAULT_LANG_FUNCTION, useValue: void 0 },
        { provide: CACHE_NAME, useValue: 'LOCALIZE_DEFAULT_LANGUAGE' },
        { provide: CACHE_MECHANISM, useValue: CacheMechanism.LocalStorage },
        { provide: ALWAYS_SET_PREFIX, useValue: true },
        LocalizeRouterSettings
      ]
    });
    injector = getTestBed();
    translate = injector.get(TranslateService);
    location = injector.get(Location);
    settings = injector.get(LocalizeRouterSettings);
    http = injector.get(Http);
    loader = new LocalizeRouterHttpLoader(translate, location, settings, http);
  });

  it('should set locales and prefix from file', inject([XHRBackend], (backend: MockBackend) => {
    const mockResponse = {
      locales: ['en', 'de', 'fr'],
      prefix: 'PREFIX'
    };
    const myPromise = Promise.resolve();
    spyOn(http, 'get').and.callThrough();
    spyOn(<any> loader, 'init').and.returnValue(myPromise);

    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse),
      })));
    });

    loader.load([]).then(() => {
      expect(http.get).toHaveBeenCalledWith('assets/locales.json');
      expect((<any> loader).init).toHaveBeenCalledWith([]);
      expect(loader.locales).toEqual(mockResponse.locales);
      expect((<any> loader).prefix).toEqual(mockResponse.prefix);
    });
  }));

  it('should set default value for prefix if not provided', inject([XHRBackend], (backend: MockBackend) => {
    const mockResponse = {
      locales: ['en', 'de', 'fr']
    };
    const myPromise = Promise.resolve();
    spyOn(<any> loader, 'init').and.returnValue(myPromise);

    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse),
      })));
    });

    loader.load([]).then(() => {
      expect((<any> loader).prefix).toEqual('');
    });
  }));

  it('should load config from custom path', inject([XHRBackend], (backend: MockBackend) => {
    const mockResponse = {
      locales: ['en', 'de', 'fr']
    };
    const customPath = 'my/custom/path/to/config.json';
    const myPromise = Promise.resolve();
    loader = new LocalizeRouterHttpLoader(translate, location, settings, http, customPath);
    spyOn(<any> loader, 'init').and.returnValue(myPromise);
    spyOn(http, 'get').and.callThrough();

    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse),
      })));
    });

    loader.load([]).then(() => {
      expect(http.get).toHaveBeenCalledWith(customPath);
    });
  }));
});
