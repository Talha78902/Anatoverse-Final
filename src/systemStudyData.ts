export interface SystemStudySection {
  summary: string;
  grossAnatomy: string[];
  physiology: string[];
  histology: string[];
  embryology: string[];
  clinicalCorrelation: string[];
  mbbsExamFocus: string[];
}

export const systemStudyData: Record<string, SystemStudySection> = {
  cardiovascular: {
    summary: 'The cardiovascular system is the transport network of the body. At MBBS level, it must be studied through the heart, blood vessels, blood flow dynamics, coronary circulation, cardiac conduction, and clinical examination of pulses, blood pressure, and heart sounds.',
    grossAnatomy: [
      'Main components include the heart, arteries, veins, capillaries, and circulating blood.',
      'The heart lies in the middle mediastinum and is divided into four chambers with four major valves.',
      'The systemic and pulmonary circuits work in series: right heart pumps to lungs, left heart pumps to the body.'
    ],
    physiology: [
      'Maintains tissue perfusion by generating cardiac output, which depends on heart rate and stroke volume.',
      'Blood pressure is regulated by cardiac output, peripheral resistance, blood volume, and autonomic control.',
      'The cardiac cycle includes systole, diastole, valve opening/closure, and heart sound generation.'
    ],
    histology: [
      'Cardiac muscle contains branching striated fibers joined by intercalated discs.',
      'Arteries have thick tunica media, veins have thinner walls and larger lumens, and capillaries are optimized for exchange.',
      'Endothelium lines the entire vascular system and participates in coagulation, vascular tone, and inflammation.'
    ],
    embryology: [
      'The heart develops from cardiogenic mesoderm and begins beating very early in embryonic life.',
      'Septation divides the primitive heart into right and left sides and forms atrial, ventricular, and outflow structures.',
      'Important congenital defects include ASD, VSD, patent ductus arteriosus, and Tetralogy of Fallot.'
    ],
    clinicalCorrelation: [
      'Hypertension, atherosclerosis, myocardial infarction, heart failure, and arrhythmias are major clinical topics.',
      'Pulse examination and blood pressure measurement directly reflect cardiovascular physiology.',
      'Coronary artery anatomy is essential for ECG interpretation and myocardial infarction localization.'
    ],
    mbbsExamFocus: [
      'Draw and label the heart chambers, valves, and great vessels.',
      'Compare arteries, veins, and capillaries histologically.',
      'Explain coronary circulation and common sites of ischemic heart disease.'
    ]
  },
  nervous: {
    summary: 'The nervous system is the master control and communication system. For MBBS students it includes CNS, PNS, autonomic nervous system, sensory-motor pathways, cranial nerves, spinal tracts, reflexes, and lesion localization.',
    grossAnatomy: [
      'Central nervous system includes brain and spinal cord; peripheral nervous system includes cranial nerves, spinal nerves, ganglia, and plexuses.',
      'Brain divisions include cerebrum, diencephalon, brainstem, and cerebellum.',
      'Spinal cord has segmental organization and gives rise to dorsal sensory and ventral motor roots.'
    ],
    physiology: [
      'Neurons transmit signals through action potentials and synaptic neurotransmission.',
      'Motor pathways regulate voluntary movement, while sensory pathways transmit pain, temperature, touch, proprioception, vision, hearing, smell, and taste.',
      'Autonomic control maintains visceral function through sympathetic and parasympathetic pathways.'
    ],
    histology: [
      'Neurons contain cell body, dendrites, axon, and synaptic terminals.',
      'Glial cells include astrocytes, oligodendrocytes, microglia, ependymal cells, Schwann cells, and satellite cells.',
      'Grey matter contains neuron cell bodies while white matter contains myelinated axons.'
    ],
    embryology: [
      'The nervous system develops mainly from ectoderm through neural tube and neural crest formation.',
      'Neural tube forms brain and spinal cord; neural crest forms peripheral ganglia, Schwann cells, and several other structures.',
      'Neural tube defects such as spina bifida and anencephaly are high-yield embryology topics.'
    ],
    clinicalCorrelation: [
      'Stroke, meningitis, epilepsy, spinal cord injury, peripheral neuropathy, and Parkinson disease are important clinical examples.',
      'Upper and lower motor neuron signs must be distinguished during neurological examination.',
      'Cranial nerve examination is a core MBBS clinical skill.'
    ],
    mbbsExamFocus: [
      'Differentiate CNS and PNS structures.',
      'Describe the reflex arc and spinal cord tracts.',
      'Localize lesions using motor, sensory, and cranial nerve findings.'
    ]
  },
  skeletal: {
    summary: 'The skeletal system forms the structural framework of the body, protects organs, enables movement with muscles, stores minerals, and supports hematopoiesis. MBBS study requires bone classification, joints, ossification, and clinically important landmarks.',
    grossAnatomy: [
      'The adult skeleton contains 206 bones divided into axial and appendicular skeleton.',
      'Bones are classified as long, short, flat, irregular, sesamoid, and pneumatic bones.',
      'Joints may be fibrous, cartilaginous, or synovial, with synovial joints allowing the greatest movement.'
    ],
    physiology: [
      'Bones provide leverage for movement and protect soft organs such as brain, heart, lungs, and pelvic viscera.',
      'Calcium and phosphate homeostasis is maintained through bone remodeling.',
      'Bone marrow participates in blood cell production.'
    ],
    histology: [
      'Compact bone contains osteons with Haversian canals; spongy bone contains trabeculae and marrow spaces.',
      'Osteoblasts form bone, osteoclasts resorb bone, and osteocytes maintain mature bone matrix.',
      'Cartilage types include hyaline, elastic, and fibrocartilage.'
    ],
    embryology: [
      'Bones develop through intramembranous and endochondral ossification.',
      'Flat bones of skull largely form by intramembranous ossification.',
      'Long bones form by endochondral ossification using cartilage models and growth plates.'
    ],
    clinicalCorrelation: [
      'Fractures, osteoporosis, osteomyelitis, rickets, arthritis, and bone tumors are key conditions.',
      'Growth plate injuries are clinically important in children.',
      'Surface landmarks guide injections, procedures, and orthopedic examination.'
    ],
    mbbsExamFocus: [
      'Classify bones and joints with examples.',
      'Explain endochondral ossification and epiphyseal plate zones.',
      'Identify commonly tested foramina, tubercles, fossae, and joint movements.'
    ]
  },
  muscular: {
    summary: 'The muscular system produces movement, posture, respiration support, facial expression, and heat generation. MBBS students should study muscle types, attachments, actions, innervation, blood supply, and neuromuscular junctions.',
    grossAnatomy: [
      'Muscle types include skeletal, smooth, and cardiac muscle.',
      'Skeletal muscles attach to bones through tendons and act across joints.',
      'Muscle groups are studied by compartments, actions, and nerve supply.'
    ],
    physiology: [
      'Skeletal muscle contraction depends on actin-myosin interaction and calcium-mediated excitation-contraction coupling.',
      'Muscles act as agonists, antagonists, synergists, and fixators during movement.',
      'Smooth muscle drives visceral movements such as peristalsis and vascular tone.'
    ],
    histology: [
      'Skeletal muscle is striated, multinucleated, and organized into sarcomeres.',
      'Cardiac muscle is striated, branching, and connected by intercalated discs.',
      'Smooth muscle is non-striated and spindle-shaped with central nuclei.'
    ],
    embryology: [
      'Most skeletal muscles derive from paraxial mesoderm of somites.',
      'Limb muscle precursors migrate into limb buds and retain their segmental innervation pattern.',
      'Head and neck muscles have branchial arch origins with corresponding cranial nerve supply.'
    ],
    clinicalCorrelation: [
      'Myasthenia gravis, muscular dystrophy, compartment syndrome, tendon injury, and muscle strain are common topics.',
      'Motor testing helps identify nerve lesions and spinal root involvement.',
      'Denervation leads to muscle wasting and fasciculations.'
    ],
    mbbsExamFocus: [
      'Learn origin, insertion, action, and nerve supply of major muscles.',
      'Differentiate skeletal, cardiac, and smooth muscle histology.',
      'Explain neuromuscular junction physiology and related diseases.'
    ]
  },
  respiratory: {
    summary: 'The respiratory system performs ventilation, gas exchange, acid-base regulation, phonation, and airway protection. MBBS study includes airway anatomy, lungs, pleura, bronchopulmonary segments, histology of alveoli, and clinical respiratory examination.',
    grossAnatomy: [
      'Components include nasal cavity, pharynx, larynx, trachea, bronchi, bronchioles, lungs, pleura, and diaphragm.',
      'Right lung has three lobes; left lung has two lobes, cardiac notch, and lingula.',
      'Bronchopulmonary segments are surgically significant anatomical units.'
    ],
    physiology: [
      'Ventilation moves air to alveoli, where oxygen and carbon dioxide diffuse across the respiratory membrane.',
      'Surfactant reduces surface tension and prevents alveolar collapse.',
      'Respiratory centers in the brainstem regulate breathing according to CO2, pH, and oxygen levels.'
    ],
    histology: [
      'Conducting airways are lined by ciliated epithelium with goblet cells, changing progressively toward the alveoli.',
      'Type I pneumocytes form most of the alveolar surface for gas exchange.',
      'Type II pneumocytes secrete surfactant, and alveolar macrophages remove particles.'
    ],
    embryology: [
      'The respiratory system develops from the respiratory diverticulum of the foregut.',
      'Branching morphogenesis forms bronchial tree and respiratory units.',
      'Prematurity may cause respiratory distress syndrome due to insufficient surfactant.'
    ],
    clinicalCorrelation: [
      'Asthma, COPD, pneumonia, pulmonary embolism, pneumothorax, and pleural effusion are major diseases.',
      'Chest percussion, auscultation, and respiratory rate are essential clinical skills.',
      'Pleural recesses and surface anatomy guide thoracocentesis.'
    ],
    mbbsExamFocus: [
      'Compare right and left lung anatomy.',
      'Explain bronchopulmonary segments and pleural cavities.',
      'Describe alveolar structure and gas exchange membrane.'
    ]
  },
  digestive: {
    summary: 'The digestive system ingests food, breaks it down mechanically and chemically, absorbs nutrients, and eliminates waste. MBBS study covers foregut, midgut, hindgut, peritoneal relations, gut histology, blood supply, and portal circulation.',
    grossAnatomy: [
      'The gastrointestinal tract extends from mouth to anal canal with accessory organs including liver, gallbladder, and pancreas.',
      'Foregut, midgut, and hindgut divisions explain arterial supply, venous drainage, lymphatics, and pain referral.',
      'Peritoneal folds, mesenteries, omenta, and retroperitoneal relations are clinically important.'
    ],
    physiology: [
      'Digestion involves motility, secretion, enzymatic breakdown, absorption, and defecation.',
      'Liver produces bile, pancreas produces digestive enzymes and bicarbonate, and intestine absorbs nutrients.',
      'Enteric nervous system coordinates gut motility and secretion.'
    ],
    histology: [
      'The gut wall has mucosa, submucosa, muscularis externa, and serosa/adventitia.',
      'Regional histology distinguishes esophagus, stomach, small intestine, colon, liver, and pancreas.',
      'Villi, crypts, goblet cells, and lymphoid aggregates are key microscopic features.'
    ],
    embryology: [
      'The gut tube derives from endoderm and is divided into foregut, midgut, and hindgut.',
      'Midgut rotation and herniation are high-yield developmental events.',
      'Important anomalies include Meckel diverticulum, malrotation, and imperforate anus.'
    ],
    clinicalCorrelation: [
      'Peptic ulcer disease, appendicitis, pancreatitis, hepatitis, cirrhosis, intestinal obstruction, and colorectal carcinoma are key topics.',
      'Portal hypertension causes varices, ascites, and splenomegaly.',
      'Abdominal pain localization depends on embryological origin and peritoneal irritation.'
    ],
    mbbsExamFocus: [
      'Differentiate foregut, midgut, and hindgut derivatives.',
      'Draw portal circulation and portosystemic anastomoses.',
      'Explain gut wall histology and regional modifications.'
    ]
  },
  urinary: {
    summary: 'The urinary system filters blood, removes metabolic waste, regulates water-electrolyte balance, and contributes to blood pressure and red cell production. MBBS students must master kidney structure, nephron physiology, ureters, bladder, urethra, and micturition control.',
    grossAnatomy: [
      'Components include kidneys, ureters, urinary bladder, and urethra.',
      'Kidneys are retroperitoneal organs with cortex, medulla, pyramids, calyces, and renal pelvis.',
      'Ureters have three common constriction sites important for kidney stone obstruction.'
    ],
    physiology: [
      'Nephrons perform filtration, reabsorption, secretion, and concentration of urine.',
      'Renin-angiotensin-aldosterone system helps regulate blood pressure and sodium balance.',
      'Micturition involves detrusor contraction, sphincter relaxation, and autonomic-somatic coordination.'
    ],
    histology: [
      'Renal corpuscle contains glomerulus and Bowman capsule.',
      'Tubular segments include proximal tubule, loop of Henle, distal tubule, and collecting ducts.',
      'Ureter and bladder are lined by transitional epithelium adapted for stretching.'
    ],
    embryology: [
      'Definitive kidney develops from ureteric bud and metanephric blastema.',
      'Kidneys ascend from pelvis to lumbar region during development.',
      'Congenital anomalies include horseshoe kidney, ectopic kidney, and renal agenesis.'
    ],
    clinicalCorrelation: [
      'UTI, nephrolithiasis, hydronephrosis, acute kidney injury, chronic kidney disease, and bladder carcinoma are major topics.',
      'Costovertebral angle tenderness suggests renal inflammation.',
      'Urinalysis, creatinine, urea, and imaging connect anatomy with clinical diagnosis.'
    ],
    mbbsExamFocus: [
      'Draw a nephron and explain filtration barrier.',
      'List ureteric constrictions and stone pain referral.',
      'Explain micturition reflex and bladder innervation.'
    ]
  },
  endocrine: {
    summary: 'The endocrine system controls long-term body regulation through hormones secreted into blood. MBBS study includes hypothalamic-pituitary axis, thyroid, parathyroids, pancreas, adrenals, gonads, hormone feedback loops, and endocrine pathology.',
    grossAnatomy: [
      'Major endocrine organs include pituitary, thyroid, parathyroids, adrenals, endocrine pancreas, pineal gland, and gonads.',
      'Endocrine glands are highly vascular and lack ducts.',
      'The hypothalamus and pituitary form the central control axis for many hormonal systems.'
    ],
    physiology: [
      'Hormones regulate metabolism, growth, reproduction, stress response, blood glucose, calcium balance, and water balance.',
      'Negative feedback loops are the main principle of endocrine regulation.',
      'Hormones act through membrane receptors or intracellular nuclear receptors depending on chemical class.'
    ],
    histology: [
      'Endocrine tissue is arranged in cords, follicles, clusters, or zones depending on organ.',
      'Thyroid follicles store colloid; pancreatic islets contain insulin and glucagon-producing cells.',
      'Adrenal cortex has zona glomerulosa, fasciculata, and reticularis, while medulla contains chromaffin cells.'
    ],
    embryology: [
      'Endocrine organs have varied origins: thyroid from endoderm, adrenal cortex from mesoderm, adrenal medulla from neural crest.',
      'Pituitary develops from oral ectoderm and neuroectoderm.',
      'Developmental errors may cause ectopic thyroid and congenital endocrine deficiencies.'
    ],
    clinicalCorrelation: [
      'Diabetes mellitus, hypo/hyperthyroidism, adrenal insufficiency, Cushing syndrome, acromegaly, and parathyroid disorders are important.',
      'Clinical signs often reflect hormone excess or deficiency.',
      'Endocrine testing relies heavily on hormone levels and feedback interpretation.'
    ],
    mbbsExamFocus: [
      'Explain hypothalamic-pituitary feedback axes.',
      'Compare thyroid, adrenal, and pancreatic endocrine histology.',
      'Relate hormone excess and deficiency to clinical signs.'
    ]
  },
  lymphatic: {
    summary: 'The lymphatic and immune system maintains fluid balance, absorbs dietary fats, and defends against infection. MBBS learning includes lymph vessels, lymph nodes, spleen, thymus, tonsils, immune cells, and clinical lymphatic drainage.',
    grossAnatomy: [
      'Components include lymph capillaries, lymph vessels, lymph nodes, spleen, thymus, tonsils, and bone marrow.',
      'Lymph drains into venous circulation mainly through thoracic duct and right lymphatic duct.',
      'Regional lymph node groups are crucial for infection and cancer spread.'
    ],
    physiology: [
      'Lymphatic vessels return excess interstitial fluid to the bloodstream.',
      'Lacteals absorb dietary fats from the intestine.',
      'Immune responses involve antigen recognition, lymphocyte activation, antibody production, and cellular defense.'
    ],
    histology: [
      'Lymph nodes contain cortex, paracortex, medulla, follicles, sinuses, and germinal centers.',
      'Spleen contains white pulp for immune response and red pulp for blood filtration.',
      'Thymus contains cortex, medulla, and Hassall corpuscles and is important for T-cell maturation.'
    ],
    embryology: [
      'Lymphatic channels develop from venous endothelial outgrowths.',
      'The thymus develops from the third pharyngeal pouch.',
      'Bone marrow becomes the major hematopoietic and immune-cell source after fetal development.'
    ],
    clinicalCorrelation: [
      'Lymphedema, lymphoma, lymphadenitis, splenomegaly, immunodeficiency, and autoimmune disease are key topics.',
      'Cancer staging often depends on lymph node spread.',
      'Splenic rupture is a surgical emergency because of high vascularity.'
    ],
    mbbsExamFocus: [
      'Differentiate lymph node, spleen, and thymus histology.',
      'Trace thoracic duct drainage.',
      'Relate regional lymph drainage to spread of malignancy.'
    ]
  },
  integumentary: {
    summary: 'The integumentary system forms the protective surface of the body and includes skin, hair, nails, sweat glands, and sebaceous glands. MBBS study includes skin layers, sensory receptors, thermoregulation, appendages, and common dermatological pathology.',
    grossAnatomy: [
      'The skin covers the entire body and is divided into epidermis, dermis, and hypodermis.',
      'Skin appendages include hair follicles, nails, sweat glands, and sebaceous glands.',
      'Thick skin is found on palms and soles; thin skin covers most other body areas.'
    ],
    physiology: [
      'Skin provides barrier defense, prevents fluid loss, regulates temperature, and enables sensation.',
      'Sweating and cutaneous vasodilation help dissipate heat.',
      'Ultraviolet exposure helps vitamin D synthesis in the skin.'
    ],
    histology: [
      'Epidermis is keratinized stratified squamous epithelium with basal, spinous, granular, lucidum, and corneum layers.',
      'Dermis has papillary and reticular layers with collagen, elastic fibers, vessels, nerves, and appendages.',
      'Important cells include keratinocytes, melanocytes, Langerhans cells, and Merkel cells.'
    ],
    embryology: [
      'Epidermis develops from ectoderm; dermis mainly develops from mesoderm.',
      'Melanocytes arise from neural crest cells.',
      'Hair follicles and glands form as epidermal downgrowths.'
    ],
    clinicalCorrelation: [
      'Burns, eczema, psoriasis, melanoma, basal cell carcinoma, squamous cell carcinoma, and infections are important.',
      'Dermatomes help localize spinal nerve lesions.',
      'Skin examination can reveal systemic disease such as jaundice, cyanosis, and anemia.'
    ],
    mbbsExamFocus: [
      'Draw layers of thick skin and label appendages.',
      'Differentiate skin receptors and sensations.',
      'Classify burns and common skin cancers.'
    ]
  },
  reproductive: {
    summary: 'The reproductive system produces gametes, secretes sex hormones, enables fertilization, and supports pregnancy in females. MBBS study includes male and female pelvic anatomy, gonads, ducts, external genitalia, hormonal control, and embryological development.',
    grossAnatomy: [
      'Male organs include testes, epididymis, vas deferens, seminal vesicles, prostate, penis, and scrotum.',
      'Female organs include ovaries, uterine tubes, uterus, cervix, vagina, and external genitalia.',
      'Pelvic floor, perineum, and supports of pelvic organs are clinically important.'
    ],
    physiology: [
      'Gametogenesis produces sperm and ova, while sex hormones regulate secondary sexual characteristics and reproductive cycles.',
      'The hypothalamic-pituitary-gonadal axis controls reproductive endocrine function.',
      'Female menstrual cycle involves ovarian and uterine phases coordinated by hormones.'
    ],
    histology: [
      'Testis contains seminiferous tubules, Sertoli cells, and Leydig cells.',
      'Ovary contains follicles at different stages, corpus luteum, and stromal tissue.',
      'Uterus contains endometrium, myometrium, and perimetrium with cyclical endometrial changes.'
    ],
    embryology: [
      'Gonads develop from genital ridges and differentiate according to genetic and hormonal signals.',
      'Male ducts mainly derive from mesonephric ducts; female ducts mainly derive from paramesonephric ducts.',
      'Common anomalies include cryptorchidism, hypospadias, bicornuate uterus, and Müllerian duct defects.'
    ],
    clinicalCorrelation: [
      'Infertility, ectopic pregnancy, testicular torsion, BPH, cervical carcinoma, ovarian cysts, and fibroids are important topics.',
      'Prostate, breast, testicular, and cervical examinations require anatomical understanding.',
      'Lymphatic drainage is crucial in reproductive cancers.'
    ],
    mbbsExamFocus: [
      'Compare male and female duct development.',
      'Explain menstrual cycle hormonal regulation.',
      'Learn pelvic supports, perineal anatomy, and reproductive organ blood supply.'
    ]
  }
};
