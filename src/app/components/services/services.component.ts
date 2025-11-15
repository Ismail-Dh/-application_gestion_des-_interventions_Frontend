import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import VanillaTilt from  'vanilla-tilt';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statsSection', { static: true }) statsSection!:ElementRef;;
  
  private particleCanvas?: HTMLCanvasElement;
  private animationFrameId?: number;
  private readonly environmentInjector = inject(EnvironmentInjector);

  ngOnInit() {
    this.initLiquidFill();
  }

  ngAfterViewInit() {
    runInInjectionContext(this.environmentInjector, () => {
      this.initTiltEffects();
      
      // Vérification du contexte navigateur avant d'initialiser les particules
      if (typeof document !== 'undefined') {
        this.initParticles();
      }
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initTiltEffects() {
    try {
      const tiltElements = this.statsSection.nativeElement.querySelectorAll('[data-tilt]');
      VanillaTilt.init(tiltElements, {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2
      });
    } catch (error) {
      console.error('Erreur VanillaTilt:', error);
    }
  }

  private initLiquidFill() {
    if (typeof document === 'undefined') return;

    setTimeout(() => {
      const liquidElements = document.querySelectorAll('.stat-liquid');
      liquidElements.forEach(el => {
        const value = el.getAttribute('data-value');
        if (value) {
          (el as HTMLElement).style.height = `${value}%`;
        }
      });
    }, 100);
  }

  private initParticles() {
    this.particleCanvas = this.statsSection.nativeElement.querySelector('.stat-particles');
    if (!this.particleCanvas) return;

    const ctx = this.particleCanvas.getContext('2d');
    if (!ctx) return;

    // Configuration responsive
    this.resizeCanvas();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    // Initialisation des particules
    const particles = this.createParticles();

    // Animation
    const animate = () => {
      if (!this.particleCanvas || !ctx) return;
      
      ctx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
      
      particles.forEach(p => {
        this.drawParticle(ctx, p);
        this.updateParticlePosition(p);
      });

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  private createParticles() {
    const particleCount = 50;
    return Array.from({ length: particleCount }, () => ({
      x: Math.random() * this.particleCanvas!.width,
      y: Math.random() * this.particleCanvas!.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1
    }));
  }

  private drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
    ctx.fillStyle = `rgba(0, 168, 118, ${Math.random() * 0.5 + 0.1})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  private updateParticlePosition(p: Particle) {
    p.x += p.speedX;
    p.y += p.speedY;
    
    if (p.x < 0 || p.x > this.particleCanvas!.width) p.speedX *= -1;
    if (p.y < 0 || p.y > this.particleCanvas!.height) p.speedY *= -1;
  }

  private resizeCanvas() {
    if (this.particleCanvas) {
      this.particleCanvas.width = this.particleCanvas.offsetWidth;
      this.particleCanvas.height = this.particleCanvas.offsetHeight;
    }
  }
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}
