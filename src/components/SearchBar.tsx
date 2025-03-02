import { useState } from 'react';

interface SearchBarProps {
    onSearch: (term: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar Pokémon por nombre o número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    type="submit"
                    className="search-button"
                >
                    Buscar
                </button>
            </div>
        </form>
    );
};