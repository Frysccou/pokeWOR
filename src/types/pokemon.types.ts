export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        front_shiny: string;
        back_default: string;
        back_shiny: string;
        other: {
            'official-artwork': {
                front_default: string;
                front_shiny: string;
            }
        }
    };
    types: {
        slot: number;
        type: {
            name: string;
            url: string;
        }
    }[];
    stats: {
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        }
    }[];
    height: number;
    weight: number;
    abilities: {
        is_hidden: boolean;
        slot: number;
        ability: {
            name: string;
            url: string;
        }
    }[];
    base_experience: number;
    moves: {
        move: {
            name: string;
            url: string;
        };
        version_group_details: {
            level_learned_at: number;
            move_learn_method: {
                name: string;
                url: string;
            };
            version_group: {
                name: string;
                url: string;
            };
        }[];
    }[];
}

export interface PokemonSpecies {
    id: number;
    name: string;
    order: number;
    gender_rate: number;
    capture_rate: number;
    base_happiness: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    hatch_counter: number;
    evolution_chain: {
        url: string;
    };
    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
            url: string;
        };
        version: {
            name: string;
            url: string;
        };
    }[];
    genera: {
        genus: string;
        language: {
            name: string;
            url: string;
        };
    }[];
}

export interface PokemonEvolutionChain {
    id: number;
    chain: {
        is_baby: boolean;
        species: {
            name: string;
            url: string;
        };
        evolves_to: {
            is_baby: boolean;
            species: {
                name: string;
                url: string;
            };
            evolution_details: {
                min_level: number;
                trigger: {
                    name: string;
                    url: string;
                };
                item?: {
                    name: string;
                    url: string;
                };
            }[];
            evolves_to: {
                is_baby: boolean;
                species: {
                    name: string;
                    url: string;
                };
                evolution_details: {
                    min_level: number;
                    trigger: {
                        name: string;
                        url: string;
                    };
                    item?: {
                        name: string;
                        url: string;
                    };
                }[];
            }[];
        }[];
    };
}

export interface PokemonAbility {
    id: number;
    name: string;
    is_main_series: boolean;
    effect_entries: {
        effect: string;
        short_effect: string;
        language: {
            name: string;
            url: string;
        };
    }[];
    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
            url: string;
        };
        version_group: {
            name: string;
            url: string;
        };
    }[];
}

export interface PokemonMove {
    id: number;
    name: string;
    accuracy: number | null;
    power: number | null;
    pp: number;
    priority: number;
    damage_class: {
        name: string;
        url: string;
    };
    effect_entries: {
        effect: string;
        short_effect: string;
        language: {
            name: string;
            url: string;
        };
    }[];
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        name: string;
        url: string;
    }[];
}

export type PokemonType =
    | 'normal' | 'fire' | 'water' | 'electric' | 'grass'
    | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying'
    | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon'
    | 'dark' | 'steel' | 'fairy';

export interface FilterOptions {
    type?: PokemonType;
    searchTerm?: string;
}