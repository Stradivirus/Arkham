-- investigators.sql (단순화된 최종 버전)
CREATE TABLE investigators (
                               id SERIAL PRIMARY KEY,
                               kor_name TEXT NOT NULL UNIQUE,
                               eng_name TEXT,
                               investigator_class investigator_class NOT NULL,
                               product_line product_line,

                               deck_size INT DEFAULT 30,

                               health INT NOT NULL,
                               sanity INT NOT NULL,

                               willpower INT NOT NULL,
                               intellect INT NOT NULL,
                               combat INT NOT NULL,
                               agility INT NOT NULL,

                               elder_sign_effect TEXT,
                               special_abilities TEXT,
                               flavor_text TEXT
);

-- 성능을 위한 인덱스
CREATE INDEX idx_investigators_class ON investigators(investigator_class);
CREATE INDEX idx_investigators_product_line ON investigators(product_line);
