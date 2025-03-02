import { Pokemon, PokemonListResponse, PokemonSpecies, PokemonEvolutionChain, PokemonAbility, PokemonMove } from '../types/pokemon.types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 50, offset = 0): Promise<PokemonListResponse> => {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
        throw new Error('Error al obtener la lista de Pokémon');
    }
    return response.json();
};

export const fetchPokemonByNameOrId = async (nameOrId: string | number): Promise<Pokemon> => {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
    if (!response.ok) {
        throw new Error(`No se encontró el Pokémon: ${nameOrId}`);
    }
    return response.json();
};

export const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener detalles del Pokémon');
    }
    return response.json();
};

export const fetchPokemonSpecies = async (pokemonId: number): Promise<PokemonSpecies> => {
    const response = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`);
    if (!response.ok) {
        throw new Error(`Error al obtener la especie del Pokémon: ${pokemonId}`);
    }
    return response.json();
};

export const fetchPokemonEvolutionChain = async (url: string): Promise<PokemonEvolutionChain> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener la cadena de evolución');
    }
    return response.json();
};

export const fetchPokemonAbility = async (url: string): Promise<PokemonAbility> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener detalles de la habilidad');
    }
    return response.json();
};

export const fetchPokemonMove = async (url: string): Promise<PokemonMove> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener detalles del movimiento');
    }
    return response.json();
};

export const fetchCompletePokemonData = async (nameOrId: string | number) => {
    try {
        const pokemon = await fetchPokemonByNameOrId(nameOrId);
        const species = await fetchPokemonSpecies(pokemon.id);
        let evolutionChain = null;
        if (species.evolution_chain?.url) {
            evolutionChain = await fetchPokemonEvolutionChain(species.evolution_chain.url);
        }
        const abilities = await Promise.all(
            pokemon.abilities.map(ability => fetchPokemonAbility(ability.ability.url))
        );
        const moves = await Promise.all(
            pokemon.moves.slice(0, 20).map(move => fetchPokemonMove(move.move.url))
        );
        return {
            ...pokemon,
            species,
            evolutionChain,
            detailedAbilities: abilities,
            detailedMoves: moves
        };
    } catch (error) {
        console.error('Error al obtener datos completos:', error);
        throw error;
    }
};

export const fetchPokemonByType = async (type: string): Promise<Pokemon[]> => {
    try {
        const response = await fetch(`${BASE_URL}/type/${type}`);
        if (!response.ok) {
            throw new Error(`Error al obtener Pokémon de tipo: ${type}`);
        }
        const data = await response.json();
        const pokemonDetails = await Promise.all(
            data.pokemon.slice(0, 50).map((p: {pokemon: {name: string, url: string}}) => 
                fetchPokemonDetails(p.pokemon.url)
            )
        );
        return pokemonDetails;
    } catch (error) {
        console.error('Error al obtener Pokémon por tipo:', error);
        throw error;
    }
};

export const fetchPokemonWithMoves = async (pokemonId: number): Promise<any> => {
    try {
        const pokemon = await fetchPokemonByNameOrId(pokemonId);
        const movesWithDetails = await Promise.all(
            pokemon.moves.slice(0, 10).map(async (moveInfo: any) => {
                const moveDetails = await fetchPokemonMove(moveInfo.move.url);
                return {
                    ...moveDetails,
                    learnedAt: moveInfo.version_group_details[0]?.level_learned_at || 0,
                    learnMethod: moveInfo.version_group_details[0]?.move_learn_method.name || 'unknown'
                };
            })
        );
        return {
            ...pokemon,
            movesWithDetails
        };
    } catch (error) {
        console.error('Error al obtener Pokémon con movimientos:', error);
        throw error;
    }
};

export const searchPokemonByName = async (name: string): Promise<Pokemon[]> => {
    try {
        const response = await fetch(`${BASE_URL}/pokemon?limit=1000`);
        if (!response.ok) {
            throw new Error('Error al buscar Pokémon');
        }
        const data = await response.json();
        const filteredResults = data.results.filter((pokemon: {name: string}) => 
            pokemon.name.toLowerCase().includes(name.toLowerCase())
        );
        const pokemonDetails = await Promise.all(
            filteredResults.slice(0, 20).map((pokemon: {url: string}) => 
                fetchPokemonDetails(pokemon.url)
            )
        );
        return pokemonDetails;
    } catch (error) {
        console.error('Error en búsqueda de Pokémon:', error);
        throw error;
    }
};