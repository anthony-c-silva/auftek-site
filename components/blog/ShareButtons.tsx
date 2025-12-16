"use client"; 

import { Facebook, Linkedin, Twitter, Link as LinkIcon } from "lucide-react";

interface ShareProps {
    title: string;
    url: string;
}

export const ShareButtons = ({ title, url }: ShareProps) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        alert("Link copiado!");
    };

    return (
        <div className="flex gap-4">
            <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`)}
                className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
            >
                <Linkedin size={20} />
            </button>
            
            <button 
                onClick={copyToClipboard}
                className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
            >
                <LinkIcon size={20} />
            </button>
        </div>
    );
};