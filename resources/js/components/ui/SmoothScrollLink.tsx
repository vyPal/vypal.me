import React from 'react';
import { router } from '@inertiajs/react';

interface SmoothScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  duration?: number; // milliseconds
  offset?: number; // pixels to offset from target (useful for fixed headers)
  onClick?: () => void;
}

export default function SmoothScrollLink({
  href,
  children,
  className = '',
  duration = 800,
  offset = 0,
  onClick
}: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    onClick?.();

    // Parse the href to separate the page path and hash
    const [pagePath, hash] = href.includes('#') ?
      [href.split('#')[0], href.split('#')[1]] :
      [window.location.pathname, href.replace(/.*#/, '')];

    const targetId = hash || href.replace(/.*#/, '');
    const isCurrentPage = pagePath === '' || window.location.pathname === pagePath;

    // If we're already on the target page, just scroll
    if (isCurrentPage) {
      const element = document.getElementById(targetId);

      if (element) {
        // Calculate where to scroll to
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;

        let startTime: number | null = null;

        // Smooth scroll animation function
        function animation(currentTime: number) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);

          // Easing function - easeInOutCubic
          const ease = (t: number) =>
            t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

          window.scrollTo(0, startPosition + distance * ease(progress));

          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }

        requestAnimationFrame(animation);

        // Update URL hash after scrolling
        if (history.pushState) {
          history.pushState(null, '', `${pagePath}#${targetId}`);
        } else {
          window.location.hash = targetId;
        }
      }
    } else {
      // If we need to navigate to a different page first
      // Use Inertia to navigate, and then scroll to the hash after page load
      router.visit(href, {
        onSuccess: () => {
          // Wait for DOM to be ready after navigation
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
