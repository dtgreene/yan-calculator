import React, { useState, useRef } from 'react';
import cx from 'classnames';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useFocus,
  useDismiss,
  useTransitionStyles,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
  arrow,
} from '@floating-ui/react';

import InfoIcon from '../icons/Info';

const ARROW_HEIGHT = 7;
const TOOLTIP_MARGIN = 2;

export const InfoTooltip = ({ className, children, useMaxWidth = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(ARROW_HEIGHT + TOOLTIP_MARGIN),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  });
  const { isMounted, styles } = useTransitionStyles(context);

  // Event listeners to change the open state
  const click = useClick(context);
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    focus,
    dismiss,
  ]);

  return (
    <>
      <InfoIcon
        ref={refs.setReference}
        {...getReferenceProps()}
        className="w-5 h-5 cursor-pointer hover:opacity-50 transition-opacity"
      />
      <FloatingPortal>
        {isMounted && (
          <div
            className={cx(
              'bg-sky-600 p-3 text-white text-sm',
              {
                'max-w-[300px]': useMaxWidth,
              },
              className
            )}
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...styles }}
            {...getFloatingProps()}
          >
            {children}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-sky-600"
            />
          </div>
        )}
      </FloatingPortal>
    </>
  );
};
