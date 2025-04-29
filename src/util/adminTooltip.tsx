import React, { cloneElement, isValidElement, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

import { ReactComponent as SupportLogo } from '../assets/images/support.svg';

export const AdminToolTip = ({ children, button, title, width, custom, customLeft = 0 }: any) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [left, setLeft] = useState<any>(null);
    const [top, setTop] = useState<any>(null);
    const parentRef = useRef<any>(null);
    const divRef = useRef<any>(null);
    useEffect(() => {
        let top = 0;
        let left = 0;
        if (parentRef.current && showTooltip) {
            const rect = parentRef.current.getBoundingClientRect();
            left = rect.x + (rect.width / 2);
            top = rect.y - 9;
        }
        if (divRef.current) {
            const height = divRef.current.offsetHeight;
            const width = divRef.current.offsetWidth;
            setTop(top - height);
            if (children) {
                if (button) {
                    setLeft(left - (width / 4));
                } else {
                    setLeft(left - (width / 3.1));
                }
            } else {
                setLeft(left - (width / 2));
            }
        }
        // eslint-disable-next-line
    }, [showTooltip])

    const childWithRef = isValidElement(children)
    ? button ? cloneElement(children as React.ReactElement<any>, { ref: parentRef } as { ref: Ref<HTMLDivElement> }) : cloneElement(children as React.ReactElement<any>, { inputRef: parentRef } as { inputRef: Ref<HTMLDivElement> })
    : children;

    return (
        <div className={`custom-tooltip-block ${custom ? 'custom-direction' : ''}`} onMouseEnter={() => {
            setShowTooltip(true)}} onMouseLeave={() => setShowTooltip(false)}>
            {showTooltip &&
                <div ref={divRef} style={{ visibility: (left && top) ? 'visible' : 'hidden', left: `${left - customLeft}px`, top: `${top}px`, width: `${width ? width : '220px'}`}} className='custom-tooltip'>
                    {title}
                </div>
            }
            {childWithRef || <SupportLogo ref={parentRef}  />}
        </div>
    );
}
