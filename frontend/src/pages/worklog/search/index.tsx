import React, {useRef, useEffect, useCallback} from 'react';
import Theme from './theme';

const particleCount = 300;
const particleSpeed = 0.25;
const particleSize = 2;
const maxDistance = 100;
const lightningColor = "blue";

class Particle {
    x: number;
    y: number;
    angle: number;
    speed: number;
    opacity: number;

    constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * particleSpeed;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    reset(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * particleSpeed;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    update(canvas: HTMLCanvasElement) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset(canvas);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,150 , 250, ${this.opacity})`;
        ctx.fill();
    }
}

const SearchPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrameId = useRef<number | null>(null);

    const setCanvasSize = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    }, []);

    const drawConnections = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        for (let i = 0; i < particles.current.length; i++) {
            for (let j = i + 1; j < particles.current.length; j++) {
                const dx = particles.current[i].x - particles.current[j].x;
                const dy = particles.current[i].y - particles.current[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles.current[i].x, particles.current[i].y);
                    ctx.lineTo(particles.current[j].x, particles.current[j].y);
                    ctx.strokeStyle = lightningColor;
                    ctx.lineWidth = 0.2 * (1 - distance / maxDistance);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.current.forEach((particle) => {
                    particle.update(canvas);
                    particle.draw(ctx);
                });

                drawConnections(ctx, canvas);

                animationFrameId.current = requestAnimationFrame(animate);
            }
        }
    }, [drawConnections]);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            setCanvasSize();
            window.addEventListener('resize', setCanvasSize);

            if (ctx) {
                particles.current = Array.from({length: particleCount}, () => new Particle(canvas));
                animate();
            }
        }

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [animate, setCanvasSize]);

    return (
        <div className="main-container"
             style={{position: 'relative', overflow: 'hidden', width: '80vw', height: '80vh'}}>
            <canvas id="myCanvas" ref={canvasRef} style={{position: 'absolute', top: 0, left: 0}}/>
            <div style={{position: 'relative', zIndex: 1}}> {/* 添加 zIndex 确保 Theme 显示在画布之上 */}
                <Theme/>
            </div>
        </div>
    );
};

export default SearchPage;
