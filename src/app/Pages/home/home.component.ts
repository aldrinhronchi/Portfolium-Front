import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../shared/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild("textElement") textElement!: ElementRef;
  @ViewChild("blinkElement") blinkElement!: ElementRef;

  @Input() wordArray: string[] = [
    'I am a Full Stack Developer.',
    'I build modern web applications.',
    'I create efficient backend systems.',
    'I design intuitive user interfaces.'
  ];
  @Input() fontSize = "1.5rem";
  @Input() blinkWidth = "3px";
  @Input() typingSpeedMilliseconds = 120;
  @Input() deleteSpeedMilliseconds = 80;

  private i = 0;
  private themeSubscription?: Subscription;

  constructor(
    private renderer: Renderer2,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Escutar mudanças de tema
    this.themeSubscription = this.themeService.isDarkTheme$.subscribe(() => {
      if (this.textElement && this.blinkElement) {
        this.updateColors();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initVariables();
    this.typingEffect();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private initVariables(): void {
    // Usar CSS custom properties em vez de cores hardcoded
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "color",
      "var(--text-primary)"
    );
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "font-size",
      this.fontSize
    );
    this.renderer.setStyle(
      this.textElement.nativeElement, 
      "font-family", 
      "'Space Grotesk', monospace"
    );
    this.renderer.setStyle(
      this.textElement.nativeElement, 
      "font-weight", 
      "500"
    );

    this.renderer.setStyle(
      this.blinkElement.nativeElement,
      "border-right-width",
      this.blinkWidth
    );
    this.renderer.setStyle(
      this.blinkElement.nativeElement,
      "border-right-color",
      "var(--accent-primary)"
    );
    this.renderer.setStyle(
      this.blinkElement.nativeElement,
      "font-size",
      this.fontSize
    );
    this.renderer.setStyle(
      this.blinkElement.nativeElement,
      "box-shadow",
      "0 0 5px var(--accent-primary)"
    );
  }

  private updateColors(): void {
    // Atualizar cores quando o tema mudar
    this.renderer.setStyle(
      this.textElement.nativeElement,
      "color",
      "var(--text-primary)"
    );
    this.renderer.setStyle(
      this.blinkElement.nativeElement,
      "border-right-color",
      "var(--accent-primary)"
    );
    this.renderer.setStyle(
      this.blinkElement.nativeElement,
      "box-shadow",
      "0 0 5px var(--accent-primary)"
    );
  }

  private typingEffect(): void {
    const word = this.wordArray[this.i].split("");
    const loopTyping = () => {
      if (word.length > 0) {
        this.textElement.nativeElement.innerHTML += word.shift();
      } else {
        setTimeout(() => {
          this.deletingEffect();
        }, 2000); // Pausa antes de deletar
        return;
      }
      setTimeout(loopTyping, this.typingSpeedMilliseconds);
    };
    loopTyping();
  }

  private deletingEffect(): void {
    const word = this.wordArray[this.i].split("");
    const loopDeleting = () => {
      if (word.length > 0) {
        word.pop();
        this.textElement.nativeElement.innerHTML = word.join("");
      } else {
        if (this.wordArray.length > this.i + 1) {
          this.i++;
        } else {
          this.i = 0;
        }
        setTimeout(() => {
          this.typingEffect();
        }, 500); // Pausa antes de começar a digitar novamente
        return false;
      }
      setTimeout(loopDeleting, this.deleteSpeedMilliseconds);
      return true;
    };
    loopDeleting();
  }
}
