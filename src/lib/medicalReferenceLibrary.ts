export type MedicalReference = {
  id: string;
  title: string;
  edition: string;
  authors: string;
  publisher: string;
  year: string;
  subjects: string[];
  note: string;
};

// Curriculum-style reference list used for citation labels in the assistant.
// It deliberately stores bibliographic guidance and short topic summaries only.
// It does not copy textbook chapters or copyrighted passages.
export const medicalReferences: MedicalReference[] = [
  {
    id: 'grays-students-5e',
    title: "Gray's Anatomy for Students",
    edition: '5th Edition',
    authors: 'Drake, Vogl, Mitchell',
    publisher: 'Elsevier',
    year: '2023',
    subjects: ['gross anatomy', 'clinical anatomy', 'neuroanatomy', 'embryology overview'],
    note: 'Core gross anatomy and clinically oriented anatomy reference for medical students.',
  },
  {
    id: 'moore-coa-9e',
    title: "Moore's Clinically Oriented Anatomy",
    edition: '9th Edition',
    authors: 'Dalley, Agur, Moore',
    publisher: 'Wolters Kluwer / Lippincott',
    year: '2023',
    subjects: ['gross anatomy', 'clinical correlation', 'surface anatomy', 'regional anatomy'],
    note: 'Clinical anatomy correlation reference for MBBS and medical exam preparation.',
  },
  {
    id: 'snell-regions-10e',
    title: "Snell's Clinical Anatomy by Regions",
    edition: '10th Edition',
    authors: 'Wineski',
    publisher: 'Wolters Kluwer / Lippincott',
    year: '2019',
    subjects: ['regional anatomy', 'clinical anatomy', 'neuroanatomy'],
    note: 'Region-wise clinical anatomy reference used by many medical students.',
  },
  {
    id: 'guyton-15e',
    title: 'Guyton and Hall Textbook of Medical Physiology',
    edition: '15th Edition',
    authors: 'Hall and Hall',
    publisher: 'Elsevier',
    year: '2025',
    subjects: ['physiology', 'cardiovascular physiology', 'respiratory physiology', 'renal physiology', 'endocrine physiology', 'neurophysiology'],
    note: 'Major physiology reference for pre-clinical and clinical physiology concepts.',
  },
  {
    id: 'junqueira-17e',
    title: "Junqueira's Basic Histology: Text and Atlas",
    edition: '17th Edition',
    authors: 'Mescher',
    publisher: 'McGraw Hill',
    year: '2024',
    subjects: ['histology', 'microscopy', 'cell biology', 'tissue biology'],
    note: 'Core histology and microanatomy reference with clinical correlations.',
  },
  {
    id: 'langman-15e',
    title: "Langman's Medical Embryology",
    edition: '15th Edition',
    authors: 'Sadler',
    publisher: 'Wolters Kluwer / Lippincott',
    year: '2023',
    subjects: ['embryology', 'developmental anatomy', 'congenital anomalies'],
    note: 'Standard medical embryology reference for developmental basis of anatomy.',
  },
  {
    id: 'robbins-basic-11e',
    title: 'Robbins and Kumar Basic Pathology',
    edition: '11th Edition',
    authors: 'Kumar, Abbas, Aster, Deyrup, Das',
    publisher: 'Elsevier',
    year: '2023',
    subjects: ['pathology', 'clinical correlation', 'disease mechanisms', 'morphology'],
    note: 'Core pathology reference for disease mechanisms and clinicopathological correlation.',
  },
];

export const getReferencesForQuestion = (question: string) => {
  const q = question.toLowerCase();
  const subjects = new Set<string>();
  if (/histo|microscop|epitheli|cell|tissue|follicle|nephron|alveol|myocard/i.test(q)) subjects.add('histology');
  if (/embry|develop|congenital|fetal|neural tube|duct|bud/i.test(q)) subjects.add('embryology');
  if (/physio|function|mechanism|cycle|pressure|hormone|gas exchange|filtration|action potential/i.test(q)) subjects.add('physiology');
  if (/disease|clinical|pathology|pain|tumou?r|cancer|syndrome|fracture|infarct|ischemia|jaundice/i.test(q)) subjects.add('pathology');
  if (/surface|gross|blood supply|artery|vein|nerve|innervation|relation|location|anatomy/i.test(q)) subjects.add('gross anatomy');

  let refs = medicalReferences.filter((ref) => ref.subjects.some((subject) => {
    if (subjects.has('physiology') && subject.includes('physiology')) return true;
    if (subjects.has('histology') && subject.includes('histology')) return true;
    if (subjects.has('embryology') && subject.includes('embryology')) return true;
    if (subjects.has('pathology') && (subject.includes('pathology') || subject.includes('clinical'))) return true;
    if (subjects.has('gross anatomy') && (subject.includes('anatomy') || subject.includes('regional'))) return true;
    return false;
  }));

  if (refs.length === 0) {
    refs = medicalReferences.filter((ref) => ['grays-students-5e', 'moore-coa-9e', 'guyton-15e', 'junqueira-17e'].includes(ref.id));
  }

  const unique = new Map(refs.map((ref) => [ref.id, ref]));
  return Array.from(unique.values()).slice(0, 5);
};

export const formatReferences = (refs: MedicalReference[]) => refs.map((ref, index) => (
  `${index + 1}. ${ref.title}, ${ref.edition}, ${ref.authors}, ${ref.publisher}, ${ref.year}. ${ref.note}`
));
