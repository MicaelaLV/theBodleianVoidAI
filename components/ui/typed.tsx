// filename: Typing.js
// React version: "^16.12.0"
import React, { useEffect, useRef } from "react";
import Typed from 'typed.js'

interface TypingProps {
  copy: string[][];
}

const Typing: React.FC<TypingProps> = ({ copy }) => {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let typedInstances: Typed[] = [];
    let index = 0;

    const typeNext = () => {
      if (index < copy.length) {
        const textArray = copy[index];
        const p = document.createElement('p');
        p.style.whiteSpace = 'pre';
        el.current?.appendChild(p);

        const options = {
          smartBackspace: false,
          strings: textArray,
          typeSpeed: 56,
          showCursor: false,
          contentType: 'text',
          onComplete: () => {
            index++;
            typeNext();
          }
        };

        const typed = new Typed(p, options);
        typedInstances.push(typed);
      }
    };

    typeNext();

    return () => {
      typedInstances.forEach(typed => typed.destroy());
    };
  }, []);

  return (
    <div className="mt-4 flex flex-col justify-center items-center word-break" ref={el}>
    </div>
  );
};

export default Typing;
