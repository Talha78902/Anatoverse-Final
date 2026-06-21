import { anatomyData } from '../data';
import { organStudyData, OrganStudySection } from '../organStudyData';
import { systemStudyData, SystemStudySection } from '../systemStudyData';
import { formatReferences, getReferencesForQuestion } from './medicalReferenceLibrary';

export type ChatEngineReply = {
  answer: string;
  references: string[];
  followUps: string[];
  matchedTopic?: string;
};

const normalize = (value: string) => value.toLowerCase().replace(/[-_/]/g, ' ').trim();
const bullets = (items: string[]) => items.map((item) => `• ${item}`).join('\n');

const findMatchingOrgans = (question: string) => {
  const q = normalize(question);
  return anatomyData.organs.filter((organ) => {
    const name = normalize(organ.name);
    const id = normalize(organ.id);
    return q.includes(name) || q.includes(id) || organ.relatedOrgans.some((related) => q.includes(normalize(related)));
  });
};

const findMatchingSystems = (question: string) => {
  const q = normalize(question);
  return anatomyData.systems.filter((system) => {
    const name = normalize(system.name).replace(' system', '');
    const id = normalize(system.id);
    return q.includes(name) || q.includes(id) || q.includes(normalize(system.name));
  });
};

const wants = (question: string, patterns: RegExp[]) => patterns.some((pattern) => pattern.test(question));

const pickOrganSections = (question: string, study: OrganStudySection) => {
  const lower = question.toLowerCase();
  const sections: Array<{ title: string; items: string[] }> = [];

  if (wants(lower, [/blood|arter|vein|vascular|supply|drain/])) sections.push({ title: 'Blood supply / drainage', items: study.vascularSupply });
  if (wants(lower, [/nerve|innervation|autonomic|sympathetic|parasympathetic|pain/])) sections.push({ title: 'Innervation', items: study.innervation });
  if (wants(lower, [/histo|microscop|cell|epitheli|tissue|gland|follicle|nephron|alveol/])) sections.push({ title: 'Histology', items: study.histology });
  if (wants(lower, [/embry|development|congenital|fetal|bud|duct|neural tube/])) sections.push({ title: 'Embryology', items: study.embryology });
  if (wants(lower, [/clinical|disease|patholog|case|pain|symptom|exam|viva|tumou?r|cancer|infarct/])) sections.push({ title: 'Clinical correlation', items: study.clinicalCorrelation });
  if (wants(lower, [/gross|anatomy|location|relation|parts|structure|surface/])) sections.push({ title: 'Gross anatomy', items: study.grossAnatomy });

  if (sections.length === 0) {
    sections.push(
      { title: 'Gross anatomy', items: study.grossAnatomy.slice(0, 2) },
      { title: 'Clinical correlation', items: study.clinicalCorrelation.slice(0, 2) }
    );
  }
  return sections.slice(0, 3);
};

const pickSystemSections = (question: string, study: SystemStudySection) => {
  const lower = question.toLowerCase();
  const sections: Array<{ title: string; items: string[] }> = [];

  if (wants(lower, [/physio|function|mechanism|cycle|pressure|hormone|filtration|respiration|action potential/])) sections.push({ title: 'Physiology', items: study.physiology });
  if (wants(lower, [/histo|microscop|cell|epitheli|tissue|cartilage|muscle fiber|neuron/])) sections.push({ title: 'Histology', items: study.histology });
  if (wants(lower, [/embry|development|congenital|fetal|neural tube|ossification|septation/])) sections.push({ title: 'Embryology', items: study.embryology });
  if (wants(lower, [/clinical|disease|patholog|case|exam|viva|injury|cancer|failure/])) sections.push({ title: 'Clinical correlation', items: study.clinicalCorrelation });
  if (wants(lower, [/gross|anatomy|components|organs|parts|surface|location/])) sections.push({ title: 'Gross anatomy', items: study.grossAnatomy });
  if (wants(lower, [/exam|viva|important|question|short note|long question/])) sections.push({ title: 'MBBS exam focus', items: study.mbbsExamFocus });

  if (sections.length === 0) {
    sections.push(
      { title: 'Physiology', items: study.physiology.slice(0, 2) },
      { title: 'Clinical correlation', items: study.clinicalCorrelation.slice(0, 2) },
      { title: 'MBBS exam focus', items: study.mbbsExamFocus.slice(0, 2) }
    );
  }
  return sections.slice(0, 3);
};

const makeFollowUps = (topicName?: string, type: 'organ' | 'system' | 'general' = 'general') => {
  if (topicName && type === 'organ') {
    return [
      `Ask a viva question about ${topicName}`,
      `Explain ${topicName} blood supply and innervation`,
      `Give clinical correlations of ${topicName}`,
    ];
  }
  if (topicName && type === 'system') {
    return [
      `Give MBBS viva questions from ${topicName}`,
      `Explain physiology of ${topicName}`,
      `Give clinical correlations of ${topicName}`,
    ];
  }
  return [
    'Ask me viva questions about the heart',
    'Explain lungs histology with clinical correlation',
    'Compare small intestine and large intestine',
  ];
};

