import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataUrl } from './data.service';

@Injectable({providedIn: 'root'})
export class SoundService {

    audioContext: AudioContext;

    constructor(private httpClient: HttpClient) { }

    public play(urls: DataUrl[]) {
        // might be multiple urls, TODO random pick
        const url = urls[0].url;

        // create the audio context https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
        this.audioContext = new AudioContext();

        this.httpClient.get(url, {responseType: 'arraybuffer'}).subscribe(buffer => {
            this.createPlayer(buffer, this.audioContext);
        });
    }

    public stop() {
        if (this.audioContext) {
            this.audioContext.close().then(() => console.log('audio stopped'));
        }
    }

    public resume() {
        if (this.audioContext) {
            this.audioContext.resume().then(() => console.log('resume play'));
        }
    }

    private createPlayer(buffer: any, context: AudioContext) {
        context.decodeAudioData(buffer).then(audioData => {
            const source = this.audioContext.createBufferSource();
            source.buffer = audioData;
            source.connect(context.destination);

            // auto play
            source.start(0);
        });
    }
}
