import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { City } from '../../types/city';
import { formatCityRegion } from '../../utils/formatCityLabel';
import { US_STATE_NAMES } from '../../data/usStates';
import styles from './GuessInput.module.css';

interface GuessInputProps {
  cities: City[];
  onSubmitGuess: (city: City) => void;
  disabled: boolean;
  guessedCityIds: string[];
  placeholder?: string;
}

/** Common abbreviations users might type instead of a country's full name. */
const COUNTRY_ALIASES: Record<string, string> = {
  us: 'united states',
  usa: 'united states',
};

/** Lowercases and strips accents/diacritics so "bogota" matches "Bogotá" — the
 * city itself still displays with its accent, this is only used for comparison. */
const DIACRITIC_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(DIACRITIC_MARKS, '')
    .toLowerCase();
}

function matchesQuery(city: City, query: string): boolean {
  const q = normalize(query.trim());
  if (!q) return false;
  const country = normalize(city.country);
  const stateName = city.stateCode ? US_STATE_NAMES[city.stateCode] : undefined;
  return (
    normalize(city.name).startsWith(q) ||
    country.startsWith(q) ||
    normalize(city.name).includes(q) ||
    COUNTRY_ALIASES[q] === country ||
    (!!city.stateCode && normalize(city.stateCode).startsWith(q)) ||
    (!!stateName && normalize(stateName).startsWith(q))
  );
}

export function GuessInput({ cities, onSubmitGuess, disabled, guessedCityIds, placeholder }: GuessInputProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  // On iOS the keyboard overlays the layout viewport without resizing it.
  // visualViewport tracks the visible area — scroll the input to sit just
  // above the keyboard so the absolute-positioned dropdown has room above it.
  // Only listens for 'resize' (the keyboard opening/closing) — also listening
  // for 'scroll' created a feedback loop, since our own scrollBy call is
  // itself a visualViewport scroll, which re-ran this and scrolled again,
  // reading as the page endlessly drifting/jittering.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height);
      if (keyboardHeight > 0 && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const targetBottom = window.innerHeight - keyboardHeight - 16;
        const delta = rect.bottom - targetBottom;
        if (delta > 1) window.scrollBy({ top: delta });
      }
    };
    vv.addEventListener('resize', update);
    return () => vv.removeEventListener('resize', update);
  }, []);

  // Keep the highlighted suggestion visible when navigating a scrollable list with the keyboard.
  useEffect(() => {
    if (!open) return;
    const active = listboxRef.current?.querySelector('[aria-selected="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const guessedSet = useMemo(() => new Set(guessedCityIds), [guessedCityIds]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const startsWith: City[] = [];
    const includes: City[] = [];
    const q = normalize(query.trim());
    for (const city of cities) {
      if (guessedSet.has(city.id)) continue;
      const name = normalize(city.name);
      if (name.startsWith(q)) startsWith.push(city);
      else if (matchesQuery(city, query)) includes.push(city);
    }
    return [...startsWith, ...includes];
  }, [query, guessedSet, cities]);

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
        ref={inputRef}
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
          <div className={`${styles.backdrop} guess-dropdown-open`} aria-hidden="true" onMouseDown={(e) => e.preventDefault()} />
          <ul
            ref={listboxRef}
            className={styles.dropdown + ' glass'}
            id={listboxId}
            role="listbox"
          >
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
              <span className={styles.optionCountry}>{formatCityRegion(city)}</span>
            </li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}
