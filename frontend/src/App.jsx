import React, { useState, useEffect } from 'react';
import TopicRenderer from './TopicRenderer.jsx';

function App() {
  const [topicData, setTopicData] = useState(null);

  useEffect(() => {
    // Fetch from your FastAPI backend
    fetch('http://localhost:8000/api/v1/topics/addition')
      .then(response => response.json())
      .then(data => setTopicData(data));
  }, []);

  return (
    <div className="App">
      <TopicRenderer topicData={topicData} />
    </div>
  );
}

export default App;
