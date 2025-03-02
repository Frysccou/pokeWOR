import { PokemonType } from '../types/pokemon.types';

interface FilterOptionsProps {
    onFilterChange: (type: PokemonType | undefined) => void;
    selectedType: string | undefined;
}

export const FilterOptions = ({ onFilterChange, selectedType }: FilterOptionsProps) => {
    const types: PokemonType[] = [
        'normal', 'fire', 'water', 'electric', 'grass',
        'ice', 'fighting', 'poison', 'ground', 'flying',
        'psychic', 'bug', 'rock', 'ghost', 'dragon',
        'dark', 'steel', 'fairy'
    ];

    return (
        <div className="filter-container">
            <h3 className="filter-title">Filtrar por tipo:</h3>
            <div className="filter-buttons">
                <button
                    className={`filter-button ${!selectedType ? 'active' : ''}`}
                    onClick={() => onFilterChange(undefined)}
                >
                    Todos
                </button>
                {types.map(type => (
                    <button
                        key={type}
                        className={`filter-button type-${type} ${selectedType === type ? 'active' : ''}`}
                        onClick={() => onFilterChange(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};