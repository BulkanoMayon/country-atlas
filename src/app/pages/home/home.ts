import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  imports: [RouterLink],
  styleUrls: ['./home.css']
})
export class Home {}