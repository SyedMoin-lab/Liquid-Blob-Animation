import { createCoordsTransformer, pointsInPath, spline } from '@georgedoescode/generative-utils';
import gsap from 'gsap';
import Head from 'next/head';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  useEffect(() => {
    const paths = document.querySelectorAll('.mask-path');

    function createLiquidPath(path, options) {
      const svgPoints = pointsInPath(path, options.detail);
      const originPoints = svgPoints.map(({ x, y }) => ({ x, y }));
      const liquidPoints = svgPoints.map(({ x, y }) => ({ x, y }));

      const mousePos = { x: 0, y: 0 };
      const transformCoords = createCoordsTransformer(path.closest('svg'));

      const pointDistance = Math.hypot(
        originPoints[0].x - originPoints[1].x,
        originPoints[0].y - originPoints[1].y
      );
      const maxDist = {
        x: options.axis.includes('x') ? pointDistance / 2 : 0,
        y: options.axis.includes('y') ? pointDistance / 2 : 0,
      };

      gsap.ticker.add(() => {
        gsap.set(path, {
          attr: {
            d: spline(liquidPoints, options.tension, options.close),
          },
        });
      });

      window.addEventListener('mousemove', (e) => {
        const { x, y } = transformCoords(e);

        mousePos.x = x;
        mousePos.y = y;

        liquidPoints.forEach((point, index) => {
          const pointOrigin = originPoints[index];
          const distX = Math.abs(pointOrigin.x - mousePos.x);
          const distY = Math.abs(pointOrigin.y - mousePos.y);

          if (distX <= options.range.x && distY <= options.range.y) {
            const difference = {
              x: pointOrigin.x - mousePos.x,
              y: pointOrigin.y - mousePos.y,
            };

            const target = {
              x: pointOrigin.x + difference.x,
              y: pointOrigin.y + difference.y,
            };

            const x = gsap.utils.clamp(
              pointOrigin.x - maxDist.x,
              pointOrigin.x + maxDist.x,
              target.x
            );

            const y = gsap.utils.clamp(
              pointOrigin.y - maxDist.y,
              pointOrigin.y + maxDist.y,
              target.y
            );

            gsap.to(point, {
              x: x,
              y: y,
              ease: 'sine',
              overwrite: true,
              duration: 0.175,
              onComplete() {
                gsap.to(point, {
                  x: pointOrigin.x,
                  y: pointOrigin.y,
                  ease: 'elastic.out(1, 0.3)',
                  duration: 1.25,
                });
              },
            });
          }
        });
      });
    }

    const prefersReducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (prefersReducedMotionQuery && !prefersReducedMotionQuery.matches) {
      paths.forEach(path => {
        createLiquidPath(path, {
          detail: 16,
          tension: 1,
          close: true,
          range: {
            x: 20,
            y: 20,
          },
          axis: ['x', 'y'],
        });
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Liquid Blob Animation</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap" />
      </Head>
      <h1>Welcome to Liquid Animation</h1>
      <div className={styles.container}>
        {/* Circle Shape with Liquid Animation */}
        <svg viewBox="0 0 200 200" className={styles.blob}>
          <defs>
            <mask id="blob-mask-circle">
              <path className="mask-path" d="M100,10 A90,90 0 1,1 100,190 A90,90 0 1,1 100,10 Z" fill="#fff" />
            </mask>
          </defs>
          <image
            x="10"
            y="10"
            width="180"
            height="180"
            href="https://images.unsplash.com/photo-1719937050445-098888c0625e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            mask="url(#blob-mask-circle)"
          />
        </svg>

        {/* Square Shape with Liquid Animation */}
        <svg viewBox="0 0 200 200" className={styles.blob}>
          <defs>
            <mask id="blob-mask-square">
              <path className="mask-path" d="M0,0 H200 V200 H0 Z" fill="#fff" />
            </mask>
          </defs>
          <image
            width="200"
            height="200"
            href="https://images.unsplash.com/photo-1720048171419-b515a96a73b8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            mask="url(#blob-mask-square)"
          />
        </svg>

        {/* Triangle Shape with Liquid Animation */}
        <svg viewBox="0 0 200 200" className={styles.blob}>
          <defs>
            <mask id="blob-mask-triangle">
              <path className="mask-path" d="M100,10 L190,190 H10 Z" fill="#fff" />
            </mask>
          </defs>
          <image
            width="200"
            height="200"
            href="https://plus.unsplash.com/premium_photo-1722002815586-5eb05f11449c?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            mask="url(#blob-mask-triangle)"
          />
        </svg>

        {/* Pentagon Shape with Liquid Animation */}
        <svg viewBox="0 0 200 200" className={styles.blob}>
          <defs>
            <mask id="blob-mask-pentagon">
              <path className="mask-path" d="M100,10 L190,80 L160,190 L40,190 L10,80 Z" fill="#fff" />
            </mask>
          </defs>
          <image
            width="200"
            height="200"
            href="https://plus.unsplash.com/premium_photo-1682091872078-46c5ed6a006d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            mask="url(#blob-mask-pentagon)"
          />
        </svg>

        {/* Hexagon Shape with Liquid Animation */}
        <svg viewBox="0 0 200 200" className={styles.blob}>
          <defs>
            <mask id="blob-mask-hexagon">
              <path className="mask-path" d="M100,10 L190,60 L190,140 L100,190 L10,140 L10,60 Z" fill="#fff" />
            </mask>
          </defs>
          <image
            width="200"
            height="200"
            href="https://images.unsplash.com/photo-1709884732294-90379fee354c?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            mask="url(#blob-mask-hexagon)"
          />
        </svg>
      </div>
    </>
  );
}
