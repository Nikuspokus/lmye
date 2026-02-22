import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, Event, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ScrollToTopComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'la-marque-y-est';

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.anchor) {
        // Delay slightly so layout can compute, then scroll to the element considering header offset
        setTimeout(() => {
          this.viewportScroller.setOffset([0, 92]);
          this.viewportScroller.scrollToAnchor(e.anchor!);
        }, 100);
      } else if (e.position) {
        this.viewportScroller.scrollToPosition(e.position);
      } else {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
