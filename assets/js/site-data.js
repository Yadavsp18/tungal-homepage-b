/* ==========================================================================
   Tungal homepage content data.
   Edit this file to add verified content. Nothing here is rendered unless filled in.
   ========================================================================== */
window.TUNGAL = {
  /* Real photographs. Key = the data-photo slot in index.html.
     Until a slot is filled, the brand illustration shows.
     Example:
       'hero-academic': { src: 'assets/photos/hero-academic.webp', alt: 'PU students in the Jamkhandi chemistry lab' },
     Slots: hero-academic, hero-development, hero-campus,
            programme-montessori, programme-school, programme-pu, programme-competitive, programme-ug,
            campus-jamkhandi, campus-hulyal, campus-bagalkot, campus-vijayapura,
            director-ashok, director-laxmi,
            life-classroom, life-science, life-sports, life-culture, life-library, life-campus, life-engagement */
  photos: {},

  /* Programmes offered per campus (source: client brief + tungalschools.com). Drives the enquiry form. */
  programmes: {
    jamkhandi: [
      { value: 'montessori-stream', label: 'Montessori to Std V (Montessori stream)' },
      { value: 'state-primary', label: 'Montessori to Std V (Karnataka State curriculum)' },
      { value: 'puc', label: 'PUC Science with KCET, NEET, IIT-JEE preparation' },
      { value: 'bsc', label: 'B.Sc (Bagalkot University, Jamkhandi)' },
      { value: 'bca', label: 'BCA (Bagalkot University, Jamkhandi)' }
    ],
    hulyal: [
      { value: 'cbse-6-10', label: 'Std VI to X (CBSE)' },
      { value: 'puc', label: 'PUC Science with KCET, NEET, IIT-JEE Advanced preparation' }
    ],
    bagalkot: [
      { value: 'puc', label: 'PUC Science with KCET, NEET, IIT-JEE Advanced preparation' }
    ],
    vijayapura: [
      { value: 'cbse-6-10', label: 'Std VI to X (CBSE)' },
      { value: 'puc', label: 'PUC Science with KCET, NEET, IIT-JEE Advanced preparation' }
    ]
  },
  /* Hostel availability: campus -> programmes that qualify */
  hostel: { hulyal: ['puc'], bagalkot: ['puc'], vijayapura: ['puc'] },

  /* Contact lines shown in the footer. Fill from the campus offices; leave empty to hide.
     Example: { label: 'Admissions, Jamkhandi', value: '+91 00000 00000', href: 'tel:+910000000000' } */
  contact: [],

  /* Social profiles. Example: { label: 'Instagram', href: 'https://instagram.com/...' } */
  social: [],

  /* Verified achievements only. When this list has items, they replace the placeholder cards.
     Example: { kicker: 'PUC 2026 · Jamkhandi', value: '—', title: 'Board result', text: 'Source: campus office record' } */
  achievements: [],

  /* Real testimonials only, with the person's permission.
     Example: { quote: '...', name: 'Parent name', role: 'Parent, Hulyal campus' } */
  testimonials: [],

  /* Hero autoplay interval in ms */
  heroInterval: 7000
};
