import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { ActiveSlides } from '../image-slider/image-slider.component';
import { DataUrl } from '../data.service';
import { ImageSliderComponent } from '../image-slider/image-slider.component';
import { Subscription } from 'rxjs';
import { SoundService } from '../sound.service';

function titleFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
}

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'nav-bar',
    templateUrl: 'nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements AfterViewInit, OnDestroy {

    @Input() slider: ImageSliderComponent;

    @Output() showInfoChange = new EventEmitter<boolean>();

    showInfo = false;

    slideInfo: DataUrl;

    private slidesChangeSubscription = Subscription.EMPTY;

    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private soundService: SoundService) {
        iconRegistry.addSvgIcon(
            'info-icon',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/img/info-icon.svg'));
    }

    ngOnDestroy(): void {
        this.slidesChangeSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.slidesChangeSubscription = this.slider.activeSlidesChange.subscribe(() => {
            if (this.slider.activeSlides) {
                this.showSlideInfo(this.slider.activeSlides);
            }
        });
    }

    toggleInfo() {
        this.showInfo = !this.showInfo;
        this.handleInfoChange();
    }

    private handleInfoChange() {
        if (this.showInfo) {
            // stop auto play
            if (this.slider.autoPlayDuration > 0) {
                this.slider.autoPlayDuration = 0;
            }
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

    toggleSound() {
        if (this.soundPlaying) {
            this.soundService.suspend();
        } else {
            this.soundService.nextSound();
        }
    }

    get soundPlaying(): boolean {
        return this.soundService.isPlaying();
    }

    get canPlaySound(): boolean {
        return this.soundService.canPlay();
    }
}
