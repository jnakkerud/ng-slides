import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DataUrl {
    url: string;
    title?: string;
    description?: string;
    position?: string;     // background-position
}

export interface ImageSliderConfig {
    hideNavigation?: boolean;
    animation?: string; // slide | fade
    autoPlayDuration?: number;
    shuffle?: boolean;
}

export interface SlidesConfig {
    slides: DataUrl[];
    sounds?: DataUrl[];
    imageSliderConfig?: ImageSliderConfig;
}

export class SlidesModel {
    slides: DataUrl[];
    sounds?: DataUrl[];
    imageSliderConfig?: ImageSliderConfig;

    constructor(config: SlidesConfig) {
        this.slides = config.slides;
        this.sounds = config.sounds || null;
        this.imageSliderConfig = config.imageSliderConfig || {
            hideNavigation: false,
            animation: 'slide',
            autoPlayDuration: 0,
            shuffle: false
        };
    }
}

function getConfigUrl() {
    const queryString = window.location.search;
    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.has('config')) {
            // and decode it
            return decodeURI(urlParams.get('config'));
        }
    }
    return null;
}

const DEFAULT_CONFIG = `
    {
        "slides": [
            {
                "url": "https://source.unsplash.com/1600x900/?nature,water"
              },
              {
                "url": "https://source.unsplash.com/1600x1600/?nature,forest"
            }
        ]
    }
`;

@Injectable({providedIn: 'root'})
export class DataService {

    constructor(private httpClient: HttpClient) { }

    public getSlidesModel(): Promise<SlidesModel> {
        return new Promise<SlidesModel>((resolve) => {
            const configUrl = getConfigUrl();
            if (configUrl) {
                this.getConfigFromUrl(configUrl).subscribe((config: SlidesConfig) => {
                    resolve(new SlidesModel(config));
                });
            } else {
                const config = JSON.parse(DEFAULT_CONFIG) as SlidesConfig;
                resolve(new SlidesModel(config));
            }
        });
    }

    private getConfigFromUrl(url: string) {
        return this.httpClient.get<SlidesConfig>(url);
    }
}
