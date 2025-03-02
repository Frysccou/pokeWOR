import { useState } from 'react';
import { Pokemon, PokemonType } from '../types/pokemon.types';
import { PokemonCard } from './PokemonCard';
import { PokemonDetail } from './PokemonDetail';
import ShinyText from './ShinyText';

interface PokemonListProps {
    pokemonList: Pokemon[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    resetList: () => void;
    totalCount: number;
    isLoadingAll?: boolean;
}

export const PokemonList = ({
    pokemonList,
    loading,
    error,
    hasMore,
    loadMore,
    resetList,
    totalCount,
    isLoadingAll
}: PokemonListProps) => {
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    const handleSelectPokemon = (pokemon: Pokemon) => {
        setSelectedPokemon(pokemon);
    };

    const handleCloseDetail = () => {
        setSelectedPokemon(null);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="container">
            {selectedPokemon ? (
                <PokemonDetail pokemon={selectedPokemon} onClose={handleCloseDetail} />
            ) : (
                <>
                    <div>
                        <h2 className="filter-title">Pokémon ({totalCount})</h2>
                        
                        {isLoadingAll && (
                            <div className="loading-message">Cargando todos los Pokémon de este tipo...</div>
                        )}
                        <div className="pokemon-grid">
                            {pokemonList.map(pokemon => (
                                <PokemonCard
                                    key={pokemon.id}
                                    pokemon={pokemon}
                                    onClick={handleSelectPokemon}
                                />
                            ))}
                        </div>
                        
                        {loading && (
                            <div className="loading-spinner"></div>
                        )}
                        
                        {!loading && hasMore && (
                            <div>
                                <button
                                    onClick={loadMore}
                                    className="load-more-button"
                                >
                                    <ShinyText text="Cargar 50 más" className="text-white" />
                                </button>
                            </div>
                        )}
                        
                        {!loading && !hasMore && pokemonList.length > 0 && (
                            <div>
                                <button
                                    onClick={resetList}
                                    className="load-more-button"
                                >
                                    Cerrar catálogo
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};