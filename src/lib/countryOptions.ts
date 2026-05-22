import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import type { CountryCode } from 'libphonenumber-js';
import es from 'react-phone-number-input/locale/es.json';

export interface CountryOption {
  value: CountryCode; // ISO 3166-1 alpha-2, e.g. 'PE'
  label: string;      // Nombre en español, e.g. 'Perú'
  phoneCode: string;  // e.g. '+51'
}

/** Países de LATAM con prioridad en la lista */
const LATAM_PRIORITY: CountryCode[] = [
  'PE', 'CO', 'EC', 'VE', 'BO', 'CL', 'AR', 'BR', 'MX',
  'UY', 'PY', 'CR', 'PA', 'GT', 'SV', 'HN', 'NI', 'DO', 'CU', 'PR',
];

function getLabel(code: CountryCode): string {
  return (es as Record<string, string>)[code] ?? code;
}

function buildOptions(): CountryOption[] {
  const all = getCountries().map((code) => ({
    value: code,
    label: getLabel(code),
    phoneCode: `+${getCountryCallingCode(code)}`,
  }));

  const latam = LATAM_PRIORITY
    .filter((c) => all.some((o) => o.value === c))
    .map((c) => all.find((o) => o.value === c)!);

  const rest = all
    .filter((o) => !LATAM_PRIORITY.includes(o.value))
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));

  return [...latam, ...rest];
}

/** Lista completa de países ordenada: LATAM primero, luego el resto alfabético */
export const COUNTRY_OPTIONS: CountryOption[] = buildOptions();

/** Busca un país por su ISO code */
export function findCountry(iso: string): CountryOption | undefined {
  return COUNTRY_OPTIONS.find((c) => c.value === iso);
}
