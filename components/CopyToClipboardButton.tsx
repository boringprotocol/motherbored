import React, { useState } from 'react';
import { IoClipboardOutline } from 'react-icons/io5';

const CopyToClipboardButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };



    return (
        <button className="" onClick={handleCopy} title="Copy to Clipboard">
            <span className="text-xs fixed ml-6">{copied ? 'Copied!' : ''}</span>
            <IoClipboardOutline />
        </button>
    );
};

export default CopyToClipboardButton;
