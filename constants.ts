
import { Costume, CostumeCategory } from './types';

export const COSTUMES: Costume[] = [
  // Anime
  { id: 'c1', name: 'Naruto Ninja', category: CostumeCategory.ANIME, thumbnailUrl: 'https://picsum.photos/seed/naruto/400/600' },
  { id: 'c2', name: 'Demon Slayer Corps', category: CostumeCategory.ANIME, thumbnailUrl: 'https://picsum.photos/seed/demonslayer/400/600' },
  { id: 'c3', name: 'Attack on Titan Gear', category: CostumeCategory.ANIME, thumbnailUrl: 'https://picsum.photos/seed/aot/400/600' },
  { id: 'c4', name: 'Goku Gi', category: CostumeCategory.ANIME, thumbnailUrl: 'https://picsum.photos/seed/goku/400/600' },
  { id: 'c5', name: 'Sailor Moon Uniform', category: CostumeCategory.ANIME, thumbnailUrl: 'https://picsum.photos/seed/sailormoon/400/600' },
  
  // Gaming
  { id: 'c6', name: 'Master Chief', category: CostumeCategory.GAMING, thumbnailUrl: 'https://picsum.photos/seed/masterchief/400/600' },
  { id: 'c7', name: 'Link from Zelda', category: CostumeCategory.GAMING, thumbnailUrl: 'https://picsum.photos/seed/link/400/600' },
  { id: 'c8', name: 'Witcher Armor', category: CostumeCategory.GAMING, thumbnailUrl: 'https://picsum.photos/seed/witcher/400/600' },
  { id: 'c9', name: 'Kratos War Paint', category: CostumeCategory.GAMING, thumbnailUrl: 'https://picsum.photos/seed/kratos/400/600' },
  { id: 'c10', name: 'Ezio Auditore', category: CostumeCategory.GAMING, thumbnailUrl: 'https://picsum.photos/seed/ezio/400/600' },

  // Movies
  { id: 'c11', name: 'Stormtrooper', category: CostumeCategory.MOVIES, thumbnailUrl: 'https://picsum.photos/seed/stormtrooper/400/600' },
  { id: 'c12', name: 'Batman Suit', category: CostumeCategory.MOVIES, thumbnailUrl: 'https://picsum.photos/seed/batman/400/600' },
  { id: 'c13', name: 'Wonder Woman', category: CostumeCategory.MOVIES, thumbnailUrl: 'https://picsum.photos/seed/wonderwoman/400/600' },
  { id: 'c14', name: 'Spider-Man Suit', category: CostumeCategory.MOVIES, thumbnailUrl: 'https://picsum.photos/seed/spiderman/400/600' },
  { id: 'c15', name: 'Jedi Knight', category: CostumeCategory.MOVIES, thumbnailUrl: 'https://picsum.photos/seed/jedi/400/600' },

  // Fantasy
  { id: 'c16', name: 'Medieval Knight', category: CostumeCategory.FANTASY, thumbnailUrl: 'https://picsum.photos/seed/knight/400/600' },
  { id: 'c17', name: 'Wizard Robes', category: CostumeCategory.FANTASY, thumbnailUrl: 'https://picsum.photos/seed/wizard/400/600' },
  { id: 'c18', name: 'Vampire Gothic', category: CostumeCategory.FANTASY, thumbnailUrl: 'https://picsum.photos/seed/vampire/400/600' },
  { id: 'c19', name: 'Elven Archer', category: CostumeCategory.FANTASY, thumbnailUrl: 'https://picsum.photos/seed/elf/400/600' },
  { id: 'c20', name: 'Dwarven Warrior', category: CostumeCategory.FANTASY, thumbnailUrl: 'https://picsum.photos/seed/dwarf/400/600' },
];

export const CATEGORIES: CostumeCategory[] = [
  CostumeCategory.ANIME,
  CostumeCategory.GAMING,
  CostumeCategory.MOVIES,
  CostumeCategory.FANTASY,
];
