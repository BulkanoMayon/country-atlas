import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { country } from '../../services/country';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  query = '';
  results: any[] = [];
  allCountries: any[] = [];
  loading = false;

  regions = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania'];
  selectedRegion = 'All';

  constructor(
    private countryService: country,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.countryService.getAllCountries().subscribe({
      next: (data: any[]) => {
        this.allCountries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Search load error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  search(): void {
    this.applyFilters();
    this.cdr.detectChanges();
  }

  setRegion(region: string): void {
    this.selectedRegion = region;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  clearAll(): void {
    this.query = '';
    this.selectedRegion = 'All';
    this.applyFilters();
    this.cdr.detectChanges();
  }

  applyFilters(): void {
    const q = this.query.trim().toLowerCase();

    this.results = this.allCountries.filter((countryItem) => {
      const matchesName =
        !q || countryItem.name?.common?.toLowerCase().includes(q);

      const matchesRegion =
        this.selectedRegion === 'All' ||
        countryItem.region?.toLowerCase() === this.selectedRegion.toLowerCase();

      return matchesName && matchesRegion;
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