interface DndSpellInt {
  _id: string;
  index: string;
  name: string;
  desc: string[];
  higher_level: string[];
  range: string;
  components: string[];
  material: string;
  ritual: string;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  school: Record<string, unknown>;
  classes: Record<string, unknown>[];
  subclasses: Record<string, unknown>[];
  url: string;
  error?: string;
}

export default DndSpellInt;
