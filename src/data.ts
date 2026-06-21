import React from 'react';

export interface SystemData {
  id: string;
  name: string;
  shortDescription: string;
  overview: string;
  organs: string[];
  functions: string[];
  commonDisorders: string[];
  relatedSystems: string[];
  color: string; // Tailwind color or hex
  glowColor: number; // Hex number for ThreeJS
  cameraTarget: { x: number; y: number; z: number; zoom: number };
}

export interface OrganData {
  id: string;
  name: string;
  system: string;
  location: string;
  structure: string;
  function: string;
  quickFacts: string[];
  relatedOrgans: string[];
  hotspotPosition: { x: number; y: number; z: number };
  meshName: string;
}

export const anatomyData: { systems: SystemData[]; organs: OrganData[] } = {
  systems: [
    {
      id: "cardiovascular",
      name: "Cardiovascular System",
      shortDescription: "The vital network that circulates blood, oxygen, and crucial nutrients throughout the body.",
      overview: "The cardiovascular system consists of the heart, blood vessels (arteries, veins, and capillaries), and blood. Its primary role is to pump and route blood, supplying oxygen and nutrients to tissues while removing metabolic waste products like carbon dioxide.",
      organs: ["Heart", "Arteries", "Veins", "Capillaries"],
      functions: [
        "Transports oxygen from the lungs to body cells.",
        "Delivers nutrients (glucose, amino acids) from the digestive system.",
        "Removes waste products (CO2, urea) to excretory organs.",
        "Circulates hormones and immune cells.",
        "Regulates body temperature and pH balance."
      ],
      commonDisorders: [
        "Atherosclerosis (blocked arteries)",
        "Hypertension (high blood pressure)",
        "Coronary Artery Disease (CAD)",
        "Arrhythmia (irregular heartbeat)"
      ],
      relatedSystems: ["Respiratory System", "Skeletal System", "Lymphatic / Immune System"],
      color: "from-red-500 to-red-650",
      glowColor: 0xef4444,
      cameraTarget: { x: 0, y: 1.1, z: 1.8, zoom: 2.2 }
    },
    {
      id: "nervous",
      name: "Nervous System",
      shortDescription: "The master control and communication center, processing signals and directing actions.",
      overview: "Divided into the Central Nervous System (brain and spinal cord) and the Peripheral Nervous System, this network coordinates every bodily action—from involuntary heartbeats to complex analytical thinking and sensory perception.",
      organs: ["Brain", "Spinal cord", "Peripheral nerves", "Sensory organs"],
      functions: [
        "Receives and interprets sensory inputs (vision, hearing, touch).",
        "Triggers rapid motor responses and voluntary movements.",
        "Regulates autonomous visceral functions (breathing, digestion).",
        "Enables high-order cognitive processes (learning, memory, emotion)."
      ],
      commonDisorders: [
        "Multiple Sclerosis (MS)",
        "Alzheimer's and Parkinson's Diseases",
        "Epilepsy",
        "Peripheral Neuropathy"
      ],
      relatedSystems: ["Muscular System", "Skeletal System", "Endocrine System"],
      color: "from-yellow-400 to-amber-500",
      glowColor: 0xf59e0b,
      cameraTarget: { x: 0, y: 1.4, z: 1.5, zoom: 2.5 }
    },
    {
      id: "skeletal",
      name: "Skeletal System",
      shortDescription: "The structural framework that provides shape, protects vital organs, and enables motion.",
      overview: "Comprising 206 bones in an adult, alongside cartilages, joints, and ligaments, the skeletal system forms the rigid framework of the body, shields delicate internal machinery, and serves as a calcium reservoir and site of blood cell genesis.",
      organs: ["Bones", "Joints", "Cartilage", "Ligaments"],
      functions: [
        "Provides rigid mechanical support and maintains body posture.",
        "Shields delicate internal structures (skull protects brain; ribs protect heart).",
        "Serves as levers for muscles to generate coordinated locomotion.",
        "Produces red and white blood cells within the bone marrow (hematopoiesis).",
        "Stores essential minerals, primarily calcium and phosphorus."
      ],
      commonDisorders: [
        "Osteoporosis (brittle bones)",
        "Osteoarthritis (joint wear)",
        "Scoliosis (curved spine)",
        "Bone Fractures"
      ],
      relatedSystems: ["Muscular System", "Cardiovascular System", "Nervous System"],
      color: "from-slate-400 to-zinc-550",
      glowColor: 0xe2e8f0,
      cameraTarget: { x: 0, y: 1.0, z: 2.2, zoom: 1.3 }
    },
    {
      id: "muscular",
      name: "Muscular System",
      shortDescription: "The biological engine of movement, posture support, and metabolic heat generation.",
      overview: "Containing skeletal, smooth, and cardiac muscle types, this system is responsible for motor interactions with the environment and internal circulation, acting as our body's dynamic force generator.",
      organs: ["Bones (skeletal connection)", "Muscles", "Tendons"],
      functions: [
        "Produces voluntary locomotion and fine motor control.",
        "Maintains upright posture and stabilizes critical joints.",
        "Powers key internal movements (heart contraction, intestinal peristalsis).",
        "Generates essential metabolic body heat through shivering and baseline contraction."
      ],
      commonDisorders: [
        "Muscular Dystrophy",
        "Fibromyalgia",
        "Tendinitis and strains",
        "Myasthenia Gravis"
      ],
      relatedSystems: ["Skeletal System", "Nervous System", "Cardiovascular System"],
      color: "from-orange-500 to-red-600",
      glowColor: 0xf97316,
      cameraTarget: { x: 0, y: 1.0, z: 2.2, zoom: 1.4 }
    },
    {
      id: "respiratory",
      name: "Respiratory System",
      shortDescription: "The gas exchange engine, absorbing life-giving oxygen and expelling carbon dioxide.",
      overview: "Consisting of the airways, lungs, and respiratory muscles, this system bridges the external air and our bloodstream, enabling the continuous diffusion of oxygen in and carbon dioxide out.",
      organs: ["Nasal cavity", "Trachea", "Lungs", "Diaphragm", "Bronchi"],
      functions: [
        "Delivers breathable oxygen to blood capillaries.",
        "Expels carbon dioxide waste from the circulatory stream.",
        "Regulates core blood pH through controlled CO2 clearance.",
        "Enables vocal sound production (phonation) and smell."
      ],
      commonDisorders: [
        "Asthma & Chronic Bronchitis",
        "Pneumonia",
        "Chronic Obstructive Pulmonary Disease (COPD)",
        "Pulmonary Fibrosis"
      ],
      relatedSystems: ["Cardiovascular System", "Nervous System", "Lymphatic / Immune System"],
      color: "from-sky-400 to-blue-500",
      glowColor: 0x38bdf8,
      cameraTarget: { x: 0, y: 1.15, z: 1.7, zoom: 2.3 }
    },
    {
      id: "digestive",
      name: "Digestive System",
      shortDescription: "The process chamber that disintegrates intake food, absorbs nutrients, and expels waste.",
      overview: "An interconnected gastrointestinal tract starting from the mouth down to the intestines, supported by accessory organs (liver, pancreas, gallbladder) that chemically and mechanically break foods into absorbable building blocks.",
      organs: ["Stomach", "Liver", "Small intestine", "Large intestine", "Pancreas", "Esophagus", "Gallbladder"],
      functions: [
        "Ingests food and moves it mechanically along the digital tract.",
        "Secretes powerful acid and digestive enzymes to dissolve compounds.",
        "Absorbs clean water, glucose, lipids, and amino acids in the small intestine.",
        "Consolidates and expels indigestible solid waste (feces)."
      ],
      commonDisorders: [
        "Gastroesophageal Reflux Disease (GERD)",
        "Irritable Bowel Syndrome (IBS)",
        "Celiac Disease",
        "Cirrhosis of the Liver"
      ],
      relatedSystems: ["Cardiovascular System", "Endocrine System", "Nervous System"],
      color: "from-emerald-500 to-teal-600",
      glowColor: 0x10b981,
      cameraTarget: { x: 0, y: 0.9, z: 1.8, zoom: 2.1 }
    },
    {
      id: "urinary",
      name: "Urinary System",
      shortDescription: "The filtration and sanitation plant, maintaining electrolyte levels and removing dissolved toxins.",
      overview: "Featuring the kidneys, ureters, bladder, and urethra, this system constantly filters blood, extracting nitrogenous waste (urea), adjusting electrolyte balance, and maintaining proper systemic blood pressure.",
      organs: ["Kidneys", "Bladder", "Ureters", "Urethra"],
      functions: [
        "Eliminates metabolic wastes, toxins, and drug residues from blood.",
        "Regulates total blood volume and systemic fluid balance.",
        "Maintains precise blood salt, potassium, and calcium levels.",
        "Produces erythropoietin (EPO) to trigger red blood cell production."
      ],
      commonDisorders: [
        "Chronic Kidney Disease (CKD)",
        "Urinary Tract Infections (UTIs)",
        "Kidney Stones (Nephrolithiasis)",
        "Urinary Incontinence"
      ],
      relatedSystems: ["Cardiovascular System", "Endocrine System", "Digestive System"],
      color: "from-indigo-400 to-purple-500",
      glowColor: 0x818cf8,
      cameraTarget: { x: 0, y: 0.8, z: 1.8, zoom: 2.2 }
    },
    {
      id: "endocrine",
      name: "Endocrine System",
      shortDescription: "The network of hormone-secreting glands regulating slow-acting, long-term bodily changes.",
      overview: "Using chemical messengers (hormones) circulated through the bloodstream, this system regulates slower, far-reaching aspects like metabolic rate, growth, cellular repair, circadian rhythms, and reproductive cycles.",
      organs: ["Thyroid gland", "Pancreas", "Adrenal glands", "Pituitary gland", "Pineal gland", "Hypothalamus"],
      functions: [
        "Maintains cellular homeostasis (regulates blood sugar, heart rate).",
        "Controls tissue development and growth rates.",
        "Regulates metabolism and nutritional energy storage.",
        "Coordinates chemical cycles and biological sleep patterns."
      ],
      commonDisorders: [
        "Diabetes Mellitus (blood sugar regulation failure)",
        "Hypothyroidism and Hyperthyroidism",
        "Addison's Disease",
        "Pituitary Adenomas"
      ],
      relatedSystems: ["Nervous System", "Reproductive System", "Digestive System"],
      color: "from-pink-500 to-rose-600",
      glowColor: 0xec4899,
      cameraTarget: { x: 0, y: 1.25, z: 1.6, zoom: 2.4 }
    },
    {
      id: "lymphatic",
      name: "Lymphatic / Immune System",
      shortDescription: "The physiological defense shield, maintaining fluid balance and neutralizing pathogens.",
      overview: "Comprising lymph vessels, lymph nodes, the spleen, thymus, and tonsils, this system recovers interstitial fluid leaks, filters out debris, and serves as the training ground for customized pathogen-fighting foreign defense cells.",
      organs: ["Spleen", "Thymus", "Tonsils", "Lymph nodes", "Bone marrow"],
      functions: [
        "Filters interstitial fluid, returning filtered lymph back to the blood circular path.",
        "Absorbs dietary fats from the digestive tract.",
        "Manufactures, recruits, and hosts specialized white defense cells (lymphocytes).",
        "Identifies and engulfs foreign bacteria, virus strains, and neoplastic cancer cells."
      ],
      commonDisorders: [
        "Lymphedema (fluid buildup in limbs)",
        "Lymphoma (lymph node cancer)",
        "Autoimmune Disorders (Lupus, Rheumatoid Arthritis)",
        "Immunodeficiency (SCID, HIV-AIDS)"
      ],
      relatedSystems: ["Cardiovascular System", "Digestive System", "Integumentary System"],
      color: "from-cyan-400 to-teal-500",
      glowColor: 0x22d3ee,
      cameraTarget: { x: 0, y: 1.0, z: 2.0, zoom: 1.5 }
    },
    {
      id: "integumentary",
      name: "Integumentary System",
      shortDescription: "The body's primary protective wrap, isolating internal organs from outer environmental hazards.",
      overview: "Formed by the skin, hair, nails, and specialized sensory/exocrine glands, this system stands as our extensive outer defense buffer, crucial for thermal regulation and outer sensory exploration.",
      organs: ["Skin", "Hair", "Nails", "Sweat and sebaceous glands"],
      functions: [
        "Provides an active barrier against pathogens, UV rays, and physical tears.",
        "Prevents harmful bodily fluid loss and dehydration.",
        "Synthesizes essential Vitamin D inside skin layers using solar UV light.",
        "Regulates body heat through sweat evaporation and blood vessel dilation."
      ],
      commonDisorders: [
        "Melanoma (skin cancer)",
        "Eczema & Psoriasis",
        "Severe Burns",
        "Alopecia"
      ],
      relatedSystems: ["Nervous System", "Lymphatic / Immune System", "Urinary System"],
      color: "from-violet-400 to-indigo-600",
      glowColor: 0xa78bfa,
      cameraTarget: { x: 0, y: 1.0, z: 2.2, zoom: 1.2 }
    },
    {
      id: "reproductive",
      name: "Reproductive System",
      shortDescription: "The biological system responsible for the transmission of genetic material and species survival.",
      overview: "Providing different structures in males and females, this system is specialized for manufacturing sex hormones, producing active gametes (sperm and egg cells), and hosting gestational growth in females.",
      organs: ["Male reproductive organs", "Female reproductive organs", "Ovaries", "Testes", "Uterus"],
      functions: [
        "Produces sex gametes (sperm in males, eggs/ova in females).",
        "Synthesizes key hormones driving secondary sex characteristics (testosterone, estrogen).",
        "Facilitates internal fertilization and early gene mixing.",
        "Enables pregnancy, protective gestation, and nourishment of offspring."
      ],
      commonDisorders: [
        "Infertility",
        "Endometriosis",
        "Polycystic Ovary Syndrome (PCOS)",
        "Prostate Cancer / BPH"
      ],
      relatedSystems: ["Endocrine System", "Urinary System", "Cardiovascular System"],
      color: "from-rose-400 to-pink-500",
      glowColor: 0xf43f5e,
      cameraTarget: { x: 0, y: 0.7, z: 1.8, zoom: 2.3 }
    }
  ],

  organs: [
    {
      id: "brain",
      name: "Brain",
      system: "Nervous System",
      location: "Head cavity, fully encased inside the hard bone skull",
      structure: "A highly folded structure containing ~86 billion neurons, divided into the cerebrum, cerebellum, and brainstem.",
      function: "The central executive processor of the entire body. It decodes sensory feedback, issues motor commands, handles thinking, establishes complex memories, and coordinates base reflexive life support.",
      quickFacts: [
        "Consumes about 20% of your body's total oxygen and energy despite weighing only 3 pounds.",
        "Information travel speeds across different pathways can exceed 260 miles per hour.",
        "The left hemisphere regulates the right side of the body, and the right hemisphere regulates the left."
      ],
      relatedOrgans: ["Spinal cord", "Peripheral nerves", "Sensory organs"],
      hotspotPosition: { x: 0, y: 1.55, z: 0.1 },
      meshName: "Brain"
    },
    {
      id: "spinal-cord",
      name: "Spinal cord",
      system: "Nervous System",
      location: "Runs from the base of the skull down through the central vertebral canal of the spine",
      structure: "A thick column of delicate nervous tissue containing central grey matter surrounded by white myelinated tracts.",
      function: "Serves as the vital superhighway carrying motor commands down from the brain and sensory signals up, while housing the fast circuits for motor reflexes.",
      quickFacts: [
        "Is about 45 cm (18 inches) long in men and 43 cm (17 inches) long in women.",
        "Unlike peripheral nerves, the central spinal cord has virtually zero self-healing properties if torn.",
        "Directly initiates local spinal reflexes without waiting for brain routing (like pulling away from a hot stove)."
      ],
      relatedOrgans: ["Brain", "Peripheral nerves", "Bones"],
      hotspotPosition: { x: 0, y: 1.1, z: -0.08 },
      meshName: "Spinal Cord"
    },
    {
      id: "heart",
      name: "Heart",
      system: "Cardiovascular System",
      location: "Chest cavity (mediastinum), directly between the lungs and slightly left of center",
      structure: "A muscular, hollow pump about the size of a closed fist, divided into four chambers: two upper atria and two lower ventricles.",
      function: "Generates pressure to move blood throughout the body. The right side pumps deoxygenated blood to the lungs to pick up oxygen, while the left side distributes oxygenated blood to tissues.",
      quickFacts: [
        "Beats about 100,000 times a day, circulating roughly 2,000 gallons of blood inside vascular networks.",
        "Has its own internal rhythm generator (SA Node), and can continue beating even if severed from nerves.",
        "Cardiac muscle cells never get tired because they obtain energy from mitochondria-rich aerobic metabolism."
      ],
      relatedOrgans: ["Lungs", "Arteries", "Veins"],
      hotspotPosition: { x: 0.05, y: 1.15, z: 0.15 },
      meshName: "Heart"
    },
    {
      id: "lungs",
      name: "Lungs",
      system: "Respiratory System",
      location: "Thoracic cavity, fills out the sides of the chest, protected by the ribcage",
      structure: "Two cone-shaped, sponge-like organs made of branching bronchi and bronchioles terminating in millions of microscopic air sacs (alveoli).",
      function: "Inhales oxygen-rich air and permits it to diffuse across the thin alveolar membranes into capillaries while drawing CO2 waste out to be exhaled.",
      quickFacts: [
        "The right lung is shorter and wider and contains three lobes, while the left lung has two lobes to leave space for the heart.",
        "The total surface area of all alveoli is equal to roughly 70 square meters (the size of a tennis court).",
        "Lungs are the only organs in the human body light enough to float directly on water."
      ],
      relatedOrgans: ["Heart", "Trachea", "Diaphragm"],
      hotspotPosition: { x: -0.15, y: 1.15, z: 0.12 },
      meshName: "Lungs"
    },
    {
      id: "liver",
      name: "Liver",
      system: "Digestive System",
      location: "Upper right abdomen, directly below the diaphragm and above the stomach",
      structure: "A large, triangular reddish-brown organ consisting of two primary lobes, rich in blood supply from the portal vein.",
      function: "Acts as the body's primary chemical processing center. It filters blood from the gut, detoxifies chemicals, manufactures bile for fat absorption, and stores glycogen, iron, and key vitamins.",
      quickFacts: [
        "The liver performs over 500 vital biochemical functions simultaneously.",
        "It is the only organ that has an incredible capacity for natural tissue regeneration; a healthy liver can reform from just 25% of its original mass.",
        "Houses Kupffer cells which act as specialized local macrophages, devouring bacteria entering from digestion."
      ],
      relatedOrgans: ["Stomach", "Gallbladder", "Pancreas", "Small intestine"],
      hotspotPosition: { x: -0.09, y: 0.9, z: 0.14 },
      meshName: "Liver"
    },
    {
      id: "stomach",
      name: "Stomach",
      system: "Digestive System",
      location: "Left upper tier of the abdomen, underneath the liver",
      structure: "A highly expandable, J-shaped muscular sac with thick folding ridges (rugae) inside that grind food.",
      function: "Stores ingested food and carries out chemical digestions through powerful hydrochloric acid and pepsin enzymes, transforming meals into a liquid soup (chyme).",
      quickFacts: [
        "The stomach is highly acidic, with a pH of 1.5 to 3.5—strong enough to dissolve metal.",
        "The stomach lining must completely replace itself every 3 to 4 days to prevent digesting itself.",
        "It can expand from a volume of just 50 milliliters when empty to over 4 liters after a heavy meal."
      ],
      relatedOrgans: ["Esophagus", "Small intestine", "Liver", "Pancreas"],
      hotspotPosition: { x: 0.08, y: 0.88, z: 0.13 },
      meshName: "Stomach"
    },
    {
      id: "small-intestine",
      name: "Small intestine",
      system: "Digestive System",
      location: "Central and lower abdominal cavity, framed by the large colon",
      structure: "A multi-looped, winding tube roughly 6 meters (20 feet) long, divided into three segments: duodenum, jejunum, and ileum.",
      function: "The site where 90% of chemical digestion and nutrient absorption takes place. Enzymes break down nutrients, which are absorbed into the blood through tiny finger-like projections (villi).",
      quickFacts: [
        "The small intestine is about three times longer than your physical body length.",
        "Its lining features circular folds, microscopic villi, and microvilli, expanding its absorptive surface area 600-fold.",
        "Takes about 4 to 6 hours for food to slowly wind through its entire length."
      ],
      relatedOrgans: ["Stomach", "Large intestine", "Pancreas", "Liver"],
      hotspotPosition: { x: 0, y: 0.74, z: 0.14 },
      meshName: "Small Intestine"
    },
    {
      id: "large-intestine",
      name: "Large intestine",
      system: "Digestive System",
      location: "Surrounds the small intestine in an inverted U-shape in the abdomen",
      structure: "A wider, thicker muscular section roughly 1.5 meters (5 feet) long, containing the cecum, ascending, transverse, descending, and sigmoid colons.",
      function: "Absorbs water and key salts from the remaining indigestible food mass, hosting trillions of beneficial gut bacteria, and formatting solid wastes for excretion.",
      quickFacts: [
        "Houses over 100 trillion microbial bacteria which synthesize vital vitamins like Vitamin K and B12.",
        "Water absorption is highly efficient; it recovers about 90% of the fluid that enters it daily.",
        "The appendix, a small finger-like pouch attached near the start of the colon, is considered a safehouse for healthy gut bacteria."
      ],
      relatedOrgans: ["Small intestine", "Stomach"],
      hotspotPosition: { x: 0, y: 0.7, z: 0.12 },
      meshName: "Large Intestine"
    },
    {
      id: "kidneys",
      name: "Kidneys",
      system: "Urinary System",
      location: "Posterior abdominal wall (retroperitoneal), one on either side of the spine at the lower rib level",
      structure: "Two bean-shaped, dark-red organs rich in blood supply, containing millions of microscopic filtration units called nephrons.",
      function: "Filter waste products, toxins, and excess water out of the blood stream to produce urine, while maintaining the body's narrow margins of water and electrolytes.",
      quickFacts: [
        "Your kidneys process about 150 quarts of blood every single day, filtering out 1 to 2 quarts of urine.",
        "You can lose up to 75% of your combined kidney tissue before experiencing severe metabolic symptoms.",
        "They secrete key renin hormones to regulate system-wide arterial blood pressure."
      ],
      relatedOrgans: ["Bladder", "Arteries", "Veins"],
      hotspotPosition: { x: 0.08, y: 0.84, z: -0.1 },
      meshName: "Kidneys"
    },
    {
      id: "bladder",
      name: "Bladder",
      system: "Urinary System",
      location: "Lower abdominal pelvic floor, positioned directly behind the pubic bone",
      structure: "A hollow, highly distensible muscular balloon lined with transitional epithelium to prevent urine absorption.",
      function: "Serves as a temporary reservoir for holding up to 500-700 ml of urine, slowly expanding before signaling the urge to micturate (urinate).",
      quickFacts: [
        "When empty, it collapses to the size of a walnut, but healthy adult bladders easily swell to hold a pint or two of urine.",
        "Its muscular wall (detrusor muscle) contracts during urination while sphincters open in a coordinated reflex.",
        "Urine travels from the kidneys to the bladder via twin micro-tubes called ureters."
      ],
      relatedOrgans: ["Kidneys", "Male reproductive organs", "Female reproductive organs"],
      hotspotPosition: { x: 0, y: 0.6, z: 0.13 },
      meshName: "Bladder"
    },
    {
      id: "skin",
      name: "Skin",
      system: "Integumentary System",
      location: "Covers the entire outer surface of the human body",
      structure: "The largest organ of the body, divided into three layers: Epidermis (outer shield), Dermis (connective base with nerves), and Hypodermis (subcutaneous fat).",
      function: "Provides key physical defense, prevents dehydration, gathers tactile sensations (heat, cold, pain, vibration), and synthesizes Vitamin D from sunlight.",
      quickFacts: [
        "Skin constitutes about 16% of total average body mass and spans close to 20 square feet.",
        "You shed about 30,000 to 40,000 dead skin cells every single minute.",
        "Dust in typical households is largely made up of shed human skin flakes."
      ],
      relatedOrgans: ["Bones", "Muscles"],
      hotspotPosition: { x: -0.32, y: 0.9, z: 0.16 },
      meshName: "Skin"
    },
    {
      id: "bones",
      name: "Bones",
      system: "Skeletal System",
      location: "Distributed extensively throughout the axial frame and limbs",
      structure: "Rigid structure comprising dense cortical outer bone, porous trabecular inner tissue, and internal blood-producing marrow.",
      function: "Maintains upright physical height and load bearing, provides hard shields for soft organs, stores minerals (calcium), and continuously spawns fresh blood cells.",
      quickFacts: [
        "Bones are lightweight but stronger than steel relative to weight; a cubic inch of bone can bear a 19,000-pound load.",
        "We are born with ~270 bones, but they fuse over childhood, leaving exactly 206 bones in adulthood.",
        "By weight, bones are made of about 30% organic materials and 70% tough inorganic calcium crystals."
      ],
      relatedOrgans: ["Muscles", "Spinal cord"],
      hotspotPosition: { x: 0.16, y: 0.5, z: 0.08 },
      meshName: "Bones"
    },
    {
      id: "muscles",
      name: "Muscles",
      system: "Muscular System",
      location: "Skeletal muscles cover bone frames; smooth muscles form visceral walls",
      structure: "Bundles of contractile actin and myosin protein fibers triggered by local neuromotor junctions to generate tensile force.",
      function: "Generates physical mechanical force enabling posture maintenance, gross locomotion, and key visceral actions (breathing, peristalsis).",
      quickFacts: [
        "There are over 600 skeletal muscles making up roughly 40% of standard body weight.",
        "The strongest muscle in the human body relative to its sheer size is the Masseter (chewing muscle) which can close teeth with 200 lbs of force.",
        "The Gluteus Maximus is the physically largest muscle in the human body, providing hip extension."
      ],
      relatedOrgans: ["Bones", "Skin", "Spinal cord"],
      hotspotPosition: { x: -0.15, y: 0.8, z: 0.1 },
      meshName: "Muscles"
    },
    {
      id: "pancreas",
      name: "Pancreas",
      system: "Endocrine System",
      location: "Behind the stomach, deep in the upper abdomen",
      structure: "A soft, elongated, flat gland stretching horizontally across the back wall of the abdomen, rich in endocrine islet cells and pancreatic exocrine channels.",
      function: "Plays a crucial dual role. For digestion (exocrine), it secretes enzymes directly into the duodenum. For hormones (endocrine), its Islets of Langerhans produce insulin and glucagon to balance blood glucose levels.",
      quickFacts: [
        "Insulin lowers blood sugar levels, while glucagon stimulates the liver to release stored glucose to raise blood sugar.",
        "The pancreas produces about 1 to 1.5 liters of enzyme-rich pancreatic juice daily.",
        "Unlike some organs, inflammation of the pancreas (pancreatitis) is highly painful and dangerous because pancreatic enzymes begin self-digesting the tissue."
      ],
      relatedOrgans: ["Stomach", "Liver", "Small intestine"],
      hotspotPosition: { x: 0.05, y: 0.84, z: 0.08 },
      meshName: "Pancreas"
    },
    {
      id: "thyroid",
      name: "Thyroid gland",
      system: "Endocrine System",
      location: "Front of the lower neck, resting below the larynx and wrapping around the trachea",
      structure: "A butterfly-shaped gland composed of two lateral lobes connected by a central bridge (isthmus), rich in follicular hormone-producing cells.",
      function: "Synthesizes thyroxine (T4) and triiodothyronine (T3) hormones which act as the body's master metabolic dial, deciding how fast cells consume nutrients and generate energy.",
      quickFacts: [
        "Needs trace dietary iodine to manufacture thyroid hormones; iodine deficiency leads to thyroid swelling, known as a goiter.",
        "Regulates system-wide calcium levels by releasing calcitonin.",
        "An overactive thyroid (hyperthyroidism) can cause rapid heart rate, unexplained weight loss, and extreme heat sensitivity."
      ],
      relatedOrgans: ["Trachea"],
      hotspotPosition: { x: 0, y: 1.34, z: 0.06 },
      meshName: "Thyroid Gland"
    },
    {
      id: "male-reproductive",
      name: "Male reproductive organs",
      system: "Reproductive System",
      location: "Pelvic region, primarily localizing externally within the perineal area",
      structure: "Consists of the testes suspended in the scrotum, an internal epididymis, vas deferens, prostate gland, and penis.",
      function: "Secretes male hormones (testosterone) driving development, manufactures spermatozoa (gametes), and delivers semen to the female tract.",
      quickFacts: [
        "Testes must hang outside the core body cavity because standard sperm production requires temperatures ~2°C below body temperature.",
        "The prostate gland grows naturally larger in most men over 50 (BPH), occasionally compressing the urethral passage.",
        "A healthy young male manufactures upwards of 1,500 sperm cells every single second of their adult life."
      ],
      relatedOrgans: ["Bladder", "Kidneys"],
      hotspotPosition: { x: -0.02, y: 0.52, z: 0.14 },
      meshName: "Male Reproductive Organs"
    },
    {
      id: "female-reproductive",
      name: "Female reproductive organs",
      system: "Reproductive System",
      location: "Deep inside the pelvic cavity, protected between the hip bones",
      structure: "Comprises the ovaries, fallopian tubes, muscular uterus, cervix, and vaginal canal.",
      function: "Produces eggs (ova), synthesizes estrogen and progesterone, facilitates fertilization, and hosts the entire 9-month pregnancy gestation.",
      quickFacts: [
        "A female is born with all 1 to 2 million eggs she will ever have, which slowly decline to about 300,000 by puberty.",
        "The Uterus is an incredibly strong muscle, capable of stretching from a small pear up to 500 times its volume during pregnancy.",
        "Oocytes travel down the fallopian tubes, which are lined with tiny brushing cilia moving the cell toward the uterus."
      ],
      relatedOrgans: ["Bladder", "Kidneys"],
      hotspotPosition: { x: 0.02, y: 0.52, z: 0.12 },
      meshName: "Female Reproductive Organs"
    }
  ]
};
