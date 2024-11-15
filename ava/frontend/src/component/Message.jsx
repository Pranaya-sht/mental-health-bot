import Typewriter from 'typewriter-effect';
import React, { useEffect, useState } from "react";

function Message({ text }) {
    const [txt, setTxt] = useState(null);
    useEffect(() => {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        const parts = text.split(urlRegex);

        const out = parts.reduce(
            (acc, cur) =>
                acc +
                (urlRegex.test(cur)
                    ? ` <a
        
          href="${cur.startsWith("http") ? cur : "http://" + cur}"
          target="_blank"
          rel="noopener noreferrer"
          className="neon-link"
        >
          ${cur}
        </a>`
                    : cur)
        );
        setTxt(out);
    }, []);
    return (
        <>
            {txt && (
                <div>
                    <Typewriter

                        onInit={(typewriter) => {
                            typewriter
                                .changeDelay(0.4)
                                .typeString(txt)
                                .start()
                                .callFunction((s) => {
                                    s.elements.cursor.style.display = "none";
                                });
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default Message;