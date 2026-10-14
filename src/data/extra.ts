// Derived lists (not copy). Photos are the client's own gallery images from /gallery/, in published order.
// Category and alt text are our reading of each photo — confirm with the client.

export type Cat = 'kitchens' | 'bathrooms' | 'interiors' | 'extensions' | 'lofts' | 'outdoor';
export const cats: { id: Cat; label: string }[] = [
  { id: 'kitchens', label: 'Kitchens' },
  { id: 'bathrooms', label: 'Bathrooms' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'extensions', label: 'Extensions' },
  { id: 'lofts', label: 'Lofts' },
  { id: 'outdoor', label: 'Outdoor' },
];

// Which gallery categories illustrate each service
export const serviceCats: Record<string, Cat[]> = {
  refurbishments: ['kitchens', 'bathrooms', 'interiors'],
  extensions: ['extensions'],
  'loft-conversion': ['lofts'],
};

export const photos = [
  { n: '01', w: 1024, h: 768, cat: 'kitchens', alt: "Fitted kitchen with built-in ovens" },
  { n: '02', w: 768, h: 1024, cat: 'bathrooms', alt: "Marble-effect shower room" },
  { n: '03', w: 768, h: 1024, cat: 'bathrooms', alt: "Marble-effect bathroom with towel rail" },
  { n: '04', w: 768, h: 1024, cat: 'kitchens', alt: "Navy kitchen with marble-effect worktop" },
  { n: '05', w: 1024, h: 768, cat: 'kitchens', alt: "Navy kitchen island with hob" },
  { n: '06', w: 768, h: 1024, cat: 'kitchens', alt: "Kitchen sink under the window" },
  { n: '07', w: 768, h: 1024, cat: 'outdoor', alt: "New patio around a lawn" },
  { n: '08', w: 768, h: 1024, cat: 'lofts', alt: "Bungalow under scaffolding" },
  { n: '09', w: 1024, h: 768, cat: 'lofts', alt: "Finished house with new dormers" },
  { n: '10', w: 768, h: 1024, cat: 'interiors', alt: "Lit feature ceiling" },
  { n: '11', w: 768, h: 1024, cat: 'interiors', alt: "Lit display niche" },
  { n: '12', w: 768, h: 1024, cat: 'kitchens', alt: "Grey gloss kitchen" },
  { n: '13', w: 1024, h: 768, cat: 'kitchens', alt: "Grey kitchen with built-in oven" },
  { n: '14', w: 1024, h: 768, cat: 'kitchens', alt: "Kitchen with under-cabinet lighting" },
  { n: '15', w: 768, h: 1024, cat: 'interiors', alt: "Oak double doors" },
  { n: '16', w: 1024, h: 768, cat: 'interiors', alt: "Hallway and staircase" },
  { n: '17', w: 1024, h: 768, cat: 'interiors', alt: "Living room with wood floor" },
  { n: '18', w: 1024, h: 768, cat: 'interiors', alt: "Open-plan kitchen and dining room" },
  { n: '19', w: 1024, h: 768, cat: 'interiors', alt: "Slatted feature wall and dining area" },
  { n: '20', w: 768, h: 1024, cat: 'interiors', alt: "Staircase and landing" },
  { n: '21', w: 768, h: 1024, cat: 'kitchens', alt: "White kitchen with black worktop" },
  { n: '22', w: 768, h: 1024, cat: 'kitchens', alt: "Kitchen hob and extractor" },
  { n: '23', w: 1024, h: 768, cat: 'extensions', alt: "Brick garden room" },
  { n: '24', w: 768, h: 1024, cat: 'bathrooms', alt: "Shower room with patterned tiles" },
  { n: '25', w: 768, h: 1024, cat: 'bathrooms', alt: "Bathroom with counter basin" },
  { n: '26', w: 768, h: 1024, cat: 'bathrooms', alt: "Walk-in shower with marble-effect tiles" },
  { n: '27', w: 768, h: 1024, cat: 'bathrooms', alt: "Marble-effect toilet niche" },
  { n: '28', w: 768, h: 1024, cat: 'bathrooms', alt: "Feature-tiled shower" },
  { n: '29', w: 768, h: 1024, cat: 'bathrooms', alt: "Shower cabin" },
  { n: '30', w: 768, h: 1024, cat: 'lofts', alt: "Loft room with sloped ceiling" },
  { n: '31', w: 768, h: 1024, cat: 'kitchens', alt: "Kitchen with large floor tiles" },
  { n: '32', w: 768, h: 1024, cat: 'extensions', alt: "Brickwork going up" },
  { n: '33', w: 768, h: 1024, cat: 'extensions', alt: "Single-storey extension under construction" },
  { n: '34', w: 768, h: 1024, cat: 'bathrooms', alt: "Bathroom with counter basin and wall-hung toilet" },
  { n: '35', w: 768, h: 1024, cat: 'bathrooms', alt: "Tall bathroom cabinet" },
  { n: '36', w: 768, h: 1024, cat: 'extensions', alt: "Membrane laid for a new floor slab" },
  { n: '37', w: 768, h: 1024, cat: 'kitchens', alt: "White kitchen with black marble floor" },
  { n: '38', w: 768, h: 1024, cat: 'kitchens', alt: "Kitchen with back door" },
  { n: '39', w: 768, h: 1024, cat: 'kitchens', alt: "Room with pendant lights" },
  { n: '40', w: 768, h: 1024, cat: 'lofts', alt: "Tile-hung dormer under construction" },
  { n: '41', w: 768, h: 1024, cat: 'lofts', alt: "Dormer on scaffolding" },
  { n: '42', w: 768, h: 1024, cat: 'interiors', alt: "Chimney breast being opened up" },
] as const;

export const img = (n: string, small = false) => `/img/work/${n}${small ? '-s' : ''}.webp`;
export const byCat = (c: Cat[]) => photos.filter((p) => c.includes(p.cat as Cat));
