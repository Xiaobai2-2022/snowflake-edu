-- 1. Insert 200 random topics and capture their IDs
WITH inserted_topics AS (
    INSERT INTO topics (topic_name, topic_description, topic_url)
    SELECT
        'Topic ' || id,
        'Auto-generated description for topic ' || id,
        'https://example.com/topic/' || id
    FROM generate_series(1, 200) AS id
    RETURNING topic_id
),

-- 2. Assign a strict sequence (1 to 200) to establish a topological order
topological_order AS (
    SELECT
        topic_id,
        ROW_NUMBER() OVER (ORDER BY topic_id) AS seq
    FROM inserted_topics
),

-- 3. Guarantee a connected graph: every topic (except the first) gets exactly 1 prior prerequisite
guaranteed_edges AS (
    SELECT
        t1.topic_id,
        (
            SELECT t2.topic_id
            FROM topological_order t2
            WHERE t2.seq < t1.seq
            ORDER BY random()
            LIMIT 1
        ) AS prerequisite_id
    FROM topological_order t1
    WHERE t1.seq > 1
),

-- 4. Add complexity: 2% chance of additional valid backward edges to prevent extreme density
extra_edges AS (
    SELECT
        t1.topic_id,
        t2.topic_id AS prerequisite_id
    FROM topological_order t1
    JOIN topological_order t2 ON t1.seq > t2.seq
    WHERE random() < 0.02
),

-- 5. Combine the guaranteed and extra edges, removing any duplicates
all_edges AS (
    SELECT topic_id, prerequisite_id FROM guaranteed_edges
    UNION
    SELECT topic_id, prerequisite_id FROM extra_edges
)

-- 6. Insert into the target table
INSERT INTO topic_prerequisites (topic_id, prerequisite_id)
SELECT topic_id, prerequisite_id
FROM all_edges
WHERE prerequisite_id IS NOT NULL
ON CONFLICT (topic_id, prerequisite_id) DO NOTHING;
