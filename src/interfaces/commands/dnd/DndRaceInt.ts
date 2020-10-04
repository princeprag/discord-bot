interface Ability {
  name: string;
  url: string;
  bonus: number;
}

interface Languages {
  url: string;
  name: string;
}

interface DndRaceInt {
  _id: string;
  index: string;
  name: string;
  speed: number;
  ability_bonuses: Ability[];
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: Record<string, unknown>[];
  starting_proficiency_options: Record<string, unknown>[];
  languages: Languages[];
  language_desc: string;
  traits: Record<string, unknown>[];
  subraces: Record<string, unknown>[];
  url: string;
  error?: string;
}

export default DndRaceInt;
