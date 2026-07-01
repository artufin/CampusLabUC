export interface PlantConfig {
  /** Stable slug used as the resulting OpenDataDataset id — never change once shipped. */
  id: string;
  /** Exact plant name string as returned by FusionSolar's station-list, used to match. */
  fusionSolarName: string;
  /** Short display label for titles/tags. */
  label: string;
  /** Physical location description shown in the dataset's source.location field. */
  location: string;
}

export const PLANTS: PlantConfig[] = [
  {
    id: "solar-cai",
    fusionSolarName: "I0 13 - PUC San Joaquín - CAI",
    label: "CAi",
    location: "Centro de Aprendizaje e Innovación (CAi), Campus San Joaquín UC",
  },
  {
    id: "solar-hall-central",
    fusionSolarName: "PUC San Joaquín - Hall Central",
    label: "Hall Central",
    location: "Hall Central, Campus San Joaquín UC",
  },
  {
    id: "solar-punto-limpio",
    fusionSolarName: "PUC San Joaquín - Punto Limpio",
    label: "Punto Limpio",
    location: "Punto Limpio, Campus San Joaquín UC",
  },
];
