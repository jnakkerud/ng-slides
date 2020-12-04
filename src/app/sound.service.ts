import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataUrl } from './data.service';

export enum SoundState {
    Suspended = 'suspended',
    Running = 'running',
    Closed = 'closed',
    None = 'none'
}

@Injectable({providedIn: 'root'})
export class SoundService {

    audioContext: AudioContext;

    currentSound: DataUrl;
    sounds: DataUrl[];

    constructor(private httpClient: HttpClient) { }

    public load(sounds: DataUrl[]) {
        this.sounds = sounds;
        // play the first sound
        this.play(this.sounds[0]);
    }

    public play(dataUrl: DataUrl) {
        this.currentSound = dataUrl;
        Promise.resolve(null).then(() => {
            this.playSound(dataUrl.url);
        });
    }

    private playSound(url: string) {
        // create the audio context https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
        // tslint:disable-next-line: no-string-literal
        this.audioContext =  new (window.AudioContext || window['webkitAudioContext'])();

        this.httpClient.get(url, {responseType: 'arraybuffer'}).subscribe(buffer => {
            this.createPlayer(buffer, this.audioContext);
        });
    }

    public nextSound() {
        if (this.audioContext && this.sounds) {
            const current = this.sounds.indexOf(this.currentSound);
            const next = (current + 1) % (this.sounds.length);
            this.play(this.sounds[next]);
        }
    }

    public close() {
        if (this.audioContext) {
            this.audioContext.close().then(() => console.log('audio closed'));
        }
    }

    public resume() {
        if (this.audioContext) {
            this.audioContext.resume().then(() => console.log('resume play'));
        }
    }

    public suspend() {
        if (this.audioContext) {
            this.audioContext.suspend().then(() => console.log('suspend play'));
        }
    }

    /**
     *   suspended, running, closed or none
     *   https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state
     */
    public getState(): SoundState {
        let state = SoundState.None;
        if (this.audioContext) {
            state = this.audioContext.state as SoundState;
        }
        return state;
    }

    public canPlay(): boolean {
        return !!this.audioContext;
    }

    public isPlaying(): boolean {
        return this.getState() === SoundState.Running;
    }

    private createPlayer(buffer: any, context: AudioContext) {
        // Using the older syntax to support Safari
        // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
        context.decodeAudioData(buffer, audioData => {
            const source = this.audioContext.createBufferSource();
            source.onended = () => {
                this.close();
                this.nextSound();
            };

            source.buffer = audioData;
            source.connect(context.destination);

            // auto play
            source.start(0);
        });
    }
}
