import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesKey = 'country_atlas_favorites';

  getFavorites(): any[] {
    const raw = localStorage.getItem(this.favoritesKey);
    return raw ? JSON.parse(raw) : [];
  }

  saveFavorites(favorites: any[]): void {
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
  }

  isFavorite(cca3: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some((item: any) => item.cca3 === cca3);
  }

  addFavorite(country: any): void {
    const favorites = this.getFavorites();

    const exists = favorites.some((item: any) => item.cca3 === country.cca3);
    if (exists) return;

    favorites.push({
      cca3: country.cca3,
      name: country.name,
      flags: country.flags,
      capital: country.capital,
      population: country.population,
      currencies: country.currencies,
      region: country.region
    });

    this.saveFavorites(favorites);
  }

  removeFavorite(cca3: string): void {
    const favorites = this.getFavorites().filter((item: any) => item.cca3 !== cca3);
    this.saveFavorites(favorites);
  }

  toggleFavorite(country: any): void {
    if (this.isFavorite(country.cca3)) {
      this.removeFavorite(country.cca3);
    } else {
      this.addFavorite(country);
    }
  }
}