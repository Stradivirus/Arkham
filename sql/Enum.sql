CREATE TYPE product_line AS ENUM (
    '기본판', -- Core Set
    '던위치의 유산', -- The Dunwich Legacy
    '카르코사로 가는 길', -- The Path to Carcosa
    '잊힌 시대', -- The Forgotten Age
    '끝맺지 못한 의식', -- The Circle Undone
    '꿈을 먹는 자들', -- The Dream-Eaters
    '인스머스의 음모', -- The Innsmouth Conspiracy
    '지구의 끝자락', -- Edge of the Earth
    '진홍빛 열쇠', -- The Scarlet Keys
    '햄록 베일의 축일', -- The Festival of Hemlock Vale
    '수몰된 도시', -- The Sunken City
    '조사자 확장' -- Investigator Expansion
    );

CREATE TYPE investigator_class AS ENUM ('수호자', '탐구자', '무법자', '신비주의자', '생존자', '중립');