import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class country {
  private apiUrl = 'https://restcountries.com/v3.1';

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
            attractions: this.extractAttractions(extract)
          };
        }

        throw new Error('Wikipedia not found');
      })
    );
  }

  private getPerfectCountryName(code: string): string {
    const perfectNames: { [key: string]: string } = {
      'USA': 'United States',
      'CAN': 'Canada',
      'MEX': 'Mexico',
      'BRA': 'Brazil',
      'ARG': 'Argentina',
      'CHL': 'Chile',
      'COL': 'Colombia',
      'PER': 'Peru',
      'VEN': 'Venezuela',
      'CUB': 'Cuba',

      'GBR': 'United Kingdom',
      'DEU': 'Germany',
      'FRA': 'France',
      'ITA': 'Italy',
      'ESP': 'Spain',
      'NLD': 'Netherlands',
      'BEL': 'Belgium',
      'SWE': 'Sweden',
      'NOR': 'Norway',
      'DNK': 'Denmark',
      'FIN': 'Finland',
      'POL': 'Poland',
      'PRT': 'Portugal',
      'GRC': 'Greece',
      'TUR': 'Turkey',
      'AUT': 'Austria',
      'CHE': 'Switzerland',
      'IRL': 'Ireland',
      'CZE': 'Czech Republic',

      'JPN': 'Japan',
      'CHN': 'China',
      'IND': 'India',
      'KOR': 'South Korea',
      'PHL': 'Philippines',
      'IDN': 'Indonesia',
      'THA': 'Thailand',
      'VNM': 'Vietnam',
      'MYS': 'Malaysia',
      'SGP': 'Singapore',
      'SAU': 'Saudi Arabia',
      'ARE': 'United Arab Emirates',
      'ISR': 'Israel',
      'IRN': 'Iran',

      'AUS': 'Australia',
      'NZL': 'New Zealand',
      'KIR': 'Kiribati',
      'FJI': 'Fiji',
      'PNG': 'Papua New Guinea',

      'ZAF': 'South Africa',
      'EGY': 'Egypt',
      'NGA': 'Nigeria',
      'KEN': 'Kenya',
      'MAR': 'Morocco',
      'ETH': 'Ethiopia',
      'GHA': 'Ghana',
      'AGO': 'Angola',
      'DZA': 'Algeria',

      'RUS': 'Russia'
    };

    return perfectNames[code] || code;
  }

  private getRichFallback(code: string): any {
    const richData: { [key: string]: any } = {
      'USA': {
        description: 'The United States is a federal republic of 50 states with diverse landscapes, major global influence, and a rich mix of cultures and traditions.',
        attractions: ['Statue of Liberty', 'Grand Canyon', 'Yellowstone', 'Golden Gate Bridge', 'Niagara Falls']
      },
      'CAN': {
        description: 'Canada is the second largest country in the world, known for its natural beauty, welcoming cities, and multicultural identity.',
        attractions: ['Niagara Falls', 'Banff', 'Vancouver', 'CN Tower', 'Rocky Mountains']
      },
      'MEX': {
        description: 'Mexico is known for its vibrant culture, ancient civilizations, flavorful cuisine, and beautiful coastal destinations.',
        attractions: ['Chichen Itza', 'Teotihuacan', 'Cancun', 'Copper Canyon', 'Guadalajara']
      },
      'BRA': {
        description: 'Brazil is the largest country in South America, famous for Carnival, football, the Amazon, and iconic landscapes.',
        attractions: ['Christ the Redeemer', 'Amazon Rainforest', 'Iguazu Falls', 'Copacabana', 'Sugarloaf Mountain']
      },
      'GBR': {
        description: 'The United Kingdom is a historic island nation known for its monarchy, literature, iconic cities, and cultural influence.',
        attractions: ['Big Ben', 'Stonehenge', 'Lake District', 'Edinburgh Castle', 'Cotswolds']
      },
      'DEU': {
        description: 'Germany is one of Europe’s leading countries, known for its engineering, castles, rich history, and vibrant cities.',
        attractions: ['Brandenburg Gate', 'Neuschwanstein Castle', 'Black Forest', 'Cologne Cathedral', 'Oktoberfest']
      },
      'FRA': {
        description: 'France is world-famous for its art, cuisine, fashion, and landmarks, from Paris to the countryside of Provence.',
        attractions: ['Eiffel Tower', 'Louvre Museum', 'Versailles', 'Mont Saint-Michel', 'Provence']
      },
      'ITA': {
        description: 'Italy is known for its Roman heritage, Renaissance art, scenic coastlines, and globally loved cuisine.',
        attractions: ['Colosseum', 'Venice Canals', 'Pompeii', 'Amalfi Coast', 'Florence']
      },
      'JPN': {
        description: 'Japan blends ancient traditions with modern innovation, offering temples, technology, cuisine, and natural beauty.',
        attractions: ['Mount Fuji', 'Kyoto Temples', 'Tokyo Tower', 'Hiroshima', 'Osaka Castle']
      },
      'CHN': {
        description: 'China is one of the world’s oldest civilizations, known for its immense history, population, culture, and landmarks.',
        attractions: ['Great Wall', 'Forbidden City', 'Terracotta Army', 'Yellow Mountain', 'Li River']
      },
      'IND': {
        description: 'India is a vibrant and diverse country with ancient traditions, major religions, colorful festivals, and iconic landmarks.',
        attractions: ['Taj Mahal', 'Varanasi', 'Kerala', 'Rajasthan', 'Goa Beaches']
      },
      'KOR': {
        description: 'South Korea is a dynamic country known for technology, entertainment, food, and a strong mix of old and new culture.',
        attractions: ['Gyeongbokgung Palace', 'Jeju Island', 'DMZ', 'Busan Beach', 'Namsan Tower']
      },
      'PHL': {
        description: 'The Philippines is an archipelago known for tropical beaches, rich biodiversity, warm hospitality, and diverse traditions.',
        attractions: ['Chocolate Hills', 'Boracay Beach', 'Palawan', 'Rice Terraces', 'Mayon Volcano']
      },
      'AUS': {
        description: 'Australia is a vast country-continent known for unique wildlife, beaches, modern cities, and natural wonders.',
        attractions: ['Sydney Opera House', 'Great Barrier Reef', 'Uluru', 'Melbourne', 'Blue Mountains']
      },
      'KIR': {
        description: 'Kiribati is a Pacific island nation made up of coral atolls, known for its remote beauty and ocean landscapes.',
        attractions: ['Christmas Island', 'Phoenix Islands', 'Tarawa Atoll', 'Coral Reefs', 'Banana Islands']
      },
      'ZAF': {
        description: 'South Africa is known for its dramatic scenery, wildlife, cultural diversity, and well-known national parks.',
        attractions: ['Table Mountain', 'Kruger National Park', 'Cape Town', 'Drakensberg', 'Garden Route']
      },
      'default': {
        description: 'A beautiful sovereign nation with rich culture, history, landscapes, and unique attractions worth exploring.',
        attractions: ['Famous Landmarks', 'Natural Wonders', 'Cultural Heritage', 'Historic Sites', 'Scenic Destinations']
      }
    };

    return richData[code] || richData['default'];
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
}