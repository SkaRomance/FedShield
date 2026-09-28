import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  findComuneByName,
  ITALIAN_PROVINCES,
  ItalianComune,
  searchComuni,
} from "../data/geoItalianData";

interface GeoItalianPickerProps {
  city: string;
  province: string;
  cap: string;
  onChange: (fields: { city: string; province: string; cap: string }) => void;
  disabled?: boolean;
}

export default function GeoItalianPicker({
  city,
  province,
  cap,
  onChange,
  disabled = false,
}: GeoItalianPickerProps) {
  const datalistId = useId();
  const [query, setQuery] = useState(city);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(city);
  }, [city]);

  // Chiudi il menu a tendina suggerimenti cliccando fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const suggestions = useMemo<ItalianComune[]>(() => {
    if (!showDropdown || !query || query.trim().length < 1) {
      return [];
    }
    return searchComuni(query, province || undefined, 12);
  }, [showDropdown, query, province]);

  function handleSelectComune(comune: ItalianComune) {
    setQuery(comune.nome);
    setShowDropdown(false);
    onChange({
      city: comune.nome,
      province: comune.sigla,
      cap: comune.cap || cap,
    });
  }

  function handleCityInputChange(val: string) {
    setQuery(val);
    setShowDropdown(true);

    // Controlla se il valore inserito corrisponde esattamente a un comune noto
    const match = findComuneByName(val);
    if (match) {
      onChange({
        city: match.nome,
        province: match.sigla,
        cap: match.cap || cap,
      });
    } else {
      onChange({
        city: val,
        province,
        cap,
      });
    }
  }

  function handleProvinceChange(newProvince: string) {
    onChange({
      city: query,
      province: newProvince,
      cap,
    });
  }

  function handleCapChange(newCap: string) {
    onChange({
      city: query,
      province,
      cap: newCap,
    });
  }

  return (
    <>
      <div>
        <label htmlFor={`geo-province-${datalistId}`}>Provincia</label>
        <select
          id={`geo-province-${datalistId}`}
          value={province}
          disabled={disabled}
          onChange={(e) => handleProvinceChange(e.target.value)}
        >
          <option value="">-- Seleziona provincia (107) --</option>
          {ITALIAN_PROVINCES.map((p) => (
            <option key={p.sigla} value={p.sigla}>
              {p.sigla} - {p.nome} ({p.regione})
            </option>
          ))}
        </select>
      </div>

      <div ref={containerRef} style={{ position: "relative" }}>
        <label htmlFor={`geo-city-${datalistId}`}>Città / Comune (con suggerimenti rapidi)</label>
        <input
          id={`geo-city-${datalistId}`}
          type="text"
          value={query}
          disabled={disabled}
          autoComplete="off"
          placeholder="Digita comune (es. Vibo Valentia, Milano, Roma)..."
          onChange={(e) => handleCityInputChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && suggestions.length > 0 && (
          <ul
            className="geo-suggestions-dropdown"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 999,
              background: "var(--color-surface, #ffffff)",
              border: "1px solid var(--color-border, #cbd5e1)",
              borderRadius: "0 0 6px 6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxHeight: "220px",
              overflowY: "auto",
              listStyle: "none",
              margin: 0,
              padding: "4px 0",
            }}
          >
            {suggestions.map((c) => (
              <li
                key={`${c.nome}-${c.sigla}`}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "13px",
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectComune(c);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-surface-muted, #f1f5f9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span>
                  <strong>{c.nome}</strong> ({c.sigla})
                </span>
                <span style={{ color: "var(--color-text-muted, #64748b)", fontSize: "12px" }}>
                  CAP {c.cap || "-"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor={`geo-cap-${datalistId}`}>CAP</label>
        <input
          id={`geo-cap-${datalistId}`}
          type="text"
          maxLength={5}
          value={cap}
          disabled={disabled}
          placeholder="es. 89900"
          onChange={(e) => handleCapChange(e.target.value)}
        />
      </div>
    </>
  );
}
