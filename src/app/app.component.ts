import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nak-slideshow';

  content = 'content';

  slides = [
    {
      url: 'https://source.unsplash.com/1600x900/?nature,water'
    },
    {
      url: 'https://source.unsplash.com/1600x1600/?nature,forest'
    }
  ];

  onForward() {
    this.content = 'forward';
  }

  onBack() {
    this.content = 'back';
  }
}
