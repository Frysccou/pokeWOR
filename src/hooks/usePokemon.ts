import { useState, useEffect } from 'react';
import { Pokemon, PokemonListResponse, FilterOptions } from '../types/pokemon.types';
import { fetchPokemonList, fetchPokemonDetails, fetchPokemonByNameOrId } from '../services/api';

export const usePokemonList = (limit = 50) => {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedType, setSelectedType] = useState<string | undefined>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);

    const loadPokemon = async () => {
        try {
            setLoading(true);
            const data: PokemonListResponse = await fetchPokemonList(limit, offset);
            setTotalCount(data.count);

            const pokemonDetails = await Promise.all(
                data.results.map(pokemon => fetchPokemonDetails(pokemon.url))
            );

            if (offset === 0) {
                setPokemonList(pokemonDetails);
            } else {
                setPokemonList(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewPokemon = pokemonDetails.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNewPokemon];
                });
            }
            
            setHasMore(data.next !== null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const loadAllPokemonByType = async (type: string) => {
        try {
            setIsLoadingAll(true);
            setLoading(true);
            
            const data: PokemonListResponse = await fetchPokemonList(1500, 0);
            
            const pokemonDetails = await Promise.all(
                data.results.map(pokemon => fetchPokemonDetails(pokemon.url))
            );
            
            const filtered = pokemonDetails.filter(pokemon => 
                pokemon.types.some(t => t.type.name === type)
            );
            
            setPokemonList(filtered);
            setHasMore(false);
            setTotalCount(filtered.length);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar todos los Pokémon');
        } finally {
            setLoading(false);
            setIsLoadingAll(false);
        }
    };

    const searchPokemonGlobally = async (term: string) => {
        if (!term.trim()) {
            setIsGlobalSearch(false);
            if (selectedType) {
                loadAllPokemonByType(selectedType);
            } else {
                loadPokemon();
            }
            return;
        }

        try {
            setLoading(true);
            setIsGlobalSearch(true);
            setError(null);
            
            try {
                const pokemon = await fetchPokemonByNameOrId(term.trim().toLowerCase());
                setPokemonList([pokemon]);
                setFilteredList([pokemon]);
                setTotalCount(1);
                setHasMore(false);
            } catch (exactSearchErr) {
                const data: PokemonListResponse = await fetchPokemonList(1500, 0);
                
                const matchingResults = data.results.filter(p => 
                    p.name.toLowerCase().includes(term.toLowerCase())
                );
                
                if (matchingResults.length === 0) {
                    setError(`No se encontraron Pokémon que coincidan con "${term}"`);
                    setPokemonList([]);
                    setFilteredList([]);
                    setTotalCount(0);
                } else {
                    const pokemonDetails = await Promise.all(
                        matchingResults.map(pokemon => fetchPokemonDetails(pokemon.url))
                    );
                    
                    setPokemonList(pokemonDetails);
                    setFilteredList(pokemonDetails);
                    setTotalCount(pokemonDetails.length);
                }
                setHasMore(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error en la búsqueda');
            setPokemonList([]);
            setFilteredList([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        setOffset(prev => prev + limit);
    };

    const resetList = () => {
        setPokemonList([]);
        setOffset(0);
        setHasMore(true);
        setSelectedType(undefined);
        setSearchTerm('');
        setIsGlobalSearch(false);
        loadPokemon();
    };

    useEffect(() => {
        if (!selectedType && !isGlobalSearch) {
            loadPokemon();
        }
    }, [offset]);

    useEffect(() => {
        if (selectedType) {
            loadAllPokemonByType(selectedType);
        } else if (!isGlobalSearch && pokemonList.length === 0) {
            loadPokemon();
        }
    }, [selectedType]);

    useEffect(() => {
        if (!isGlobalSearch) {
            let filtered = [...pokemonList];
            
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filtered = filtered.filter(pokemon =>
                    pokemon.name.toLowerCase().includes(term) ||
                    pokemon.id.toString().includes(term)
                );
            }

            setFilteredList(filtered);
        }
    }, [pokemonList, searchTerm, isGlobalSearch]);

    const searchPokemon = (term: string) => {
        setSearchTerm(term);
        if (term.trim()) {
            searchPokemonGlobally(term);
        } else {
            setIsGlobalSearch(false);
            if (selectedType) {
                loadAllPokemonByType(selectedType);
            } else {
                loadPokemon();
            }
        }
    };

    const handleTypeFilter = (type: string | undefined) => {
        setPokemonList([]);
        setOffset(0);
        setHasMore(true);
        setSelectedType(type);
        setSearchTerm('');
        setIsGlobalSearch(false);
    };

    return { 
        pokemonList: filteredList, 
        loading, 
        error, 
        hasMore: selectedType || isGlobalSearch ? false : hasMore, 
        loadMore, 
        resetList, 
        totalCount: selectedType || isGlobalSearch ? filteredList.length : totalCount,
        searchPokemon,
        handleTypeFilter,
        selectedType,
        isLoadingAll
    };
};

export const usePokemonSearch = () => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPokemon = async (nameOrId: string) => {
        if (!nameOrId.trim()) {
            setPokemon(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await fetchPokemonByNameOrId(nameOrId.trim().toLowerCase());
            setPokemon(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Pokémon no encontrado');
            setPokemon(null);
        } finally {
            setLoading(false);
        }
    };

    return { pokemon, loading, error, searchPokemon };
};