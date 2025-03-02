import { usePokemonList } from './hooks/usePokemon';
import { PokemonList } from './components/PokemonList';
import { SearchBar } from './components/SearchBar';
import { FilterOptions } from './components/FilterOptions';

function App() {
    const { pokemonList, loading, error, hasMore, loadMore, resetList, totalCount, searchPokemon, handleTypeFilter, selectedType } = usePokemonList();

    const handleSearch = (term: string) => {
        searchPokemon(term);
    };

    return (
        <div>
            <main className="container">
                <h1>Pokédex</h1>
                <SearchBar onSearch={handleSearch} />
                <FilterOptions onFilterChange={handleTypeFilter} selectedType={selectedType} />
                <PokemonList
                    pokemonList={pokemonList}
                    loading={loading}
                    error={error}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    resetList={resetList}
                    totalCount={totalCount}
                />
            </main>
        </div>
    );
}

export default App;