export const generateMedicalChatReply = (question: string): ChatEngineReply => {
  const cleaned = question.trim();
  const refs = getReferencesForQuestion(cleaned);
  const references = formatReferences(refs);
  const lower = cleaned.toLowerCase();

  if (!cleaned) {
    return {
      answer: 'Please type a medical anatomy question. You can ask cross-questions such as “Why does referred shoulder pain occur in liver disease?” or “What is the histology of thyroid follicles?”',
      references,
      followUps: makeFollowUps(),
    };
  }

  const organs = findMatchingOrgans(cleaned);
  const systems = findMatchingSystems(cleaned);

  if (/reference|book|source|curriculum|textbook/.test(lower)) {
    return {
      answer: 'Reference mode is enabled. The assistant answers in MBBS style using your AnatoVerse notes plus a curriculum-style reference library. It gives textbook references for verification, but it does not reproduce copyrighted textbook chapters. Always verify final exam answers from your college-prescribed syllabus and latest editions available in your institution.',
      references,
      followUps: ['Which books are used for anatomy?', 'Give references for heart anatomy', 'Which books cover histology and embryology?'],
      matchedTopic: 'Reference library',
    };
  }

  if (/compare|difference|differentiate|vs\.?|versus/.test(lower) && organs.length >= 2) {
    const a = organs[0];
    const b = organs[1];
    return {
      answer: `Comparison: ${a.name} vs ${b.name}\n\n${a.name}\n• System: ${a.system}\n• Location: ${a.location}\n• Main function: ${a.function}\n\n${b.name}\n• System: ${b.system}\n• Location: ${b.location}\n• Main function: ${b.function}\n\nExam tip\n• In MBBS answers, compare location, gross structure, blood/nerve supply, histology, function, and one clinical correlation.`,
      references,
      followUps: [`Give histology comparison of ${a.name} and ${b.name}`, `Give clinical viva questions on ${a.name} and ${b.name}`, 'Make this answer into exam format'],
      matchedTopic: `${a.name} vs ${b.name}`,
    };
  }

  if (organs.length > 0) {
    const organ = organs[0];
    const study = organStudyData[organ.id];
    if (study) {
      const sections = pickOrganSections(cleaned, study);
      const sectionText = sections.map((section) => `${section.title}\n${bullets(section.items)}`).join('\n\n');
      return {
        answer: `${organ.name} — MBBS-level answer\n\nCore concept\n${study.summary}\n\n${sectionText}\n\nHigh-yield exam framing\n• Start with definition/location.\n• Add gross anatomy and relations.\n• Add blood supply, innervation, histology, embryology, and clinical correlation depending on the question.\n• End with one clinically important point.`,
        references,
        followUps: makeFollowUps(organ.name, 'organ'),
        matchedTopic: organ.name,
      };
    }

    return {
      answer: `${organ.name}\n\nLocation: ${organ.location}\nStructure: ${organ.structure}\nFunction: ${organ.function}\n\nQuick facts\n${bullets(organ.quickFacts)}\n\nAsk a follow-up like “blood supply”, “histology”, “clinical correlation”, or “viva questions”.`,
      references,
      followUps: makeFollowUps(organ.name, 'organ'),
      matchedTopic: organ.name,
    };
  }

  if (systems.length > 0) {
    const system = systems[0];
    const study = systemStudyData[system.id];
    if (study) {
      const sections = pickSystemSections(cleaned, study);
      const sectionText = sections.map((section) => `${section.title}\n${bullets(section.items)}`).join('\n\n');
      return {
        answer: `${system.name} — MBBS-level answer\n\nCore concept\n${study.summary}\n\n${sectionText}\n\nHigh-yield exam framing\n• Define the system.\n• List major organs/components.\n• Explain core physiology.\n• Add histology/embryology where relevant.\n• Finish with clinical correlations and common exam points.`,
        references,
        followUps: makeFollowUps(system.name, 'system'),
        matchedTopic: system.name,
      };
    }
  }

  if (/viva|quiz|question|cross/.test(lower)) {
    return {
      answer: `Cross-questioning mode\n\nTry answering these MBBS-style viva prompts:\n• Why is the left lung smaller than the right lung?\n• Why can pancreatic head carcinoma cause obstructive jaundice?\n• Why does ureteric stone pain radiate from loin to groin?\n• Why are thyroidectomy patients at risk of recurrent laryngeal nerve injury?\n• Why does portal hypertension produce varices and ascites?\n\nReply with your answer to any one question, and then ask for “check my answer”.`,
      references,
      followUps: ['Check my answer about heart valves', 'Ask me 5 viva questions on respiratory system', 'Explain why pancreatic cancer causes jaundice'],
      matchedTopic: 'Cross-questioning mode',
    };
  }

  return {
    answer: `I can answer this in MBBS anatomy style, but I need a clearer organ/system keyword.\n\nExamples you can ask:\n• Explain heart blood supply with clinical correlation.\n• Ask me viva questions on respiratory system.\n• Compare small intestine and large intestine.\n• Explain thyroid histology and embryology.\n• What are the clinical correlations of kidneys?\n\nYour question: “${cleaned}”`,
    references,
    followUps: makeFollowUps(),
  };
};
