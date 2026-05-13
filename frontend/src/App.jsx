import React, { useState } from 'react';

// --- 1. Mock Database ---
// This simulates your backend graph. Notice "Laura Ipsum 0" is intentionally missing!
const mockDatabase = {
  "Laura Ipsum 2": {
    "topicName": "Laura Ipsum 2",
    "dependencies": ["Not exist content", "Starting Node"],
    "contentPage": [
      { "contentTitle": "<h2>Laura Ipsum 2</h2>", "font": "Open Sans" },
      { "contentParagraph": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...", "font": "Consolas" }
    ]
  },
  "Starting Node": {
    "topicName": "Starting Node",
    "dependencies": [],
    "contentPage": [
      { "contentTitle": "<h2>Laura Ipsum 1</h2>", "font": "Open Sans" },
      { "contentParagraph": "This has no dependencies, it is a starting node in our graph.", "font": "Consolas" }
    ]
  }
};

// --- 2. The Self-Study "Not Found" Component ---
const SelfStudyPage = ({ topicName, onGoBack }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 mt-16 bg-white shadow-md rounded-xl text-center border-t-4 border-amber-500">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        📚
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Independent Study Required</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        The prerequisite topic <span className="font-semibold text-gray-900">"{topicName}"</span> is considered foundational knowledge and is not covered directly in this curriculum.
        You will need to study this concept on your own before proceeding.
      </p>
      <button
        onClick={onGoBack}
        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors"
      >
        &larr; Go Back to Previous Topic
      </button>
    </div>
  );
};

// --- 3. The Main Learning Page Component ---
const StudentLearningPage = ({ pageData, navigateToTopic }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white shadow-lg rounded-xl mt-10">

      {/* Dependency Breadcrumbs */}
      {pageData.dependencies && pageData.dependencies.length > 0 && (
        <div className="text-sm mb-6 pb-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-600">Prerequisites: </span>

          {pageData.dependencies.map((dep, index) => (
            <React.Fragment key={`dep-${index}`}>
              <button
                onClick={() => navigateToTopic(dep)}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
              >
                {dep}
              </button>

              {index < pageData.dependencies.length - 1 && (
                <span className="text-gray-400"> </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Dynamic Content Renderer */}
      <article className="space-y-6">
        {pageData.contentPage.map((block, index) => {
          const fontStyle = { fontFamily: block.font ? `"${block.font}", sans-serif` : 'inherit' };

          if (block.contentTitle) {
            return <div key={index} style={fontStyle} className="prose prose-lg max-w-none text-gray-900" dangerouslySetInnerHTML={{ __html: block.contentTitle }} />;
          }
          if (block.contentParagraph) {
            return <p key={index} style={fontStyle} className="text-gray-700 leading-relaxed text-lg">{block.contentParagraph}</p>;
          }
          return null;
        })}
      </article>

      <hr className="my-8 border-gray-200" />

      {/* Questions Link */}
      <section className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-blue-900 mb-1">Ready to test your knowledge?</h3>
          <p className="text-blue-700 text-sm">Apply what you've learned from {pageData.topicName}.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
          Try Out Questions
        </button>
      </section>
    </div>
  );
};

// --- 4. The Root App (Acts as our Router) ---
export default function App() {
  // We start by looking at Laura Ipsum 2
  const [currentTopicId, setCurrentTopicId] = useState("Laura Ipsum 2");
  const [navigationHistory, setNavigationHistory] = useState([]);

  // The function to handle clicking a prerequisite
  const handleNavigation = (targetTopicId) => {
    setNavigationHistory(prev => [...prev, currentTopicId]);
    setCurrentTopicId(targetTopicId);
  };

  // The function to handle the "Go Back" button on the Self-Study page
  const handleGoBack = () => {
    const historyCopy = [...navigationHistory];
    const previousTopic = historyCopy.pop();
    setNavigationHistory(historyCopy);
    setCurrentTopicId(previousTopic || "Laura Ipsum 2");
  };

  // Check if the requested topic exists in our database
  const topicData = mockDatabase[currentTopicId];

  // If it doesn't exist, render the Self-Study page
  if (!topicData) {
    return <SelfStudyPage topicName={currentTopicId} onGoBack={handleGoBack} />;
  }

  // If it does exist, render the standard learning page
  return <StudentLearningPage pageData={topicData} navigateToTopic={handleNavigation} />;
}
