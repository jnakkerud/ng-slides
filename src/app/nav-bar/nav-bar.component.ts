import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { ActiveSlides } from '../image-slider/image-slider.component';
import { DataUrl } from '../data.service';
import { ImageSliderComponent } from '../image-slider/image-slider.component';

function titleFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
}

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'nav-bar',
    templateUrl: 'nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

    @Input() slider: ImageSliderComponent;

    @Output() showInfoChange = new EventEmitter<boolean>();

    showInfo = false;

    slideInfo: DataUrl;

    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'info-icon',
            sanitizer.bypassSecurityTrustResourceUrl('../assets/img/info-icon.svg'));
    }

    toggleInfo() {
        this.showInfo = !this.showInfo;
        this.handleInfoChange();
    }

    private handleInfoChange() {
        if (this.showInfo) {
            this.showSlideInfo(this.slider.activeSlides);
        }

        this.showInfoChange.emit(this.showInfo);
    }

    showSlideInfo(activeSlides: ActiveSlides) {
        const current = this.slider.slides[activeSlides.current];

        this.slideInfo = {
            url: current.url,
            title: current.title || titleFromUrl(current.url),
            description: current.description || '',
            urlExp: current.urlExp
        };
    }

    onNext() {
        this.slider.select(this.slider.activeSlides.next);
    }

    onPrevious() {
        this.slider.select(this.slider.activeSlides.previous);
    }
}
