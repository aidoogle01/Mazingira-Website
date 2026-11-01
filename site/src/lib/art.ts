// Art direction: which of Mazingira's own photos leads each page. Curation, not content, so it lives
// with the site. Photos repeated across many trips on the old site (Arusha town, one elephant herd) are
// avoided as heroes where something better exists.
//
// INTERIM: entries marked "interim" are Mazingira's best existing photos standing in until the photo
// shoot. Each is honest for its trip (the animal or scene is one the trip includes) but is not from that
// trip's own page on the old site. Replace them with shoot photos when they arrive, then delete the mark.

// Hero at the top of each trip page, its card on the Safaris page and its band on Home. Needs a sharp
// photo that survives both a full-width crop and a 3:2 crop.
export const TRIP_HERO: Record<string, string> = {
  'savannah-to-shore': '1ac0ef_1aa46308', // interim: elephant herd (old site: Serengeti), 2000px
  'great-migration-river-crossing': '1ac0ef_914921ce', // interim: Mazingira Land Cruiser on a track, 2000px
  'serengeti-under-the-stars': '1ac0ef_6354a58d', // interim: Serengeti camp at sunrise, 2000px
  'honeymoon-safari-and-zanzibar': '1ac0ef_2c70ca51',
  'serengeti-romantic-escape': '1ac0ef_45d4443f',
  'family-wilderness-adventure': '1ac0ef_5e6ebcd0', // interim: three giraffes, 2000px
  'winged-wonders-birding': '1ac0ef_1734d799',
  'wildlife-photography-safari': '1ac0ef_56c2e1e9', // interim: male lion on a Serengeti track, 2000px
  'kilimanjaro-machame-7-day': '1ac0ef_ca29fe0e',
};

// Second photo for the full-width band part-way down the itinerary.
export const TRIP_BAND: Record<string, string> = {
  'savannah-to-shore': '1ac0ef_16abc605', // the trip's own banner: dhows off Zanzibar
  'great-migration-river-crossing': '1ac0ef_1aa46308',
  'serengeti-under-the-stars': '1ac0ef_5ab8ed44',
  'honeymoon-safari-and-zanzibar': '1ac0ef_3d3287c1',
  'serengeti-romantic-escape': '1ac0ef_3d3287c1',
  'family-wilderness-adventure': '1ac0ef_149d2e5c', // the trip's own banner: lionesses and cubs
  'winged-wonders-birding': '1ac0ef_0b3a5d3b',
  'wildlife-photography-safari': '1ac0ef_32426bc6', // the trip's own photo: leopard
  'kilimanjaro-machame-7-day': '1ac0ef_c7542f65',
};

// Trips featured on Home as full-width photo bands, in order. Each needs a 2000px TRIP_HERO.
export const HOME_TRIPS = ['savannah-to-shore', 'great-migration-river-crossing', 'honeymoon-safari-and-zanzibar'];
