INSERT INTO topic_prerequisites (topic_id, prerequisite_id)
SELECT
    t.topic_id,
    pt.topic_id
FROM topics t
CROSS JOIN json_array_elements_text(t.topic_json::json -> 'dependencies') AS prereq_name
JOIN topics pt ON pt.topic_name = prereq_name
ON CONFLICT (topic_id, prerequisite_id) DO NOTHING;
