// filename: Typing.js
// React version: "^16.12.0"
import React, { useEffect, useRef } from "react";
import Typed from 'typed.js';

interface TypingProps {
  copy: string[];
}

const Typing: React.FC<TypingProps> = ({ copy }) => {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("useEffect called");
    let typedInstances: Typed[] = [];
    let index = 0;

    const typeNext = () => {
      console.log("typeNext called, index:", index);
      if (index < copy.length) {
        const text = copy[index];
        const p = document.createElement('p');
        el.current?.appendChild(p);
        p.style.whiteSpace = 'pre';

        const options = {
          smartBackspace: false,
          strings: [text],
          typeSpeed: 56,
          showCursor: false,
          contentType: 'text',
          onComplete: () => {
            console.log("onComplete called, index:", index);
            index++;
            new Promise(resolve => setTimeout(resolve, 500)).then(() => typeNext());
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
  }, [copy]);

  return (
    <div ref={el}>
    </div>
  );
};

export default Typing;
