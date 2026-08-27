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
  private cleanupFns: (() => void)[] = [];
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    // CURSOR GLOW
    const cursorGlow = document.querySelector<HTMLElement>('.cursor-glow');
    if (cursorGlow) {
      const onMouseMove = (e: MouseEvent) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
      };
      window.addEventListener('mousemove', onMouseMove);
      this.cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove));
    }

    // SCROLL REVEAL
    const revealEls = document.querySelectorAll('.reveal, .reveal-card');
    if (revealEls.length && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.observer!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      revealEls.forEach((el) => this.observer!.observe(el));
    } else {
      revealEls.forEach((el) => (el as HTMLElement).classList.add('visible'));
    }

    // MAGNETIC BUTTONS
    const magneticEls = document.querySelectorAll<HTMLElement>('.magnetic');
    magneticEls.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      };
      const onLeave = () => { el.style.transform = 'translate(0,0)'; };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      this.cleanupFns.push(() => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    });

    // 3D CARD TILT
    const tiltCards = document.querySelectorAll<HTMLElement>('.tilt');
    tiltCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rY = (x - 0.5) * 12;
        const rX = (0.5 - y) * 12;
        card.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.04)`;
      };
      const onLeave = () => { card.style.transform = ''; };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      this.cleanupFns.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    // ROLE TABS
    const roleTabs = document.querySelectorAll<HTMLElement>('.role-tab');
    const roleDisplays = document.querySelectorAll<HTMLElement>('.role-display');
    roleTabs.forEach((tab) => {
      const onClick = () => {
        const role = (tab as any).dataset['role'];
        roleTabs.forEach((t) => t.classList.remove('active'));
        roleDisplays.forEach((d) => d.classList.remove('active'));
        tab.classList.add('active');
        const selected = document.querySelector<HTMLElement>(`.${role}-role`);
        if (selected) selected.classList.add('active');
      };
      tab.addEventListener('click', onClick);
      this.cleanupFns.push(() => tab.removeEventListener('click', onClick));
    });

    // FEED CATEGORY BUTTONS
    const feedBtns = document.querySelectorAll<HTMLElement>('.feed-toolbar button:not(.filter-btn)');
    feedBtns.forEach((btn) => {
      const onClick = () => {
        feedBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      };
      btn.addEventListener('click', onClick);
      this.cleanupFns.push(() => btn.removeEventListener('click', onClick));
    });

    // SAVE / HEART BUTTONS
    const heartBtns = document.querySelectorAll<HTMLElement>('.heart-btn, .pin-actions button');
    heartBtns.forEach((btn) => {
      const onClick = () => {
        btn.classList.toggle('saved');
        const icon = btn.querySelector('i');
        if (icon?.classList.contains('fa-regular')) {
          icon.classList.replace('fa-regular', 'fa-solid');
        }
      };
      btn.addEventListener('click', onClick);
      this.cleanupFns.push(() => btn.removeEventListener('click', onClick));
    });

    // NAVBAR SCROLL
    const navbar = document.querySelector<HTMLElement>('.navbar');
    const onScroll = () => {
      if (!navbar) return;
      if (window.scrollY > 80) {
        navbar.style.width = 'min(1200px, 90%)';
        navbar.style.background = 'rgba(9,9,13,.95)';
      } else {
        navbar.style.width = 'min(1400px, 94%)';
        navbar.style.background = 'rgba(12,12,18,.72)';
      }
    };
    window.addEventListener('scroll', onScroll);
    this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));

    // HOTSPOTS
    const hotspots = document.querySelectorAll<HTMLElement>('.hotspot');
    const lookItems = document.querySelectorAll<HTMLElement>('.look-item');
    hotspots.forEach((hotspot, i) => {
      const onClick = () => {
        lookItems.forEach((item) => { item.style.background = 'transparent'; });
        if (lookItems[i]) {
          lookItems[i].style.background = 'rgba(200,255,61,.08)';
          lookItems[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
      hotspot.addEventListener('click', onClick);
      this.cleanupFns.push(() => hotspot.removeEventListener('click', onClick));
    });

    // BACK TO TOP
    const topLink = document.querySelector<HTMLElement>('.footer-links a[href="#"]');
    if (topLink) {
      const onClick = (e: Event) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      topLink.addEventListener('click', onClick);
      this.cleanupFns.push(() => topLink.removeEventListener('click', onClick));
    }

    // REDUCED MOTION
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-card').forEach((el) => {
        el.classList.add('visible');
      });
    }
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
    if (this.observer) this.observer.disconnect();
  }
}
