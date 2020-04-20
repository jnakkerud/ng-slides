import {
    Component,
    Input,
    OnDestroy,
    HostListener,
    TemplateRef,
    ChangeDetectionStrategy,
    OnInit,
    ChangeDetectorRef,
    KeyValueDiffer,
    KeyValueDiffers
} from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { DataUrl } from '../data.service';

export enum KEY_CODE {
    RIGHT_ARROW = 'ArrowRight',
    LEFT_ARROW = 'ArrowLeft'
}

export enum Direction {
    Next,
    Prev
}

export enum Animation {
    Fade = 'fade',
    Slide = 'slide'
}

export interface ActiveSlides {
    previous: number;
    current: number;
    next: number;
}

function shuffle(array) {
    // tslint:disable-next-line: one-variable-per-declaration
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

@Component({
    selector: 'app-image-slider',
    templateUrl: `image-slider.component.html`,
    styleUrls: ['./image-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideState', [
            state('current', style({
                transform: 'translateX(0%)',
                zIndex: 1
            })),
            state('next', style({
                transform: 'translateX(100%)',
                zIndex: 1
            })),
            state('previous', style({
                transform: 'translateX(-100%)',
                zIndex: 1
            })),
            transition('current => previous', animate('400ms ease-out')),
            transition('next => current', animate('400ms ease-out')),
        ])
    ]
})
export class ImageSliderComponent implements OnInit, OnDestroy {

    @Input()
    slides: DataUrl[];

    @Input()
    animation: Animation = Animation.Fade;

    @Input()
    autoPlayDuration = 0;

    @Input()
    slideTemplateRef: TemplateRef<any>;

    @Input() shuffle = false;

    currentInterval;
    differ: KeyValueDiffer<ActiveSlides, any>;

    // for swipe event
    private swipeCoord?: [number, number];
    private swipeTime?: number;

    // tslint:disable-next-line: variable-name
    private _direction: Direction = Direction.Next;
    get direction() {
        return this._direction;
    }
    set direction(direction: Direction) {
        this._direction = direction;
    }

    // tslint:disable-next-line: variable-name
    private _activeSlides: ActiveSlides;
    get activeSlides() {
        return this._activeSlides;
    }
    set activeSlides(activeSlides: ActiveSlides) {
        this._activeSlides = activeSlides;
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case KEY_CODE.RIGHT_ARROW:
                this.select(this.activeSlides.next);
                break;
            case KEY_CODE.LEFT_ARROW:
                this.select(this.activeSlides.previous);
                break;
        }
    }

    constructor(private cd: ChangeDetectorRef, private differs: KeyValueDiffers) { }

    ngOnInit(): void {
        if (this.slides) {
            if (this.shuffle) {
                this.slides = shuffle(this.slides);
            }
            this.activeSlides = this.getPreviousCurrentNextIndexes(0);
            this.differ = this.differs.find(this.activeSlides).create();
            if (this.slides.length > 1 && this.autoPlayDuration > 0) {
                this.startTimer();
            }
        }
    }

    ngOnDestroy(): void {
        this.resetTimer();
        this.cd.detach();
    }

    select(index: number): void {
        Promise.resolve(null).then(() => {
            this.resetTimer();
            this.activeSlides = this.getPreviousCurrentNextIndexes(index);
            this.direction = this.getDirection(this.activeSlides.current, index);
            this.startTimer();
            if (this.differ.diff(this.activeSlides)) {
                this.cd.detectChanges();
            }
        });
    }

    getDirection(oldIndex: number, newIndex: number): Direction {
        const images = this.slides;

        if (oldIndex === images.length - 1 && newIndex === 0) {
            return Direction.Next;
        } else if (oldIndex === 0 && newIndex === images.length - 1) {
            return Direction.Prev;
        }

        return oldIndex < newIndex ? Direction.Next : Direction.Prev;
    }

    getPreviousCurrentNextIndexes(index: number): ActiveSlides {
        const images = this.slides;

        return {
            previous: (index === 0 ? images.length - 1 : index - 1) % images.length,
            current: index % images.length,
            next: (index === images.length - 1 ? 0 : index + 1) % images.length
        };
    }

    getAnimationSlideState(index: number) {
        return index === this.activeSlides.current ?
            'current' : index === this.activeSlides.next ? 'next' : index === this.activeSlides.previous ? 'previous' : '';
    }

    startTimer(): void {
        this.resetTimer();

        if (this.autoPlayDuration > 0) {
            this.currentInterval = setInterval(() => this.select(this.activeSlides.next), this.autoPlayDuration);
        }
    }

    resetTimer(): void {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
        }
    }

    /**
     * Swipe event handler
     * Reference from https://stackoverflow.com/a/44511007/2067646
     */
    swipe(e: TouchEvent, when: string): void {
        if (this.autoPlayDuration > 0) {
            return;
        }

        const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            if (duration < 1000 //
                && Math.abs(direction[0]) > 30 // Long enough
                && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
                if (direction[0] < 0) {
                    this.select(this.activeSlides.next);
                } else {
                    this.select(this.activeSlides.previous);
                }
            }
        }
    }

    slideContext(slide: DataUrl, index: number): DataUrl {
        if (!slide.urlExp) {
            // provide the default
            slide.urlExp = 'none';
        }
        if (index === this.activeSlides.current ||
            index === this.activeSlides.next ||
            index === this.activeSlides.previous) {
            const exp = `url('${slide.url}')`;
            if (slide.urlExp !== exp) {
                slide.urlExp = exp;
            }
        }
        return slide;
    }

}
