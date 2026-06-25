import React, { useEffect, useRef, useState } from 'react';
import './TopicRenderer.css';

const ContentBlock = ({ block }) => {
  if (block.contentText) {
    return <div className={block["css-class"]}>{block.contentText}</div>;
  }

  if (block.contentSplit) {
    return (
      <div className="flex-row-split">
        {block.contentSplit.map((column, index) => (
          <div
            key={index}
            className="split-column"
            style={{ flex: column.width }}
          >
            {column.contentPage.map((subBlock, subIndex) => (
              <ContentBlock key={subIndex} block={subBlock} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (block["h5-uploaded-module"]) {
    const moduleInfo = block["h5-uploaded-module"];
    const iframeRef = useRef(null);

    useEffect(() => {
      if (moduleInfo.config.requiresAuth && iframeRef.current) {
        // Because of key={topicId} in parent, this will safely run on every new topic navigation
        iframeRef.current.onload = () => {
          iframeRef.current.contentWindow.postMessage(
            { type: 'AUTH_SUCCESS' },
            '*'
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

  return null;
};

const TopicRenderer = ({
  topicData,
  onNavigate,
  // ADDED: Default fallback function to prevent the TypeError crash
  checkTopicExists = async () => {
    console.warn("Warning: checkTopicExists prop was not provided to TopicRenderer.");
    return false;
  }
}) => {
  const [missingTopic, setMissingTopic] = useState(null);

  // Track exactly which dependency is being checked, rather than a single global boolean
  const [checkingDep, setCheckingDep] = useState(null);

  if (!topicData) return <div>Loading...</div>;

  const handleDependencyClick = async (dep) => {
    console.log("Attempting to navigate to:", dep); // Debug
    setCheckingDep(dep);
    try {
      // ADDED: Extra safety check just in case a non-function (like null) was explicitly passed
      if (typeof checkTopicExists !== 'function') {
        throw new Error("checkTopicExists must be a function");
      }

      const exists = await checkTopicExists(dep);
      console.log("Topic existence check result:", exists); // Debug
      if (exists) {
        onNavigate(dep);
      } else {
        setMissingTopic(dep);
      }
    } catch (error) {
      console.error("Error verifying topic:", error);
      setMissingTopic(dep);
    } finally {
      setCheckingDep(null);
    }
  };


  if (missingTopic) {
    return (
      <div className="missing-topic-container">
        <h2>Independent Study Required</h2>
        <p>
          The topic <strong>{missingTopic}</strong> needs to be studied by the student individually as it is not currently available in the system.
        </p>
        <button
          className="btn-go-back"
          onClick={() => setMissingTopic(null)}
        >
          ← Go Back to {topicData.topicName}
        </button>
      </div>
    );
  }

  return (
    <div className="topic-container">
      {topicData.dependencies && topicData.dependencies.length > 0 && (
        <div className="topic-meta">
          <h3>Prerequisites:</h3>
          <div className="dependency-buttons">
            {topicData.dependencies.map((dep, index) => {
              const isThisChecking = checkingDep === dep;

              return (
                <button
                  key={index}
                  className="btn-dependency"
                  onClick={() => handleDependencyClick(dep)}
                  disabled={checkingDep !== null}
                >
                  {isThisChecking ? 'Checking...' : dep}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="topic-content">
        {topicData.contentPage.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </div>
    </div>
  );
};

export default TopicRenderer;
