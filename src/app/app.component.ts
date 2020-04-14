import { Component, OnInit } from '@angular/core';

import { DataService, SlidesModel, DataUrl, ImageSliderConfig } from './data.service';
import { SoundService } from './sound.service';
import { ActiveSlides } from './image-slider/image-slider.component';

function titleFromUrl(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  slidesModel: SlidesModel;
  title = 'ng-slides';
  showInfo = false;

  slideInfo: DataUrl;

  isLoading = true;

  // tslint:disable-next-line: variable-name
  private _sliderConfig: ImageSliderConfig;
  get sliderConfig() {
    return this._sliderConfig;
  }
  set sliderConfig(sliderConfig: ImageSliderConfig) {
    this._sliderConfig = sliderConfig;
  }

  constructor(private dataService: DataService, private soundService: SoundService) { }

  ngOnInit(): void {
    this.dataService.getSlidesModel().then(m => {
      this.slidesModel = m;
      this.sliderConfig = m.imageSliderConfig;
      this.loadSound(m.sounds);
      this.isLoading = false;
    });
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  onSlideChange(activeSlides: ActiveSlides) {
    const current = this.slidesModel.slides[activeSlides.current];

    this.slideInfo = {
      url: current.url,
      title: current.title || titleFromUrl(current.url),
      description: current.description || ''
    };
  }

  loadSound(sounds: DataUrl[]) {
    if (sounds) {
      this.soundService.play(sounds);
    }
  }
}
