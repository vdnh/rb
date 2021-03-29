import { Injectable } from '@angular/core';
import { Observer } from 'rxjs';
import { Observable } from 'rxjs';

/**
 * GeolocationService class.
 * https://developers.google.com/maps/documentation/javascript/
 * https://dev.w3.org/geo/api/spec-source.html
 */
@Injectable() export class GeolocationService {

    /**
     * Tries HTML5 geolocation.
     *
     * Wraps the Geolocation API into an observable.
     *
     * @return An observable of Position
     */
    getCurrentPosition(): Observable<any> {
        // Observable.create
        return new Observable((observer: Observer<any>) => {
            // Invokes getCurrentPosition method of Geolocation API.
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    observer.next(position);
                    observer.complete();
                },
                (error) => {
                    console.log('Geolocation service: ' + error.message);
                    observer.error(error);
                }
            );
        });
    }

}
