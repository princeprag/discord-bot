interface ProficientFrom {
  url: string;
  name: string;
}

interface ProficientChoices {
  choose: number;
  type: string;
  from: Array<ProficientFrom>;
}

interface Proficient {
  name: string;
  url: string;
}

interface DndClassInt {
  _id: string;
  index: string;
  name: string;
  hit_die: number;
  proficiency_choices: ProficientChoices[];
  proficiencies: Proficient[];
  saving_throws: Record<string, unknown>[];
  starting_equipment: Record<string, unknown>;
  class_levels: Record<string, unknown>;
  subclasses: Record<string, unknown>[];
  spellcasting: Record<string, unknown>;
  url: string;
  error?: string;
}

export default DndClassInt;
