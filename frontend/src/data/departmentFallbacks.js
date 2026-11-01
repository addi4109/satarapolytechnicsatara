// Static fallback content for public department pages.
// These values render immediately (or when a field is missing in the database)
// and are replaced automatically once the department data is loaded from the API.
export const DEPARTMENT_FALLBACKS = [
  {
    name: 'Computer Engineering',
    slug: 'computer',
    intake: 60,
    image: 'https://www.satarapolytechnicsatara.com/assets/co-B0B6J1cD.jpeg',
    about:
      'The Department of Computer Engineering was established in 1995. It offers a 3-year diploma programme with an intake of 60 students. The department has well-equipped laboratories with modern computers and software.',
    facultyCount: 6,
    labsCount: 5,
  },
  {
    name: 'Electronics & Telecommunication',
    slug: 'entc',
    intake: 60,
    image: 'https://www.satarapolytechnicsatara.com/assets/entc-Jp6qtups.jpg',
    about:
      'The Department of Electronics and Telecommunication Engineering was established in 1983. It offers a 3-year diploma programme with an intake of 60 students.',
    facultyCount: 4,
    labsCount: 5,
  },
  {
    name: 'Mechanical Engineering',
    slug: 'mechanical',
    intake: 60,
    image: 'https://www.satarapolytechnicsatara.com/assets/mecanical-BZSmFLQx.jpg',
    about:
      'The Department of Mechanical Engineering is one of the oldest departments of the institute, established in 1983.',
    facultyCount: 5,
    labsCount: 5,
  },
  {
    name: 'Chemical Engineering',
    slug: 'chemical',
    intake: 60,
    image: 'https://www.satarapolytechnicsatara.com/assets/chemical-C8vpqZYb.jpg',
    about:
      'The Department of Chemical Engineering provides students with knowledge of chemical processes, plant design, and industrial safety.',
    facultyCount: 4,
    labsCount: 5,
  },
  {
    name: 'Electrical Engineering',
    slug: 'electrical',
    intake: 60,
    image: 'https://www.satarapolytechnicsatara.com/assets/electrical-CxrpAj1a.jpg',
    about:
      'The Department of Electrical Engineering was established in 1995. It offers a 3-year diploma programme with an intake of 60 students.',
    facultyCount: 4,
    labsCount: 5,
  },
  {
    name: 'Automobile Engineering',
    slug: 'auto',
    intake: 60,
    image: 'https://www.satarapolytechnicsatara.com/assets/auto-DTO3Ybn7.jpg',
    about:
      'The Department of Automobile Engineering was established in 2015. It offers a 3-year diploma programme with an intake of 60 students.',
    facultyCount: 4,
    labsCount: 5,
  },
  {
    name: 'General Science',
    slug: 'general-science',
    intake: 60,
    image: '',
    about:
      'The Department of General Science provides foundational science education to first-year students across all engineering disciplines.',
    facultyCount: 0,
    labsCount: 3,
  },
];

export function getDepartmentFallback(slug) {
  if (!slug) return null;
  return (
    DEPARTMENT_FALLBACKS.find((dept) => dept.slug === slug) ||
    (slug === 'etc'
      ? DEPARTMENT_FALLBACKS.find((dept) => dept.slug === 'entc')
      : null)
  );
}
