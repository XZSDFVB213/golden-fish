import {
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent
  implements OnInit, OnDestroy
{
  activeSlide = signal(0);

  slides = [
    {
      title: 'Доставка свежей рыбы',
      accent: 'за 60 минут',
      description:
        'Бесплатная доставка при заказе от 5000 ₽',
      button: 'Заказать',
      link: '/products',
      image: 'assets/images/hero-salmon.webp',
      variant: 'fish',
    },
  
    {
      title: 'Морепродукты',
      accent: 'к вашему столу',
      description:
        'Креветки, мидии, икра и многое другое',
      button: 'Смотреть каталог',
      link: '/products',
      image: 'assets/images/hero-seafood.webp',
      variant: 'seafood',
    },
  
    {
      title: 'Наши полуфабрикаты',
      accent: 'как у мамы',
      description:
        'Домашние полуфабрикаты от «Золотой рыбки» — вкусно, удобно и по-домашнему',
      button: 'Смотреть товары',
      link: '/products',
      image: 'assets/images/kak-u-mamy.webp',
      variant: 'semi',
    },
  ];

  private intervalId?: ReturnType<
    typeof setInterval
  >;

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  next() {
    this.activeSlide.update(
      index =>
        (index + 1) %
        this.slides.length,
    );

    this.restartAutoplay();
  }

  previous() {
    this.activeSlide.update(
      index =>
        (index - 1 +
          this.slides.length) %
        this.slides.length,
    );

    this.restartAutoplay();
  }

  goTo(index: number) {
    this.activeSlide.set(index);

    this.restartAutoplay();
  }

  private startAutoplay() {
    this.intervalId =
      setInterval(() => {
        this.activeSlide.update(
          index =>
            (index + 1) %
            this.slides.length,
        );
      }, 5000);
  }

  private stopAutoplay() {
    if (this.intervalId) {
      clearInterval(
        this.intervalId,
      );
    }
  }

  private restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}