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
        <button onClick={handleCopy} title="Copy to Clipboard">
            <IoClipboardOutline />
            {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
    );
};

export default CopyToClipboardButton;
