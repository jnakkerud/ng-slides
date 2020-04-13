import { Component, OnInit } from '@angular/core';

import { DataService, SlidesModel, DataUrl } from './data.service';
import { ActiveSlides } from './image-slider/image-slider.component';

function titleFromUrl(url: string ): string {
  return url.substring(url.lastIndexOf('/') + 1);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  model: SlidesModel;
  title = 'ng-slides';
  showInfo = false;

  slideInfo: DataUrl;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getSlidesModel().then(m => {
      this.model = m;
    });
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  onSlideChange(activeSlides: ActiveSlides) {
    const current = this.model.slides[activeSlides.current];

    this.slideInfo = {
      url: current.url,
      title: current.title || titleFromUrl(current.url),
      description: current.description || ''
    };
  }
}
