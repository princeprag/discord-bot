const seaCreatures = [
  "walrus",
  "seal",
  "fish",
  "shark",
  "clam",
  "coral",
  "whale",
  "crab",
  "lobster",
  "starfish",
  "eel",
  "dolphin",
  "squid",
  "jellyfish",
  "ray",
  "shrimp",
  "mantaRay",
  "angler",
  "snorkler",
  "scubaDiver",
  "urchin",
  "anemone",
  "morel",
  "axolotl",
];

const seaObjects = [
  "boat",
  "ship",
  "submarine",
  "yacht",
  "dinghy",
  "raft",
  "kelp",
  "seaweed",
  "anchor",
];

const adjectives = [
  "cute",
  "adorable",
  "lovable",
  "happy",
  "sandy",
  "bubbly",
  "friendly",
  "floating",
  "drifting",
];

const sizes = ["large", "big", "small", "giant", "massive", "tiny", "little"];

const creatureAdjectives = ["swimming", "sleeping", "eating", "hiding"];

const colors = [
  "blue",
  "blueGreen",
  "darkCyan",
  "electricBlue",
  "greenBlue",
  "lightCyan",
  "lightSeaGreen",
  "seaGreen",
  "turquoise",
  "aqua",
  "aquamarine",
  "teal",
  "cyan",
  "gray",
  "darkBlue",
  "cerulean",
  "azure",
  "lapis",
  "navy",
];

const seaList = seaObjects.concat(seaCreatures);

const combinedAdjectives = adjectives.concat(sizes);

const random = (items: string[]) => items[(Math.random() * items.length) | 0];

const randomNoun = () => random(seaList);

const randomAdjective = (noun: string) => {
  if (!seaCreatures.includes(noun)) {
    return random(combinedAdjectives);
  }
  return random(combinedAdjectives.concat(creatureAdjectives));
};

const format = (string: string) => string[0].toUpperCase() + string.slice(1);

const randomColor = () => random(colors);

const combineUsername = (
  len: number,
  adjective: string,
  color: string,
  noun: string
) => {
  if ((adjective + color + noun).length <= len) {
    return adjective + color + noun;
  }
  if ((adjective + noun).length <= len) {
    return adjective + noun;
  }
  if ((color + noun).length <= len) {
    return color + noun;
  }
  return noun.slice(0, len);
};

export const generateUsername = (len: number): string => {
  const noun = format(randomNoun());
  const adjective = format(randomAdjective(noun));
  const color = format(randomColor());
  return combineUsername(len, adjective, color, noun);
};
