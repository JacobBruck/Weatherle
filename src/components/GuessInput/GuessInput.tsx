import { useId, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { CITIES } from '../../data/cities';
import type { City } from '../../types/city';
import styles from './GuessInput.module.css';

interface GuessInputProps {
  onSubmitGuess: (city: City) => void;
  disabled: boolean;
  guessedCityIds: string[];
  placeholder?: string;
}

const MAX_SUGGESTIONS = 8;

function matchesQuery(city: City, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return city.name.toLowerCase().startsWith(q) || city.country.toLowerCase().startsWith(q) || city.name.toLowerCase().includes(q);
}

export function GuessInput({ onSubmitGuess, disabled, guessedCityIds, placeholder }: GuessInputProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const listboxId = useId();

  const guessedSet = useMemo(() => new Set(guessedCityIds), [guessedCityIds]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const startsWith: City[] = [];
    const includes: City[] = [];
    for (const city of CITIES) {
      if (guessedSet.has(city.id)) continue;
      const name = city.name.toLowerCase();
      const q = query.trim().toLowerCase();
      if (name.startsWith(q)) startsWith.push(city);
      else if (matchesQuery(city, query)) includes.push(city);
      if (startsWith.length + includes.length >= MAX_SUGGESTIONS * 3) break;
    }
    return [...startsWith, ...includes].slice(0, MAX_SUGGESTIONS);
  }, [query, guessedSet]);

  function optionId(index: number): string {
    return `${listboxId}-option-${index}`;
  }

  function selectCity(city: City) {
    onSubmitGuess(city);
    setQuery('');
    setActiveIndex(0);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        event.preventDefault();
        selectCity(suggestions[activeIndex]);
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  }

  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        type="text"
        role="combobox"
        aria-label="Guess the city"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && suggestions.length > 0 ? optionId(activeIndex) : undefined}
        autoComplete="off"
        placeholder={placeholder ?? 'Type a city name…'}
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={handleKeyDown}
      />
      {open && query.trim() && (
        <>
          <div className={styles.backdrop} aria-hidden="true" onMouseDown={(e) => e.preventDefault()} />
          <ul className={styles.dropdown + ' glass'} id={listboxId} role="listbox">
          {suggestions.length === 0 && <li className={styles.empty}>No matching cities</li>}
          {suggestions.map((city, index) => (
            <li
              key={city.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              className={`${styles.option} ${index === activeIndex ? styles.optionActive : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectCity(city)}
            >
              <span className={styles.optionName}>{city.name}</span>
              <span className={styles.optionCountry}>{city.country}</span>
            </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}
