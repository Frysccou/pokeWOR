import { useState, useEffect } from 'react';
import { Pokemon, PokemonSpecies, PokemonEvolutionChain, PokemonAbility, PokemonMove } from '../types/pokemon.types';
import { fetchPokemonSpecies, fetchPokemonEvolutionChain, fetchPokemonByNameOrId } from '../services/api';

interface PokemonDetailProps {
    pokemon: Pokemon;
    onClose: () => void;
}

interface ExtendedPokemonData {
    species?: PokemonSpecies;
    evolutionChain?: PokemonEvolutionChain;
    abilities?: PokemonAbility[];
    moves?: PokemonMove[];
}

export const PokemonDetail = ({ pokemon, onClose }: PokemonDetailProps) => {
    const [extendedData, setExtendedData] = useState<ExtendedPokemonData>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    const [showShiny, setShowShiny] = useState(false);

    useEffect(() => {
        const fetchExtendedData = async () => {
            setLoading(true);
            try {
                const species = await fetchPokemonSpecies(pokemon.id);
                
                let evolutionChain = null;
                if (species.evolution_chain?.url) {
                    evolutionChain = await fetchPokemonEvolutionChain(species.evolution_chain.url);
                }
                
                setExtendedData({
                    species,
                    evolutionChain
                });
            } catch (error) {
                console.error('Error al cargar datos extendidos:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchExtendedData();
    }, [pokemon.id]);

    const getSpanishDescription = () => {
        if (!extendedData.species) return '';
        
        const spanishEntry = extendedData.species.flavor_text_entries?.find(
            entry => entry.language.name === 'es'
        );
        
        return spanishEntry ? spanishEntry.flavor_text : '';
    };

    const renderEvolutionChain = () => {
        if (!extendedData.evolutionChain) return <p>Información de evolución no disponible</p>;
        
        const chain = extendedData.evolutionChain.chain;
        const evolutions = [];
        
        const basePokemon = chain.species.name;
        evolutions.push(basePokemon);
        
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(evolution => {
                const secondForm = evolution.species.name;
                evolutions.push({
                    name: secondForm,
                    trigger: evolution.evolution_details[0]?.trigger.name,
                    level: evolution.evolution_details[0]?.min_level,
                    item: evolution.evolution_details[0]?.item?.name
                });
                
                if (evolution.evolves_to.length > 0) {
                    evolution.evolves_to.forEach(thirdEvo => {
                        const thirdForm = thirdEvo.species.name;
                        evolutions.push({
                            name: thirdForm,
                            trigger: thirdEvo.evolution_details[0]?.trigger.name,
                            level: thirdEvo.evolution_details[0]?.min_level,
                            item: thirdEvo.evolution_details[0]?.item?.name
                        });
                    });
                }
            });
        }
        
        return (
            <div className="evolution-chain">
                <h3 className="detail-info-title">Cadena de Evolución</h3>
                <div className="evolution-container">
                    {evolutions.map((evo, index) => {
                        if (index === 0) {
                            return (
                                <div key={evo} className="evolution-item">
                                    <div className="evolution-pokemon">
                                        <img 
                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromName(evo)}.png`}
                                            alt={evo}
                                            className="evolution-image"
                                        />
                                        <span className="evolution-name capitalize">{evo}</span>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={evo.name} className="evolution-item">
                                    <div className="evolution-arrow">
                                        <span className="evolution-details">
                                            {evo.level ? `Nivel ${evo.level}` : ''}
                                            {evo.item ? `Item: ${evo.item}` : ''}
                                            {!evo.level && !evo.item ? evo.trigger : ''}
                                        </span>
                                        →
                                    </div>
                                    <div className="evolution-pokemon">
                                        <img 
                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromName(evo.name)}.png`}
                                            alt={evo.name}
                                            className="evolution-image"
                                        />
                                        <span className="evolution-name capitalize">{evo.name}</span>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        );
    };

    const getPokemonIdFromName = (name: string): number => {
        const demoIds: Record<string, number> = {
            bulbasaur: 1, ivysaur: 2, venusaur: 3,
            charmander: 4, charmeleon: 5, charizard: 6,
            squirtle: 7, wartortle: 8, blastoise: 9,
            pikachu: 25, raichu: 26
        };
        
        return demoIds[name] || pokemon.id;
    };

    const renderMoves = () => {
        if (!pokemon.moves || pokemon.moves.length === 0) {
            return <p>No hay información de movimientos disponible</p>;
        }
        
        const limitedMoves = pokemon.moves.slice(0, 20);
        
        return (
            <div className="moves-container">
                <h3 className="detail-info-title">Movimientos</h3>
                <div className="moves-grid">
                    {limitedMoves.map((moveInfo, index) => (
                        <div key={index} className="move-item">
                            <span className="move-name capitalize">{moveInfo.move.name.replace('-', ' ')}</span>
                            <span className="move-level">
                                {moveInfo.version_group_details[0]?.level_learned_at > 0 
                                    ? `Nivel ${moveInfo.version_group_details[0].level_learned_at}` 
                                    : moveInfo.version_group_details[0]?.move_learn_method.name}
                            </span>
                        </div>
                    ))}
                </div>
                {pokemon.moves.length > 20 && (
                    <p className="moves-note">Mostrando 20 de {pokemon.moves.length} movimientos</p>
                )}
            </div>
        );
    };

    const renderStats = () => {
        return (
            <div className="stats-container">
                <h3 className="detail-info-title">Estadísticas</h3>
                {pokemon.stats.map(stat => (
                    <div key={stat.stat.name} className="stat-item">
                        <div className="stat-header">
                            <span className="stat-name">{translateStatName(stat.stat.name)}</span>
                            <span className="stat-value">{stat.base_stat}</span>
                        </div>
                        <div className="stat-bar-bg">
                            <div 
                                className={`stat-bar-fill ${getStatColorClass(stat.base_stat)}`}
                                style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
                <div className="stat-total">
                    <span className="stat-total-label">Total</span>
                    <span className="stat-total-value">
                        {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                    </span>
                </div>
            </div>
        );
    };

    const translateStatName = (statName: string): string => {
        const translations: Record<string, string> = {
            'hp': 'PS',
            'attack': 'Ataque',
            'defense': 'Defensa',
            'special-attack': 'Ataque Esp.',
            'special-defense': 'Defensa Esp.',
            'speed': 'Velocidad'
        };
        
        return translations[statName] || statName;
    };

    const renderBasicInfo = () => {
        return (
            <>
                <div className="detail-info-section">
                    <h3 className="detail-info-title">Información básica</h3>
                    <div className="detail-info-grid">
                        <div className="detail-info-item">
                            <span className="detail-info-label">Altura</span>
                            <span className="detail-info-value">{pokemon.height / 10} m</span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-info-label">Peso</span>
                            <span className="detail-info-value">{pokemon.weight / 10} kg</span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-info-label">Experiencia base</span>
                            <span className="detail-info-value">{pokemon.base_experience || 'N/A'}</span>
                        </div>
                        <div className="detail-info-item detail-info-full">
                            <span className="detail-info-label">Habilidades</span>
                            <span className="detail-info-value capitalize">
                                {pokemon.abilities.map((a, index) => (
                                    <span key={a.ability.name}>
                                        {a.ability.name.replace('-', ' ')}
                                        {a.is_hidden && ' (oculta)'}
                                        {index < pokemon.abilities.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
                
                {extendedData.species && (
                    <div className="detail-info-section">
                        <h3 className="detail-info-title">Especie</h3>
                        <div className="detail-info-grid">
                            <div className="detail-info-item">
                                <span className="detail-info-label">Categoría</span>
                                <span className="detail-info-value">
                                    {extendedData.species.genera?.find(g => g.language.name === 'es')?.genus || 
                                     extendedData.species.genera?.find(g => g.language.name === 'en')?.genus || 'N/A'}
                                </span>
                            </div>
                            <div className="detail-info-item">
                                <span className="detail-info-label">Tasa de captura</span>
                                <span className="detail-info-value">{extendedData.species.capture_rate}</span>
                            </div>
                            <div className="detail-info-item">
                                <span className="detail-info-label">Felicidad base</span>
                                <span className="detail-info-value">{extendedData.species.base_happiness}</span>
                            </div>
                            <div className="detail-info-item">
                                <span className="detail-info-label">Tipo</span>
                                <span className="detail-info-value">
                                    {extendedData.species.is_legendary ? 'Legendario' : 
                                     extendedData.species.is_mythical ? 'Mítico' : 
                                     extendedData.species.is_baby ? 'Bebé' : 'Normal'}
                                </span>
                            </div>
                            <div className="detail-info-item detail-info-full">
                                <span className="detail-info-label">Descripción</span>
                                <span className="detail-info-value description-text">
                                    {getSpanishDescription()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderTabs = () => {
        return (
            <div className="detail-tabs">
                <button 
                    className={`detail-tab ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Información
                </button>
                <button 
                    className={`detail-tab ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Estadísticas
                </button>
                <button 
                    className={`detail-tab ${activeTab === 'moves' ? 'active' : ''}`}
                    onClick={() => setActiveTab('moves')}
                >
                    Movimientos
                </button>
                <button 
                    className={`detail-tab ${activeTab === 'evolution' ? 'active' : ''}`}
                    onClick={() => setActiveTab('evolution')}
                >
                    Evolución
                </button>
            </div>
        );
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'info':
                return renderBasicInfo();
            case 'stats':
                return renderStats();
            case 'moves':
                return renderMoves();
            case 'evolution':
                return renderEvolutionChain();
            default:
                return renderBasicInfo();
        }
    };

    const toggleShiny = () => {
        setShowShiny(!showShiny);
    };

    return (
        <div className="pokemon-detail">
            <div className="detail-header">
                <button 
                    onClick={onClose}
                    className="back-button-minimal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                    <span>Volver</span>
                </button>
                <h2 className="detail-title capitalize">{pokemon.name}</h2>
            </div>
            
            <div className="detail-content">
                <div className="detail-image-wrapper">
                    <img 
                        src={showShiny 
                            ? (pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny) 
                            : (pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default)} 
                        alt={pokemon.name} 
                        className="detail-image"
                    />
                    <button 
                        onClick={toggleShiny} 
                        className="shiny-toggle-button"
                        title={showShiny ? "Ver versión normal" : "Ver versión shiny"}
                    >
                        {showShiny ? "Normal" : "Shiny"}
                    </button>
                    <div className="detail-types">
                        {pokemon.types.map(typeInfo => (
                            <span 
                                key={typeInfo.type.name} 
                                className={`pokemon-type ${typeInfo.type.name}`}
                            >
                                {typeInfo.type.name}
                            </span>
                        ))}
                    </div>
                    <div className="detail-id">#{pokemon.id}</div>
                </div>
                
                <div className="detail-info">
                    {renderTabs()}
                    <div className="detail-tab-content">
                        {loading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            renderActiveTabContent()
                        )}
                    </div>
                </div>
            </div>
            
            <button onClick={onClose} className="back-button">
                Volver a la lista
            </button>
        </div>
    );
};

function getStatColorClass(value: number): string {
    if (value < 50) return 'stat-low';
    if (value < 90) return 'stat-medium';
    return 'stat-high';
}