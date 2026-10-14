// All copy below is verbatim from https://7seasbuilders.co.uk/ (home, /gallery/, /contact/), fetched 14 Oct 2026.
// Spelling is kept as published ("Weather it is", "Modernizing", "Loft vary in sizes") — flagged for the client.

export const site = {
  name: '7 Seas Builders',
  legalName: '7Seas Builders Ltd',
  tagline: 'Home renovation, kitchen fittings and much more',
  logoLine: 'Dream homes built on trust', // lettered in the logo artwork
  phone: '+44 7830 486657',
  phoneHref: 'tel:+447830486657',
  email: 'info@7seasbuilders.com',
  address: '12 Fairfax Rd, Woking GU22 9HW',
};

// Google Business Profile — read from Google Maps on 14 Oct 2026 (not from the old site).
// Rating/count go stale: update by hand, or wire to the Places API.
const placeId = 'ChIJW6ftoY7ZdUgRgmHw07anc08'; // decodes to CID 0x4f73a7b6d3f06182, same as the old site's "More Reviews" link
export const google = {
  name: '7 Seas Builders Limited',
  category: 'Contractor',
  rating: '5.0',
  count: 51,
  checked: '14 Oct 2026',
  placeId,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=7%20Seas%20Builders%20Limited&query_place_id=${placeId}`,
  cidUrl: 'https://maps.google.com/?cid=5725103954999665026',
  writeReviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
  geo: { lat: 51.3069549, lng: -0.5433066 },
  hours: [
    { days: 'Monday – Friday', time: '8am – 6pm', schema: { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' } },
    { days: 'Saturday', time: '8:30am – 5:30pm', schema: { dayOfWeek: ['Saturday'], opens: '08:30', closes: '17:30' } },
    { days: 'Sunday', time: 'Closed' },
  ],
};

// Location facts for local SEO: town/county from the address (postcodes.io: Woking, Surrey, South East);
// "South East of England" is the old site's own wording.
export const area = { town: 'Woking', county: 'Surrey', region: 'South East of England' };

// Old titles were "7 seas builders – 7 seas builders", "Gallery – 7 seas builders", "Contact – 7 seas builders".
// Rewritten for local search at the owner's request (14 Oct 2026).
export const titles = {
  home: 'Builders in Woking, Surrey | 7 Seas Builders',
  services: 'Building Services in Woking, Surrey | 7 Seas Builders',
  gallery: 'Gallery of Our Work in Woking, Surrey | 7 Seas Builders',
  contact: 'Contact 7 Seas Builders, Woking | Free Quote',
  service: (name: string) => `${name} in Woking & Surrey | 7 Seas Builders`,
};
export const descriptions = {
  home: 'Home renovation, kitchen fittings, extensions and loft conversions in Woking, Surrey and across South East of England. Call 07830 486657 for a free quote.',
  services: 'Refurbishments, extensions and loft conversions in Woking, Surrey. Daily communication and work that complies with current building regulations.',
  gallery: 'Photos of kitchens, bathrooms, interiors, extensions and lofts by 7 Seas Builders, a building company in Woking, Surrey.',
  contact: 'Call 07830 486657 or send a message for a free quote from 7 Seas Builders, 12 Fairfax Rd, Woking GU22 9HW.',
};

export const about = {
  heading: 'About us',
  paragraphs: [
    '7 Seas Builders are here to provide professional renovation and quality services across South East of England. Weather it is single-storey or multi-storey, kitchen fittings or renovating, we can help, we are here to build you a perfect home.',
    'We understand every client is unique that is why we will be working with you from day one to prioritise your needs and welcome any changes as we go along. We are a dedicated team of builders providing daily communication on your project as we focus on customer satisfaction.',
    'Most of our work comes through referrals from our happy clients. Check out our gallery to see some of our work.',
  ],
};

export const services = [
  {
    slug: 'refurbishments',
    name: 'Refurbishments',
    body: 'Modernizing and restoring to make a house a home. This includes kitchen and bathroom fittings. We mainly work with private property landlords who require trustworthy builders to handle their property.',
  },
  {
    slug: 'extensions',
    name: 'Extensions',
    body: 'We can work with your design by providing you with additional space and comfy atmosphere for daily life. We also welcome any changes during the process and make sure the work complies with current building regulations.',
  },
  {
    slug: 'loft-conversion',
    name: 'Loft Conversion',
    body: 'Not using your loft? Why not create some additional space for a bedroom or an entertainment area. We can renovate your loft to give you the extra space your property needs. Loft vary in sizes but we can help to find a solution.',
  },
] as const;

export const reviewsHeading = 'What people say?';
export const reviews = [
  { quote: 'Great job and love the energy that they put in and treat our home like theirs.\nRecommend highly.', name: 'Jaimin Mandli' },
  { quote: 'Sinoj and team has done a job very professionally and the most important thing is they have finished the job on time which is unlikely to experience nowadays.', name: "Herald D'Souza" },
  { quote: 'Would highly recommend. Work was completed quickly, very professionally and to a high standard. Our patio looks better than ever!', name: 'Dona Deric' },
];

export const quote = {
  heading: 'Free Quote',
  body: 'Our estimates are competitive and we will always do our best to match your exact requirements. Click below to contact us',
};

export const contactForm = {
  consent: 'I consent to having 7 Seas Builders ltd store my submitted information so they can respond to my inquiry.',
};
