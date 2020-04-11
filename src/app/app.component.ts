import { Component, OnInit } from '@angular/core';

import { DataService, SlidesModel } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  model: SlidesModel;
  title = 'ng-slides';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.initApp();
  }

  async initApp() {
    this.model = await this.dataService.getSlidesModel();
  }

}
