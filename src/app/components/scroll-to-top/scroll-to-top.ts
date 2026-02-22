import { Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-scroll-to-top',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './scroll-to-top.html',
    styleUrls: ['./scroll-to-top.scss']
})
export class ScrollToTopComponent {
    isVisible = false;
    private isBrowser: boolean;

    private platformId = inject(PLATFORM_ID);

    constructor() {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    @HostListener('window:scroll')
    checkScroll() {
        if (this.isBrowser) {
            this.isVisible = window.scrollY > 300;
        }
    }

    scrollToTop() {
        if (this.isBrowser) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}
