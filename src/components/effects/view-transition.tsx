'use client';

import { unstable_ViewTransition as ViewTransition } from 'react';
import { cn } from 'utilities';

/**
 * Applies a slide animation to its children during view transitions.
 *
 * Wraps content with a slide-in and slide-out animation, configurable by direction, distance, and duration, using the experimental view transition API.
 *
 * @param name - Identifier for the transition animation.
 * @param children - Content to be animated during the transition.
 * @param direction - Direction of the slide animation, either 'horizontal' or 'vertical'. Defaults to 'horizontal'.
 * @param distance - Pixel distance for the slide movement. Defaults to 100.
 * @param duration - Duration of the animation in milliseconds. Defaults to 200.
 *
 * @remark
 * Relies on the experimental `unstable_ViewTransition` API and may not be supported in all environments.
 */
export function SlideTransition({
	name,
	children,
	direction = 'horizontal',
	distance = 100,
	duration = 200,
}: {
	name: string;
	children: React.ReactNode;
	direction?: 'horizontal' | 'vertical';
	distance?: number;
	duration?: number;
}) {
	const isHorizontal = direction === 'horizontal';
	const startName = isHorizontal ? 'left' : 'up';
	const endName = isHorizontal ? 'right' : 'down';
	const startPosition = isHorizontal ? `-${distance}px 0` : `0 ${distance}px`;
	const endPosition = isHorizontal ? `${distance}px 0` : `0 100%`;

	return (
		<>
			<style>
				{`
          @keyframes ${name}-enter-slide-${startName} {
            0% {
              opacity: 0;
              translate: ${startPosition};
            }
            100% {
              opacity: 1;
              translate: 0 0;
            }
          }

          @keyframes ${name}-exit-slide-${endName} {
            0% {
              opacity: 1;
              translate: 0 0;
            }
            100% {
              opacity: 0;
              translate: ${endPosition};
            }
          }

          ::view-transition-new(.${name}-enter-slide-${startName}) {
            animation: ${name}-enter-slide-${startName} ease-in ${duration}ms;
          }
          ::view-transition-old(.${name}-exit-slide-${endName}) {
            animation: ${name}-exit-slide-${endName} ease-out ${duration}ms;
          }
        `}
			</style>
			<ViewTransition name={name}>{children}</ViewTransition>
		</>
	);
}
