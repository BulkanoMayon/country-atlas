import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class country {
  private apiUrl = 'https://restcountries.com/v3.1';
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  constructor(private http: HttpClient) {}

  getAllCountries(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/all?fields=name,capital,population,flags,currencies,region,cca3`
    );
  }

  getCountriesByRegion(region: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/region/${region}?fields=name,capital,population,flags,currencies,region,cca3`
    );
  }

  getCountryByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/name/${name}`);
  }

  getCountryByCode(code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/alpha/${code}`);
  }

  getCountryDescription(code: string): Observable<any> {
    return this.getWikipediaDescription(code).pipe(
      catchError(() => {
        return of(this.getRichFallback(code));
      })
    );
  }

getNearbyRestaurants(lat: number, lng: number): Observable<any[]> {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"~"restaurant|cafe|fast_food"](around:2500,${lat},${lng});
      way["amenity"~"restaurant|cafe|fast_food"](around:2500,${lat},${lng});
    );
    out center 15;
  `;

  return this.http
    .post<any>(this.overpassUrl, 'data=' + encodeURIComponent(query), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .pipe(
      map((response: any) => this.normalizeOverpassElements(response?.elements || [])),
      catchError((error) => {
        console.error('Restaurants query error:', error);
        return of([]);
      })
    );
}

getNearbyServices(lat: number, lng: number): Observable<any[]> {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"~"hospital|pharmacy|bank|police|bus_station|fuel"](around:2500,${lat},${lng});
      way["amenity"~"hospital|pharmacy|bank|police|bus_station|fuel"](around:2500,${lat},${lng});
    );
    out center 15;
  `;

  return this.http
    .post<any>(this.overpassUrl, 'data=' + encodeURIComponent(query), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .pipe(
      map((response: any) => this.normalizeOverpassElements(response?.elements || [])),
      catchError((error) => {
        console.error('Services query error:', error);
        return of([]);
      })
    );
}

  private normalizeOverpassElements(elements: any[]): any[] {
    return elements
      .map((item: any) => {
        const lat = item.lat ?? item.center?.lat;
        const lng = item.lon ?? item.center?.lon;

        return {
          id: item.id,
          name: item.tags?.name || 'Unnamed Place',
          type: item.tags?.amenity || item.tags?.tourism || 'place',
          lat,
          lng,
          address: item.tags?.['addr:street'] || item.tags?.['addr:full'] || 'Address not available'
        };
      })
      .filter((item: any) => item.lat && item.lng)
      .slice(0, 12);
  }

  private getWikipediaDescription(code: string): Observable<any> {
    const countryName = this.getPerfectCountryName(code);

    return this.http.get<any>('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        titles: countryName,
        prop: 'extracts',
        exchars: '400',
        exintro: true,
        explaintext: 'true',
        format: 'json',
        origin: '*'
      }
    }).pipe(
      map((response: any) => {
        const pages = response.query?.pages || {};
        const pageId = Object.keys(pages)[0];

        if (pageId !== '-1' && pages[pageId]?.extract) {
          const extract = pages[pageId].extract;

          return {
            description:
              extract.substring(0, 400) + (extract.length > 400 ? '...' : ''),
            attractions: this.extractAttractions(extract),
            cities: this.getLifestyleFallback(code).cities,
            food: this.getLifestyleFallback(code).food,
            culture: this.getLifestyleFallback(code).culture,
            events: this.getLifestyleFallback(code).events,
            activities: this.getLifestyleFallback(code).activities,
            services: this.getLifestyleFallback(code).services
          };
        }

        throw new Error('Wikipedia not found');
      })
    );
  }

  private getPerfectCountryName(code: string): string {
    const perfectNames: { [key: string]: string } = {
      USA: 'United States',
      CAN: 'Canada',
      MEX: 'Mexico',
      BRA: 'Brazil',
      ARG: 'Argentina',
      CHL: 'Chile',
      COL: 'Colombia',
      PER: 'Peru',
      VEN: 'Venezuela',
      CUB: 'Cuba',
      GBR: 'United Kingdom',
      DEU: 'Germany',
      FRA: 'France',
      ITA: 'Italy',
      ESP: 'Spain',
      NLD: 'Netherlands',
      BEL: 'Belgium',
      SWE: 'Sweden',
      NOR: 'Norway',
      DNK: 'Denmark',
      FIN: 'Finland',
      POL: 'Poland',
      PRT: 'Portugal',
      GRC: 'Greece',
      TUR: 'Turkey',
      AUT: 'Austria',
      CHE: 'Switzerland',
      IRL: 'Ireland',
      CZE: 'Czech Republic',
      JPN: 'Japan',
      CHN: 'China',
      IND: 'India',
      KOR: 'South Korea',
      PHL: 'Philippines',
      IDN: 'Indonesia',
      THA: 'Thailand',
      VNM: 'Vietnam',
      MYS: 'Malaysia',
      SGP: 'Singapore',
      SAU: 'Saudi Arabia',
      ARE: 'United Arab Emirates',
      ISR: 'Israel',
      IRN: 'Iran',
      AUS: 'Australia',
      NZL: 'New Zealand',
      KIR: 'Kiribati',
      FJI: 'Fiji',
      PNG: 'Papua New Guinea',
      ZAF: 'South Africa',
      EGY: 'Egypt',
      NGA: 'Nigeria',
      KEN: 'Kenya',
      MAR: 'Morocco',
      ETH: 'Ethiopia',
      GHA: 'Ghana',
      AGO: 'Angola',
      DZA: 'Algeria',
      RUS: 'Russia'
    };

    return perfectNames[code] || code;
  }

  private getRichFallback(code: string): any {
    const richData: { [key: string]: any } = {
      PHL: {
        description: 'The Philippines is an archipelago known for tropical beaches, rich biodiversity, warm hospitality, and diverse traditions.',
        attractions: ['Chocolate Hills', 'Boracay Beach', 'Palawan', 'Rice Terraces', 'Mayon Volcano']
      },
      JPN: {
        description: 'Japan blends ancient traditions with modern innovation, offering temples, technology, cuisine, and natural beauty.',
        attractions: ['Mount Fuji', 'Kyoto Temples', 'Tokyo Tower', 'Hiroshima', 'Osaka Castle']
      },
      FRA: {
        description: 'France is world-famous for its art, cuisine, fashion, and landmarks, from Paris to the countryside of Provence.',
        attractions: ['Eiffel Tower', 'Louvre Museum', 'Versailles', 'Mont Saint-Michel', 'Provence']
      },
      default: {
        description: 'A beautiful sovereign nation with rich culture, history, landscapes, and unique attractions worth exploring.',
        attractions: ['Famous Landmarks', 'Natural Wonders', 'Cultural Heritage', 'Historic Sites', 'Scenic Destinations']
      }
    };

    const lifestyle = this.getLifestyleFallback(code);
    const selected = richData[code] || richData['default'];

    return {
      ...selected,
      cities: lifestyle.cities,
      food: lifestyle.food,
      culture: lifestyle.culture,
      events: lifestyle.events,
      activities: lifestyle.activities,
      services: lifestyle.services
    };
  }

  private getLifestyleFallback(code: string): any {
    const lifestyleData: { [key: string]: any } = {
      PHL: {
        cities: ['Manila', 'Cebu', 'Davao'],
        food: ['Adobo', 'Sinigang', 'Lechon'],
        culture: ['Fiestas', 'Warm Hospitality', 'Island Traditions'],
        events: ['Sinulog Festival', 'Ati-Atihan Festival', 'Kadayawan Festival'],
        activities: ['Island Hopping', 'Beach Trips', 'Heritage Walks'],
        services: ['Hotels', 'Transport Terminals', 'Tourist Help Desks']
      },
      JPN: {
        cities: ['Tokyo', 'Kyoto', 'Osaka'],
        food: ['Sushi', 'Ramen', 'Tempura'],
        culture: ['Tea Ceremonies', 'Anime Culture', 'Temple Traditions'],
        events: ['Cherry Blossom Season', 'Gion Festival', 'Snow Festivals'],
        activities: ['Temple Visits', 'City Tours', 'Food Trips'],
        services: ['Rail Pass Access', 'Tourist Information Centers', 'Urban Transit']
      },
      default: {
        cities: ['Capital City', 'Tourist District', 'Cultural Center'],
        food: ['Traditional Dishes', 'Street Food', 'Local Desserts'],
        culture: ['Local Traditions', 'Arts and Culture', 'Community Festivals'],
        events: ['Seasonal Festival', 'Cultural Celebration', 'Tourism Event'],
        activities: ['Sightseeing', 'Food Trips', 'Cultural Tours'],
        services: ['Hotels', 'Transport Access', 'Tourist Information']
      }
    };

    return lifestyleData[code] || lifestyleData['default'];
  }

  private extractAttractions(text: string): string[] {
    const keywords = [
      'park',
      'beach',
      'mountain',
      'temple',
      'palace',
      'castle',
      'falls',
      'island',
      'cathedral'
    ];

    const found: string[] = [];

    keywords.forEach((keyword) => {
      if (text.toLowerCase().includes(keyword)) {
        found.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    return found.length > 0 ? found.slice(0, 5) : [];
  }

  getWeather(lat: number, lng: number) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&timezone=auto`;

  return this.http.get<any>(url);
}
}