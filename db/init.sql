-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2. Topics
CREATE TABLE IF NOT EXISTS topics (
    topic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_name TEXT UNIQUE NOT NULL,
    topic_description TEXT NOT NULL,
    topic_json TEXT
);

-- 3. Topic Prerequisites
CREATE TABLE IF NOT EXISTS topic_prerequisites (
    topic_id UUID REFERENCES topics(topic_id) ON DELETE CASCADE,
    prerequisite_id UUID REFERENCES topics(topic_id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, prerequisite_id),
    CONSTRAINT no_self_prereq CHECK (topic_id <> prerequisite_id)
);

-- 4. Roles ENUM
DO $$ BEGIN
    CREATE TYPE roles AS ENUM (
        'instructor',
        'tutor_isc',
        'tutor_isa',
        'student',
        'employer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 5. User Roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(topic_id) ON DELETE CASCADE,
    role_level roles,
    PRIMARY KEY (user_id, topic_id, role_level)
);

-- 6. User Complete Topic
CREATE TABLE IF NOT EXISTS user_completed_topics (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(topic_id) ON DELETE CASCADE,

    PRIMARY KEY (user_id, topic_id)
);

-- 7. Questions
CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_name TEXT NOT NULL,
    question_difficulty SMALLINT NOT NULL,
    topic_json TEXT,
    primary_topic UUID REFERENCES topics(topic_id) ON DELETE CASCADE
);

-- 8. Question Secondary Topics
CREATE TABLE IF NOT EXISTS question_topics (
    question_id UUID REFERENCES questions(question_id) ON DELETE CASCADE,
    secondary_topic UUID REFERENCES topics(topic_id) ON DELETE CASCADE,

    PRIMARY KEY (question_id, secondary_topic)
);

-- 9. Question Hints
CREATE TABLE IF NOT EXISTS question_hints (
    hint_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(question_id) ON DELETE CASCADE,
    hint_number SMALLINT NOT NULL,
    hint_url TEXT
);

-- 10. Submissions
CREATE TABLE IF NOT EXISTS submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(question_id) ON DELETE CASCADE,
    submission_url TEXT,
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
