import { Component, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private intervals: any[] = [];
  private observer: any = null;

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    // 1. Split headline
    const parts = [
      { t: "THE ", accent:false },
      { t: "SMART ", accent:false },
      { t: "ecommerce ", accent:true },
      { t: "THESAURUS", accent:false }
    ];
    const headline = document.getElementById('headline');
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
    const dot = document.getElementById('cursorDot');
    if (dot) {
      const moveHandler = (e: MouseEvent) => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      };
      window.addEventListener('mousemove', moveHandler as EventListener);
      this.intervals.push(() => window.removeEventListener('mousemove', moveHandler as EventListener));

      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => { dot.style.width='46px'; dot.style.height='46px'; });
        el.addEventListener('mouseleave', () => { dot.style.width='26px'; dot.style.height='26px'; });
      });
    }

    // 3. Parallax tilt on the circle collage
    const collage = document.getElementById('collage');
    const ring = document.getElementById('collageRing');
    if (collage && ring) {
      collage.style.perspective = '900px';
      const moveCollage = (e: MouseEvent) => {
        const rect = collage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        ring.style.transform = `rotateY(${x * 14}deg) rotateX(${ -y * 14}deg)`;
      };
      collage.addEventListener('mousemove', moveCollage as EventListener);
      collage.addEventListener('mouseleave', () => { ring.style.transform = 'rotateY(0) rotateX(0)'; });
    }

    // 4. Scroll-reveal
    const revealEls = document.querySelectorAll('.signup-card, .collage, .audience-copy, .feature-card');
    if (revealEls.length > 0 && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            (entry.target as HTMLElement).style.animation = 'fade-up .8s cubic-bezier(.16,1,.3,1) both';
            this.observer.unobserve(entry.target);
          }
        });
      }, { threshold:0.15 });
      revealEls.forEach(el => this.observer.observe(el));
    }

    // 5. Rotating tagline
    const taglines = [
      "Everything you need, delivered seamlessly.",
      "The next generation of ecommerce, built for speed.",
      "Premium shopping. Effortless selling. Lightning-fast delivery.",
      "Your world of products, just one tap away."
    ];
    const rotator = document.getElementById('rotator');
    if (rotator) {
      let ti = 0;
      const showTagline = (i: number) => {
        const line = document.createElement('div');
        line.className = 'rotator-line';
        line.textContent = taglines[i];
        rotator.appendChild(line);
        requestAnimationFrame(() => line.classList.add('active'));
        const prev = rotator.querySelectorAll('.rotator-line');
        if(prev.length > 1){
          const old = prev[0];
          old.classList.remove('active');
          old.classList.add('leaving');
          setTimeout(() => old.remove(), 650);
        }
      };
      showTagline(0);
      const interval = setInterval(() => { ti = (ti + 1) % taglines.length; showTagline(ti); }, 3200);
      this.intervals.push(() => clearInterval(interval));
    }

    // 6. Cycling CTA button copy
    const ctaCopy = ["Start shopping now", "Join the platform", "Experience the future", "Get started for free"];
    let ci = 0;
    const ctaBtn = document.getElementById('ctaBtn');
    if (ctaBtn) {
      const ctaInterval = setInterval(() => {
        ci = (ci + 1) % ctaCopy.length;
        ctaBtn.style.opacity = '0';
        setTimeout(() => { ctaBtn.textContent = ctaCopy[ci]; ctaBtn.style.opacity = '1'; }, 250);
      }, 2800);
      ctaBtn.style.transition = 'opacity .25s ease';
      this.intervals.push(() => clearInterval(ctaInterval));
    }
  }

  ngOnDestroy() {
    this.intervals.forEach(fn => fn());
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
