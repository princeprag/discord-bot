interface DndMonInt {
  _id: string;
  index: string;
  name: string;
  size: string;
  type: string;
  subtype: string;
  alignment: string;
  armor_class: number;
  hit_points: number;
  hit_dice: number;
  speed: Record<string, unknown>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: unknown[];
  damage_vulnerabilities: unknown[];
  damage_immunities: unknown[];
  condition_immunities: unknown[];
  senses: Record<string, unknown>;
  languages: string;
  challenge_rating: number;
  special_abilities: Record<string, unknown>[];
  actions: Record<string, unknown>[];
  url: string;
  error?: string;
}

export default DndMonInt;
