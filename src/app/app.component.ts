import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { DataService, SlidesModel, DataUrl, ImageSliderConfig } from './data.service';
import { SoundService } from './sound.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  slidesModel: SlidesModel;
  title = 'ng-slides';

  hideNavigation = false;
  isLoading = true;
  layoutForInfo = false;
  canPlaySound = false;

  // tslint:disable-next-line: variable-name
  private _sliderConfig: ImageSliderConfig;
  get sliderConfig() {
    return this._sliderConfig;
  }
  set sliderConfig(sliderConfig: ImageSliderConfig) {
    this._sliderConfig = sliderConfig;
  }

  constructor(
    private dataService: DataService,
    private soundService: SoundService,
    breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      if (result.matches) {
        // hide nav bar
        this.hideNavigation = true;
        this.canPlaySound = false;
      } else {
        this.hideNavigation = this.sliderConfig?.hideNavigation || false;
        this.canPlaySound = true;
      }
    });

  }

  ngOnInit(): void {
    this.dataService.getSlidesModel().then(m => {
      this.slidesModel = m;
      this.sliderConfig = m.imageSliderConfig;
      this.hideNavigation = this.sliderConfig.hideNavigation;
      this.loadSounds(m.sounds);
      this.isLoading = false;
    });
  }

  loadSounds(sounds: DataUrl[]) {
    if (sounds && this.canPlaySound) {
      this.soundService.load(sounds);
    }
  }

  onInfoChange(showInfo: boolean) {
    this.layoutForInfo = showInfo;
  }
}
