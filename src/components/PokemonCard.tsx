import { useState } from 'react';
import { Pokemon } from '../types/pokemon.types';

interface PokemonCardProps {
    pokemon: Pokemon;
    onClick: (pokemon: Pokemon) => void;
}

export const PokemonCard = ({ pokemon, onClick }: PokemonCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showShiny, setShowShiny] = useState(false);
    
    const getBackgroundGradient = () => {
        const mainType = pokemon.types[0]?.type.name || 'normal';
        const secondType = pokemon.types[1]?.type.name;
        
        const typeColors: Record<string, string> = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        
        const mainColor = typeColors[mainType] || '#2a2a2a';
        const secondColor = secondType ? typeColors[secondType] : mainColor;
        
        return {
            background: `linear-gradient(135deg, ${mainColor}33 0%, ${secondColor}33 100%)`,
            borderColor: mainColor
        };
    };
    
    const getStatColor = (value: number) => {
        if (value < 50) return '#f87171';
        if (value < 90) return '#facc15';
        return '#4ade80';
    };
    
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    
    const highestStat = pokemon.stats.reduce((highest, stat) => 
        stat.base_stat > highest.value ? { name: stat.stat.name, value: stat.base_stat } : highest, 
        { name: '', value: 0 }
    );
    
    const translateStatName = (statName: string): string => {
        const translations: Record<string, string> = {
            'hp': 'PS',
            'attack': 'ATK',
            'defense': 'DEF',
            'special-attack': 'SP.ATK',
            'special-defense': 'SP.DEF',
            'speed': 'VEL'
        };
        
        return translations[statName] || statName;
    };
    
    const toggleShiny = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowShiny(!showShiny);
    };
    
    const backgroundStyle = getBackgroundGradient();

    return (
        <div
            className="pokemon-card"
            onClick={() => onClick(pokemon)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                borderLeft: `4px solid ${backgroundStyle.borderColor}`,
                borderBottom: `4px solid ${backgroundStyle.borderColor}`,
                position: 'relative'
            }}
        >
            <div className="pokemon-image-container" style={{ background: backgroundStyle.background }}>
                <img
                    src={showShiny 
                        ? (pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny) 
                        : (pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default)}
                    alt={pokemon.name}
                    className="pokemon-image"
                    onClick={toggleShiny}
                    title="Clic para ver versión shiny/normal"
                />
                <div className="pokemon-id">#{pokemon.id}</div>
            </div>
            
            <div className="pokemon-card-content">
                <h3 className="pokemon-name">{pokemon.name}</h3>
                
                <div className="pokemon-types">
                    {pokemon.types.map(typeInfo => (
                        <span
                            key={typeInfo.type.name}
                            className={`pokemon-type ${typeInfo.type.name}`}
                        >
                            {typeInfo.type.name}
                        </span>
                    ))}
                </div>
                
                {isHovered && (
                    <div className="pokemon-stats-preview">
                        <div className="pokemon-stat-row">
                            <span className="pokemon-stat-label">Total</span>
                            <span className="pokemon-stat-value">{totalStats}</span>
                        </div>
                        
                        <div className="pokemon-stat-row">
                            <span className="pokemon-stat-label">Mejor stat</span>
                            <span className="pokemon-stat-value">
                                {translateStatName(highestStat.name)}: {highestStat.value}
                            </span>
                        </div>
                        
                        <div className="pokemon-abilities">
                            <span className="pokemon-abilities-label">Habilidades:</span>
                            <span className="pokemon-abilities-value">
                                {pokemon.abilities.map((a, index) => (
                                    <span key={a.ability.name} className="pokemon-ability">
                                        {a.ability.name.replace('-', ' ')}
                                        {a.is_hidden && ' (H)'}
                                        {index < pokemon.abilities.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};