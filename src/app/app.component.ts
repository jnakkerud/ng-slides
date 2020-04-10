import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nak-slideshow';

  content = 'content';

  onForward() {
    this.content = 'forward';
  }

  onBack() {
    this.content = 'back';
  }
}
