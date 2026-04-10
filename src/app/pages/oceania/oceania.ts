import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { country } from '../../services/country';

@Component({
  selector: 'app-oceania',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './oceania.html',
  styleUrls: ['./oceania.css']
})
export class Oceania implements OnInit {

  countries: any[] = [];
  loading = true;

  constructor(
    private countryService: country,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.countries = [];

    this.countryService.getCountriesByRegion('oceania').subscribe({
      next: (data: any) => {
        this.countries = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getCurrencyName(currencies: any): string {
    if (!currencies) return 'N/A';
    const first = Object.values(currencies)[0] as any;
    return first?.name || 'N/A';
  }
}