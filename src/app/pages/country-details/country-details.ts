import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { country } from '../../services/country';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-details.html',
  styleUrls: ['./country-details.css']
})
export class CountryDetails implements OnInit {
  country: any = null;
  countryDescription: any = null;
  loading = true;

  restaurants: any[] = [];
  cityServices: any[] = [];
  savedPlaces: any[] = [];

  weather: any = null;
  weatherLoading = false;

  showMapModal = false;
  mapLoadingRestaurants = false;
  mapLoadingServices = false;

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;
  private countryLat = 0;
  private countryLng = 0;
  private mapPlacesLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private countryService: country,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSavedPlaces();

    this.route.paramMap.subscribe(params => {
      const code = params.get('cca3');

      if (!code) {
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.loading = true;
      this.country = null;
      this.countryDescription = null;
      this.restaurants = [];
      this.cityServices = [];
      this.weather = null;
      this.weatherLoading = false;
      this.showMapModal = false;
      this.mapLoadingRestaurants = false;
      this.mapLoadingServices = false;
      this.mapPlacesLoaded = false;

      this.destroyMap();
      this.cdr.detectChanges();

      this.countryService.getCountryByCode(code).subscribe({
        next: (data: any) => {
          this.country = Array.isArray(data) ? data[0] : data;

          const capitalCoords = this.country?.capitalInfo?.latlng;
          const fallbackCoords = this.country?.latlng;

          if (capitalCoords?.length === 2) {
            this.countryLat = capitalCoords[0];
            this.countryLng = capitalCoords[1];
          } else if (fallbackCoords?.length === 2) {
            this.countryLat = fallbackCoords[0];
            this.countryLng = fallbackCoords[1];
          }

          this.loading = false;
          this.loadWeather();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Country details error:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });

      this.countryService.getCountryDescription(code).subscribe({
        next: (data: any) => {
          this.countryDescription = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Description error:', err);
          this.cdr.detectChanges();
        }
      });
    });
  }

  openMapModal(): void {
    if (!this.countryLat || !this.countryLng) return;

    this.showMapModal = true;
    this.loadSavedPlaces();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.initMap();

      if (!this.mapPlacesLoaded) {
        this.loadMapPlaces();
      } else {
        this.refreshMapMarkers();
        this.map?.invalidateSize();
        this.cdr.detectChanges();
      }
    }, 250);
  }

  loadMapPlaces(): void {
    this.mapLoadingRestaurants = true;
    this.mapLoadingServices = true;
    this.cdr.detectChanges();

    this.countryService.getNearbyRestaurants(this.countryLat, this.countryLng).subscribe({
      next: (data: any[]) => {
        this.restaurants = data || [];
        this.mapLoadingRestaurants = false;
        this.mapPlacesLoaded = true;
        this.refreshMapMarkers();
        this.map?.invalidateSize();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Restaurants load error:', err);
        this.restaurants = [];
        this.mapLoadingRestaurants = false;
        this.refreshMapMarkers();
        this.cdr.detectChanges();
      }
    });

    this.countryService.getNearbyServices(this.countryLat, this.countryLng).subscribe({
      next: (data: any[]) => {
        this.cityServices = data || [];
        this.mapLoadingServices = false;
        this.mapPlacesLoaded = true;
        this.refreshMapMarkers();
        this.map?.invalidateSize();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Services load error:', err);
        this.cityServices = [];
        this.mapLoadingServices = false;
        this.refreshMapMarkers();
        this.cdr.detectChanges();
      }
    });
  }

  closeMapModal(): void {
    this.showMapModal = false;
    this.mapLoadingRestaurants = false;
    this.mapLoadingServices = false;
    this.destroyMap();
    this.cdr.detectChanges();
  }

  destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markersLayer = null;
    }
  }

  initMap(): void {
    if (!this.countryLat || !this.countryLng) return;

    this.destroyMap();

    this.map = L.map('city-map', {
      center: [this.countryLat, this.countryLng],
      zoom: 12,
      zoomControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    setTimeout(() => {
      this.map?.invalidateSize();
      this.refreshMapMarkers();
    }, 300);
  }

  refreshMapMarkers(): void {
    if (!this.map || !this.markersLayer) return;

    this.markersLayer.clearLayers();

    if (this.countryLat && this.countryLng) {
      L.circleMarker([this.countryLat, this.countryLng], {
        radius: 9,
        color: '#2563eb',
        fillColor: '#60a5fa',
        fillOpacity: 0.9
      })
        .addTo(this.markersLayer)
        .bindPopup(
          `<b>${this.country?.capital?.[0] || this.country?.name?.common}</b><br>Main destination center`
        );
    }

    this.addPlaceMarkers(this.restaurants, '#dc2626');
    this.addPlaceMarkers(this.cityServices, '#059669');
    this.addSavedPlaceMarkers();
  }

  addPlaceMarkers(places: any[], color: string): void {
    if (!this.markersLayer || !Array.isArray(places)) return;

    places.forEach((place: any) => {
      if (!place?.lat || !place?.lng) return;

      L.circleMarker([place.lat, place.lng], {
        radius: 7,
        color,
        fillColor: color,
        fillOpacity: 0.85
      })
        .addTo(this.markersLayer!)
        .bindPopup(`<b>${place.name}</b><br>${place.type}<br>${place.address}`);
    });
  }

  addSavedPlaceMarkers(): void {
    if (!this.markersLayer) return;

    const currentCountry = this.country?.name?.common || '';

    this.savedPlaces
      .filter((place: any) => place.country === currentCountry)
      .forEach((place: any) => {
        if (!place?.lat || !place?.lng) return;

        L.circleMarker([place.lat, place.lng], {
          radius: 10,
          color: '#b45309',
          fillColor: '#f59e0b',
          fillOpacity: 1,
          weight: 3
        })
          .addTo(this.markersLayer!)
          .bindPopup(`<b>${place.name}</b><br>Saved Marker<br>${place.address}`);
      });
  }

  focusPlace(place: any): void {
    if (!place?.lat || !place?.lng) return;

    if (!this.showMapModal) {
      this.openMapModal();

      setTimeout(() => {
        if (this.map) {
          this.map.setView([place.lat, place.lng], 15);
        }
      }, 700);

      return;
    }

    if (this.map) {
      this.map.setView([place.lat, place.lng], 15);
    }
  }

  loadSavedPlaces(): void {
    const raw = localStorage.getItem('country_atlas_saved_places');
    this.savedPlaces = raw ? JSON.parse(raw) : [];
  }

  savePlace(place: any): void {
    const exists = this.savedPlaces.some((item: any) => item.id === place.id);
    if (exists) return;

    this.savedPlaces.push({
      id: place.id,
      name: place.name,
      type: place.type,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      country: this.country?.name?.common || 'Unknown'
    });

    localStorage.setItem('country_atlas_saved_places', JSON.stringify(this.savedPlaces));
    this.refreshMapMarkers();
    this.cdr.detectChanges();
  }

  removeSavedPlace(id: number): void {
    this.savedPlaces = this.savedPlaces.filter((item: any) => item.id !== id);
    localStorage.setItem('country_atlas_saved_places', JSON.stringify(this.savedPlaces));
    this.refreshMapMarkers();
    this.cdr.detectChanges();
  }

  isPlaceSaved(id: number): boolean {
    return this.savedPlaces.some((item: any) => item.id === id);
  }

  getCurrentCountrySavedPlaces(): any[] {
    const currentCountry = this.country?.name?.common || '';
    return this.savedPlaces.filter((item: any) => item.country === currentCountry);
  }

  loadWeather(): void {
    if (!this.countryLat || !this.countryLng) return;

    this.weatherLoading = true;
    this.weather = null;
    this.cdr.detectChanges();

    this.countryService.getWeather(this.countryLat, this.countryLng).subscribe({
      next: (data: any) => {
        this.weather = data?.current || null;
        this.weatherLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Weather error:', err);
        this.weather = null;
        this.weatherLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getWeatherLabel(code: number): string {
    const weatherMap: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };

    return weatherMap[code] || 'Unknown weather';
  }

  get isFavorite(): boolean {
    if (!this.country?.cca3) return false;
    return this.favoritesService.isFavorite(this.country.cca3);
  }

  toggleFavorite(): void {
    if (!this.country) return;
    this.favoritesService.toggleFavorite(this.country);
    this.cdr.detectChanges();
  }

  getCurrencyName(currencies: any): string {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map((item: any) => item.name)
      .join(', ');
  }

  getLanguages(): string {
    if (!this.country?.languages) return 'N/A';
    return Object.values(this.country.languages).join(', ');
  }

  getNativeName(): string {
    if (!this.country?.name?.nativeName) return 'N/A';
    const nativeNames = this.country.name.nativeName;
    const firstKey = Object.keys(nativeNames)[0];
    return nativeNames[firstKey]?.common || 'N/A';
  }

  getTimezones(): string {
    if (!this.country?.timezones?.length) return 'N/A';
    return this.country.timezones.join(', ');
  }

  getLifestyleList(key: string): string[] {
    return this.countryDescription?.[key] || [];
  }

  goBack(): void {
    window.history.back();
  }
}