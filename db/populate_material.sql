-- Populate Topics

INSERT INTO topics (topic_name, topic_description, topic_json)
VALUES
('Addition',
'Adding up to 10 + 10.',
 '{
    "topicName": "Addition",
    "dependencies": [
        "Counting Numbers"
    ],
    "contentPage": [
        {
            "contentText": "Addition",
            "css-class": "Sn0wf1ake-head"
        },
        {
            "contentText": "Addition can be as simple as 1+1, or as complex as 5678+32456.",
            "css-class": "Sn0wf1ake-txt"
        },
        {
            "contentSplit": [
                {
                    "contentPage" : [
                        {
                            "contentText": "Example 1:",
                            "css-class": "Sn0wf1ake-exp"
                        },
                        {
                            "contentText": "In this example, you can try out how to add numbers between 0 to 10 by dragging the slide bar.",
                            "css-class": "Sn0wf1ake-txt"
                        }
                    ],
                    "width": 1
                },
                {
                    "contentPage": [
                        {
                            "h5-uploaded-module": {
                                "moduleId": "addition_example_1",
                                "src": "http://localhost:8080/modules/addition_example_1/index.html",
                                "css-class": "Sn0wf1ake-h5-embed",
                                "config": {
                                    "height": "400px",
                                    "requiresAuth": true
                                }
                            }
                        }
                    ],
                    "width": 1
                }
            ]
        }
    ]
}
')
ON CONFLICT (topic_name)
DO UPDATE SET
              topic_description = EXCLUDED.topic_description,
              topic_json = EXCLUDED.topic_json;