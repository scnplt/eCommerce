import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html'
})
export class SearchComponent {

  private route: Router = inject(Router);

  query: string = ""

  doSearch(value: string) {
    value.trim() == "" ? this.route.navigate(["/products"]) : this.route.navigateByUrl(`/search/${value}`);
  }
}
