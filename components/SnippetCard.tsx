"use client";

import React, { useState } from "react";
import { Highlight, themes, Language } from "prism-react-renderer";
import { motion } from "framer-motion";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import SnippetModal from "./SnippetModal";
import { useRouter } from "next/navigation";
import { Snippet } from "../types/snippet";

interface SnippetCardProps {
  snippet: Snippet;
  onUpdate: () => void;
  onDelete: () => void;
}

const languageColors: { [key: string]: string } = {
  javascript: "bg-yellow-100",
  python: "bg-blue-100",
  css: "bg-pink-100",
  html: "bg-orange-100",
  typescript: "bg-blue-200",
};

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onUpdate,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const bgColor = languageColors[snippet.language] || "bg-gray-100";
  const router = useRouter();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/snippet/${snippet.id}`;
    navigator.clipboard.writeText(link);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleOpenFullView = () => {
    router.push(`/snippet/${snippet.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Created on ${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
  };

  return (
    <>
      <motion.div
        className={`rounded-lg shadow-md overflow-hidden cursor-pointer relative h-[300px] ${bgColor}`}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="p-4 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {snippet.title}
          </h2>
          <div className="flex-grow overflow-hidden">
            <Highlight
              theme={themes.github}
              code={snippet.content}
              language={snippet.language as Language}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} text-sm`}
                  style={{
                    ...style,
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {tokens.slice(0, 5).map((line, i) => (
                    <div key={i} {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                  {tokens.length > 5 && <div>...</div>}
                </pre>
              )}
            </Highlight>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {formatDate(snippet.date)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title="Copy link"
              >
                {isLinkCopied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <LinkIcon size={16} />
                )}
              </button>
              <button
                onClick={handleCopy}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title="Copy snippet"
              >
                {isCopied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <SnippetModal
          snippet={snippet}
          onClose={() => setIsModalOpen(false)}
          onEdit={onUpdate}
          onDelete={() => {
            onDelete();
            setIsModalOpen(false);
          }}
          onFullScreen={handleOpenFullView}
        />
      )}
    </>
  );
};

export default SnippetCard;
