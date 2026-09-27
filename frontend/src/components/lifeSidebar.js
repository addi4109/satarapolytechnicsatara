// Shared sidebar structure for all Life@SPS pages — Activities, Campus
// facilities and Gallery. Every page under the Life@SPS navbar dropdown
// renders the same three groups so navigation feels consistent.
export const LIFE_SIDEBAR_GROUPS = [
  {
    title: 'Activities',
    items: [
      { label: 'Sports', to: '/activities/sports' },
      { label: 'Cultural', to: '/activities/cultural' },
      { label: 'Technical Events', to: '/activities/technical' },
      { label: 'Industrial Visits', to: '/activities/industrial-visits' },
      { label: 'Competitions', to: '/activities/competitions' },
      { label: 'Academic Events & Activities', to: '/activities/academic-events' },
    ],
  },
  {
    title: 'Facilities',
    items: [
      { label: 'Library', to: '/campus/library' },
      { label: 'Bus Facility', to: '/campus/bus-facility' },
      { label: 'Canteen', to: '/campus/canteen' },
      { label: 'Equal Opportunity Center', to: '/campus/equal-opportunity-center' },
      { label: 'Center of Excellence', to: '/campus/center-of-excellence' },
    ],
  },
  {
    title: 'Gallery',
    items: [
      { label: 'Photo Gallery', to: '/gallery/photos' },
      { label: 'Video Gallery', to: '/gallery/videos' },
      { label: 'Media News', to: '/gallery/media' },
    ],
  },
];
