import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { country } from '../../services/country';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './countries.html',
  styleUrls: ['./countries.css'],
})
export class Countries implements OnInit {
  countries: any[] = [];
  loading = true;

  constructor(
    private countryService: country,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading = true;
    this.countries = [];
    this.cdr.detectChanges();

    this.countryService.getAllCountries().subscribe({
      next: (data: any[]) => {
        this.countries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCurrencyName(currencies: any): string {
    if (!currencies) return 'N/A';
    const first = Object.values(currencies)[0] as any;
    return first?.name || 'N/A';
  }

  trackByCode(index: number, item: any): string {
    return item.cca3;
  }
}