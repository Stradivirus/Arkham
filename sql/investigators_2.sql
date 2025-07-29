-- 조사자 전용 카드 역할 분류
CREATE TYPE card_role AS ENUM (
    'signature_asset',   -- 조사자 전용 자산
    'signature_event',   -- 조사자 전용 이벤트
    'signature_skill',   -- 조사자 전용 스킬
    'weakness',          -- 조사자 고유 약점
    'mini_card'          -- 미니 카드
    );

-- 덱 빌드 규칙 타입
CREATE TYPE deck_rule_type AS ENUM (
    'class_level',       -- 클래스별 레벨 제한
    'specific_card',     -- 특정 카드 허용/제한
    'subtype',           -- 서브타입 제한 (전술, 주문 등)
    'trait',             -- 특성 제한
    'slot_limit',        -- 슬롯별 총량 제한
    'other_class_limit'  -- 다른 클래스 카드 제한
    );

-- 조사자 전용 카드 매핑 테이블
CREATE TABLE investigator_signature_cards (
                                              id SERIAL PRIMARY KEY,
                                              investigator_id INT NOT NULL
                                                  REFERENCES investigators(id) ON DELETE CASCADE,
                                              card_id INT NOT NULL,
                                              card_role card_role NOT NULL,
                                              quantity SMALLINT DEFAULT 1 CHECK (quantity > 0),
                                              is_required BOOLEAN DEFAULT TRUE,
                                              description TEXT
);

-- 덱 빌드 규칙 테이블
CREATE TABLE deck_build_rules (
                                  id SERIAL PRIMARY KEY,
                                  investigator_id INT NOT NULL
                                      REFERENCES investigators(id) ON DELETE CASCADE,

                                  rule_type deck_rule_type NOT NULL,

    -- 클래스/레벨 관련
                                  card_class investigator_class,
                                  min_level SMALLINT DEFAULT 0,
                                  max_level SMALLINT DEFAULT 5,

    -- 특정 카드/속성 관련
                                  specific_card_name TEXT,
                                  subtype TEXT,
                                  trait TEXT,

    -- 수량 제한
                                  max_copies SMALLINT,
                                  max_total SMALLINT,

    -- 공유 풀 (같은 pool_id끼리 합산 제한)
                                  pool_id INT,

                                  priority SMALLINT DEFAULT 0,
                                  description TEXT
);

-- 인덱스
CREATE INDEX idx_signature_cards_investigator
    ON investigator_signature_cards (investigator_id);

CREATE INDEX idx_deck_rules_investigator
    ON deck_build_rules (investigator_id);

CREATE INDEX idx_deck_rules_pool
    ON deck_build_rules (pool_id) WHERE pool_id IS NOT NULL;

-- 추가 인덱스 (성능 향상)
CREATE INDEX idx_deck_rules_type_class
    ON deck_build_rules (rule_type, card_class);
