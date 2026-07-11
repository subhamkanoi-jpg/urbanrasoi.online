export const storyCategories = [
  'All',
  'House parties',
  'Private dinners',
  'Large celebrations',
  'Corporate events',
  'Festive occasions',
  'Birthdays',
] as const

export type StoryCategory = (typeof storyCategories)[number]
export type EventCategory = Exclude<StoryCategory, 'All'>

export type VideoStory = {
  type: 'video'
  id: string
  src: string
  poster: string
  title: string
  caption: string
  categories: EventCategory[]
}

export type QuoteStory = {
  type: 'quote'
  id: string
  name: string
  quote: string
  detail: string
  categories: EventCategory[]
}

export type CustomerStory = VideoStory | QuoteStory

export const customerStories: CustomerStory[] = [
  {
    type: 'video',
    id: 'client-review',
    src: '/media/customer-stories/story-1.mp4',
    poster: '/media/customer-stories/story-1-poster.png',
    title: 'A happy host, in her own words',
    caption: 'A customer shares her Urban Rasoi experience.',
    categories: ['Birthdays', 'House parties'],
  },
  {
    type: 'video',
    id: 'gallery-grazing-table',
    src: '/media/customer-stories/story-2.mp4',
    poster: '/media/customer-stories/story-2-poster.png',
    title: 'A table made for lingering',
    caption: 'A grazing spread set among art for an intimate gathering.',
    categories: ['Private dinners'],
  },
  {
    type: 'quote',
    id: 'prirti',
    name: 'Prirti',
    quote: 'The food was very nice, and the service staff was very helpful. Everyone seemed to be enjoying the food.',
    detail: 'On the food and service',
    categories: ['House parties', 'Large celebrations'],
  },
  {
    type: 'video',
    id: 'served-at-home',
    src: '/media/customer-stories/story-3.mp4',
    poster: '/media/customer-stories/story-3-poster.png',
    title: 'Hospitality, served at home',
    caption: 'Guests are served fresh plates at a lively home gathering.',
    categories: ['House parties', 'Festive occasions'],
  },
  {
    type: 'quote',
    id: 'abhinav',
    name: 'Abhinav',
    quote: 'The quantity was sufficient, the flavours were perfect, and everyone enjoyed the meal.',
    detail: 'On flavour and portions',
    categories: ['Birthdays', 'House parties'],
  },
  {
    type: 'video',
    id: 'kitchen-team',
    src: '/media/customer-stories/story-4.mp4',
    poster: '/media/customer-stories/story-4-poster.png',
    title: 'The people behind every plate',
    caption: 'A glimpse of the Urban Rasoi team at work in the kitchen.',
    categories: ['Corporate events', 'Large celebrations'],
  },
  {
    type: 'quote',
    id: 'asha',
    name: 'Asha',
    quote: 'Everything was delicious and well packed. Delivery was smooth and on time—great work done.',
    detail: 'On delivery and packaging',
    categories: ['Corporate events', 'Festive occasions'],
  },
  {
    type: 'video',
    id: 'festive-gathering',
    src: '/media/customer-stories/story-5.mp4',
    poster: '/media/customer-stories/story-5-poster.png',
    title: 'A room full of good company',
    caption: 'A warm gathering with guests sharing food around the table.',
    categories: ['Festive occasions', 'Large celebrations'],
  },
  {
    type: 'quote',
    id: 'sunita',
    name: 'Sunita',
    quote: 'Food was very good—especially the cigar rolls. The rest was all very nice. Thank you.',
    detail: 'On a crowd-favourite starter',
    categories: ['Private dinners', 'Birthdays'],
  },
  {
    type: 'video',
    id: 'outdoor-brand-event',
    src: '/media/customer-stories/story-6.mp4',
    poster: '/media/customer-stories/story-6-poster.png',
    title: 'Ready for the big moments',
    caption: 'Urban Rasoi on location at a large outdoor brand event.',
    categories: ['Corporate events', 'Large celebrations'],
  },
]
