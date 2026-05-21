import React, { useEffect, useRef } from 'react';
import './TopicRenderer.css'; // We will define the CSS below

// A helper component to render individual blocks
const ContentBlock = ({ block }) => {
  // 1. Handle standard text blocks
  if (block.contentText) {
    return <div className={block["css-class"]}>{block.contentText}</div>;
  }

  // 2. Handle split columns (Side-by-Side content)
  if (block.contentSplit) {
    return (
      <div className="flex-row-split">
        {block.contentSplit.map((column, index) => (
          <div
            key={index}
            className="split-column"
            style={{ flex: column.width }}
          >
            {/* Recursively render whatever is inside this column */}
            {column.contentPage.map((subBlock, subIndex) => (
              <ContentBlock key={subIndex} block={subBlock} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // 3. Handle the H5 Uploaded Module (The Iframe)
  if (block["h5-uploaded-module"]) {
    const moduleInfo = block["h5-uploaded-module"];
    const iframeRef = useRef(null);

    // This handles the authentication handshake we discussed
    useEffect(() => {
      if (moduleInfo.config.requiresAuth && iframeRef.current) {
        // Wait for the iframe to load before sending the auth token
        iframeRef.current.onload = () => {
          iframeRef.current.contentWindow.postMessage(
            { type: 'AUTH_SUCCESS' },
            '*' // In production, replace '*' with your actual NGINX domain
          );
        };
      }
    }, [moduleInfo.config.requiresAuth]);

    return (
      <div className={moduleInfo["css-class"]}>
        <iframe
          ref={iframeRef}
          src={moduleInfo.src}
          title={moduleInfo.moduleId}
          style={{
            height: moduleInfo.config.height,
            width: '100%',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}
          scrolling="no"
        />
      </div>
    );
  }

  return null; // Fallback for unknown block types
};

// The Main Component
const TopicRenderer = ({ topicData }) => {
  if (!topicData) return <div>Loading...</div>;

  return (
    <div className="topic-container">
      {/* Optional: Render Topic Name and Dependencies */}
      <div className="topic-meta">
        <span className="badge">Dependencies: {topicData.dependencies.join(', ')}</span>
      </div>

      {/* Loop through the main contentPage array */}
      <div className="topic-content">
        {topicData.contentPage.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </div>
    </div>
  );
};

export default TopicRenderer;
