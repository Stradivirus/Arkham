package com.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "investigators")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investigator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name", nullable = false, unique = true)
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    @Enumerated(EnumType.STRING)
    @Column(name = "investigator_class", nullable = false)
    private InvestigatorClass investigatorClass;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_line")
    private ProductLine productLine;

    @Column(name = "deck_size")
    private Integer deckSize = 30;

    @Column(name = "health", nullable = false)
    private Integer health;

    @Column(name = "sanity", nullable = false)
    private Integer sanity;

    @Column(name = "willpower", nullable = false)
    private Integer willpower;

    @Column(name = "intellect", nullable = false)
    private Integer intellect;

    @Column(name = "combat", nullable = false)
    private Integer combat;

    @Column(name = "agility", nullable = false)
    private Integer agility;

    @Column(name = "elder_sign_effect")
    private String elderSignEffect;

    @Column(name = "special_abilities")
    private String specialAbilities;

    @Column(name = "flavor_text")
    private String flavorText;
}