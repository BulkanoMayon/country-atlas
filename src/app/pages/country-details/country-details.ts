import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  constructor(
    private route: ActivatedRoute,
    private countryService: country,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
      this.cdr.detectChanges();

      this.countryService.getCountryByCode(code).subscribe({
        next: (data: any) => {
          this.country = Array.isArray(data) ? data[0] : data;
          this.loading = false;
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

  getContinents(): string {
    if (!this.country?.continents?.length) return 'N/A';
    return this.country.continents.join(', ');
  }

  getMapsLink(): string {
    return this.country?.maps?.googleMaps || this.country?.maps?.openStreetMaps || '#';
  }

  getLifestyleList(key: string): string[] {
    return this.countryDescription?.[key] || [];
  }

  goBack(): void {
    window.history.back();
  }
}