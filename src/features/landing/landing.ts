import { Component, AfterViewInit, OnDestroy, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignupComponent } from '../auth/signup';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, SignupComponent],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private intervals: any[] = [];
  private io?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // 1. Split headline into animated characters
    const parts = [
      { t: "THE ", accent: false },
      { t: "SMART ", accent: false },
      { t: "ecommerce ", accent: true },
      { t: "THESAURUS", accent: false }
    ];
    const headline = this.el.nativeElement.querySelector('#headline');
    if (headline) {
      let delay = 0;
      parts.forEach(part => {
        const wrap = document.createElement('span');
        if(part.accent) wrap.classList.add('accent');
        [...part.t].forEach(ch => {
          const s = document.createElement('span');
          s.className = 'char' + (ch === ' ' ? ' space' : '');
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          s.style.animationDelay = delay + 's';
          delay += 0.035;
          wrap.appendChild(s);
        });
        headline.appendChild(wrap);
      });
    }

    // 2. Custom cursor dot
    const dot = this.el.nativeElement.querySelector('#cursorDot');
    if (dot) {
      const mouseMoveFn = (e: MouseEvent) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      };
      window.addEventListener('mousemove', mouseMoveFn);

      const interactiveEls = this.el.nativeElement.querySelectorAll('a, button');
      interactiveEls.forEach((el: HTMLElement) => {
        el.addEventListener('mouseenter', () => { dot.style.width = '46px'; dot.style.height = '46px'; });
        el.addEventListener('mouseleave', () => { dot.style.width = '26px'; dot.style.height = '26px'; });
      });
    }

    // 3. Parallax tilt on the circle collage
    const collage = this.el.nativeElement.querySelector('#collage');
    const ring = this.el.nativeElement.querySelector('#collageRing');
    if (collage && ring) {
      collage.style.perspective = '900px';
      collage.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = collage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        ring.style.transform = `rotateY(${x * 14}deg) rotateX(${ -y * 14}deg)`;
      });
      collage.addEventListener('mouseleave', () => { ring.style.transform = 'rotateY(0) rotateX(0)'; });
    }

    // 4. Scroll-reveal for sections below the fold
    const revealEls = this.el.nativeElement.querySelectorAll('.signup-card, .collage, .audience-copy, .feature-card, app-signup');
    if (revealEls.length > 0 && typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animation = 'fade-up .8s cubic-bezier(.16,1,.3,1) both';
            this.io!.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach((el: Element) => this.io!.observe(el));
    }

    // 5. Rotating tagline through the campaign headline options
    const taglines = [
      "Everything you need, delivered seamlessly.",
      "The next generation of ecommerce, built for speed.",
      "Premium shopping. Effortless selling. Lightning-fast delivery.",
      "Your world of products, just one tap away."
    ];
    const rotator = this.el.nativeElement.querySelector('#rotator');
    if (rotator) {
      let ti = 0;
      const showTagline = (i: number) => {
        const line = document.createElement('div');
        line.className = 'rotator-line';
        line.textContent = taglines[i];
        rotator.appendChild(line);
        requestAnimationFrame(() => line.classList.add('active'));
        const prev = rotator.querySelectorAll('.rotator-line');
        if (prev.length > 1) {
          const old = prev[0];
          old.classList.remove('active');
          old.classList.add('leaving');
          setTimeout(() => old.remove(), 650);
        }
      };
      showTagline(0);
      const tagInterval = setInterval(() => { ti = (ti + 1) % taglines.length; showTagline(ti); }, 3200);
      this.intervals.push(tagInterval);
    }

    // 6. Cycling CTA button copy
    const ctaCopy = ["Start shopping now", "Join the platform", "Experience the future", "Get started for free"];
    let ci = 0;
    const ctaBtn = this.el.nativeElement.querySelector('#ctaBtn');
    if (ctaBtn) {
      const ctaInterval = setInterval(() => {
        ci = (ci + 1) % ctaCopy.length;
        ctaBtn.style.opacity = '0';
        setTimeout(() => { ctaBtn.textContent = ctaCopy[ci]; ctaBtn.style.opacity = '1'; }, 250);
      }, 2800);
      ctaBtn.style.transition = 'opacity .25s ease';
      this.intervals.push(ctaInterval);
      
      ctaBtn.addEventListener('click', () => {
        const signupSection = this.el.nativeElement.querySelector('#signup-section');
        if (signupSection) {
          signupSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  ngOnDestroy() {
    this.intervals.forEach(clearInterval);
    if (this.io) {
      this.io.disconnect();
    }
  }
}
