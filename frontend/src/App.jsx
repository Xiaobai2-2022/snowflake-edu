import React, { useState, useEffect } from 'react';
import TopicRenderer from './TopicRenderer.jsx';

function App() {
  // Track the currently active topic so navigation actually updates the screen
  const [currentTopicId, setCurrentTopicId] = useState('multiplication');
  const [topicData, setTopicData] = useState(null);

  // Fetch topic data whenever currentTopicId changes
  useEffect(() => {
    // Optional: Reset topicData to null to trigger your "Loading..." state in TopicRenderer
    setTopicData(null);

    fetch(`http://localhost:8000/api/v1/topics/${currentTopicId}`)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch topic");
        return response.json();
      })
      .then(data => setTopicData(data))
      .catch(error => console.error("Error fetching topic data:", error));
  }, [currentTopicId]);

  // Handle navigation to a new dependency
  const handleNavigate = (newTopicId) => {
    console.log("Navigating to new topic:", newTopicId);
    setCurrentTopicId(newTopicId);
  };

  // Verify if a dependency exists in your backend
  const verifyTopic = async (topicId) => {
    try {
      // Pinging the backend to see if the topic exists
      // Update this endpoint if you have a specific /check route
      const response = await fetch(`http://localhost:8000/api/v1/topics/${topicId}`);

      // Returns true if status is 200-299, false if 404 (Not Found)
      return response.ok;
    } catch (error) {
      console.error("Failed to verify topic:", error);
      return false; // Safely fail and trigger the "Independent Study" UI
    }
  };

  return (
    <div className="App">
      <TopicRenderer
        topicData={topicData}
        onNavigate={handleNavigate}
        checkTopicExists={verifyTopic}
      />
    </div>
  );
}

export default App;
