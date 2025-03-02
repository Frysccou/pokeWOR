import { useState, useEffect } from 'react';
import { Pokemon, FilterOptions } from '../types/pokemon.types';

export const useFilters = (pokemonList: Pokemon[]) => {
    const [filters, setFilters] = useState<FilterOptions>({});
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(pokemonList);

    const updateFilters = (newFilters: Partial<FilterOptions>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFilters({});
    };

    useEffect(() => {
        let result = [...pokemonList];

        if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            result = result.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm) ||
                pokemon.id.toString().includes(searchTerm)
            );
        }

        if (filters.type) {
            result = result.filter(pokemon =>
                pokemon.types.some(t => t.type.name === filters.type)
            );
        }

        setFilteredPokemon(result);
    }, [filters, pokemonList]);

    return { filters, filteredPokemon, updateFilters, resetFilters };
};