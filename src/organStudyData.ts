export interface OrganStudySection {
  summary: string;
  grossAnatomy: string[];
  vascularSupply: string[];
  innervation: string[];
  histology: string[];
  embryology: string[];
  clinicalCorrelation: string[];
}

export const organStudyData: Record<string, OrganStudySection> = {
  brain: {
    summary: 'The brain is the central organ of the nervous system and is responsible for consciousness, cognition, voluntary motor control, autonomic integration, and higher cortical functions. At MBBS level, it should be studied in terms of gross divisions, blood supply, ventricular system, meninges, cranial nerves, and localization of function.',
    grossAnatomy: [
      'Divided into cerebrum, diencephalon, brainstem, and cerebellum; the cerebral hemispheres contain frontal, parietal, temporal, and occipital lobes.',
      'The ventricular system includes lateral ventricles, third ventricle, cerebral aqueduct, and fourth ventricle, all containing cerebrospinal fluid.',
      'Meningeal coverings are dura mater, arachnoid mater, and pia mater; dural venous sinuses provide venous drainage.'
    ],
    vascularSupply: [
      'Arterial supply is derived mainly from the internal carotid and vertebrobasilar systems.',
      'The circle of Willis forms the major arterial anastomotic ring at the base of the brain.',
      'Venous drainage occurs through superficial and deep cerebral veins into dural venous sinuses and then the internal jugular veins.'
    ],
    innervation: [
      'The brain itself processes incoming and outgoing neural signals and gives rise to most cranial nerves.',
      'Pain-sensitive structures include meninges and blood vessels; brain parenchyma itself is relatively insensitive to pain.',
      'Autonomic regulation is coordinated via hypothalamic and brainstem centers.'
    ],
    histology: [
      'Grey matter contains neuronal cell bodies, dendrites, synapses, and neuroglia.',
      'White matter consists predominantly of myelinated axons arranged in projection, commissural, and association tracts.',
      'Glial cells include astrocytes, oligodendrocytes, microglia, and ependymal cells.'
    ],
    embryology: [
      'Develops from the neural tube, with the forebrain, midbrain, and hindbrain as primary brain vesicles.',
      'Secondary vesicles form telencephalon, diencephalon, mesencephalon, metencephalon, and myelencephalon.',
      'Neural crest cells contribute to associated peripheral structures but not to the main brain parenchyma.'
    ],
    clinicalCorrelation: [
      'Stroke localization depends on vascular territory: MCA lesions cause contralateral face/upper-limb deficits, while ACA lesions affect lower limb areas more prominently.',
      'Raised intracranial pressure may present with headache, vomiting, papilledema, and decreased level of consciousness.',
      'Common high-yield topics include meningitis, extradural/subdural hemorrhage, hydrocephalus, and cranial nerve palsies.'
    ]
  },
  'spinal-cord': {
    summary: 'The spinal cord is the elongated continuation of the medulla within the vertebral canal and serves as a pathway for ascending sensory and descending motor tracts while also mediating spinal reflexes.',
    grossAnatomy: [
      'Extends from the foramen magnum to approximately the L1-L2 vertebral level in adults.',
      'Shows cervical and lumbosacral enlargements and ends as the conus medullaris, with the filum terminale and cauda equina distally.',
      'Cross-section demonstrates central grey matter in an H-shape surrounded by white matter columns.'
    ],
    vascularSupply: [
      'Supplied mainly by one anterior spinal artery and two posterior spinal arteries.',
      'Segmental medullary and radicular arteries reinforce the longitudinal vessels; the artery of Adamkiewicz is clinically important.',
      'Venous drainage occurs through spinal veins into the internal vertebral venous plexus.'
    ],
    innervation: [
      'It gives origin to spinal nerve roots composed of dorsal sensory and ventral motor components.',
      'Dorsal horn receives sensory input, while ventral horn contains lower motor neurons.',
      'Autonomic neurons are present in the lateral horn at thoracolumbar and sacral levels.'
    ],
    histology: [
      'Grey matter contains anterior, posterior, and lateral horns with interneurons and motor neurons.',
      'White matter contains ascending tracts such as spinothalamic and dorsal columns, and descending tracts such as corticospinal tracts.',
      'The central canal is lined by ependymal cells.'
    ],
    embryology: [
      'Derived from the caudal neural tube.',
      'Basal plate gives rise to motor regions and alar plate to sensory regions.',
      'Differential growth of the vertebral column explains the adult termination level of the cord.'
    ],
    clinicalCorrelation: [
      'Spinal cord lesions produce upper motor neuron signs below the level of the lesion and lower motor neuron signs at the level of the lesion.',
      'Brown-Séquard syndrome, anterior cord syndrome, and transverse myelitis are common exam patterns.',
      'Lumbar puncture is performed below the level of the cord, usually at L3-L4 or L4-L5.'
    ]
  },
  heart: {
    summary: 'The heart is a four-chambered muscular pump located in the middle mediastinum. For MBBS learning it must be understood through surface anatomy, chambers, valves, coronary circulation, conduction system, and clinical auscultation points.',
    grossAnatomy: [
      'Composed of right and left atria and ventricles separated by septa, with a base and an apex.',
      'The fibrous skeleton supports the valves: tricuspid, pulmonary, mitral, and aortic valves.',
      'The pericardium consists of fibrous and serous layers with a potential pericardial cavity between parietal and visceral layers.'
    ],
    vascularSupply: [
      'Arterial supply is via right and left coronary arteries arising from the ascending aorta.',
      'Key branches include the LAD, circumflex, right marginal, and posterior interventricular artery.',
      'Venous drainage is mainly through the coronary sinus into the right atrium.'
    ],
    innervation: [
      'Cardiac plexus contains sympathetic fibers from T1-T5 and parasympathetic fibers from the vagus nerve.',
      'Sympathetic stimulation increases heart rate and force of contraction; parasympathetic stimulation mainly slows the heart.',
      'The intrinsic conduction system includes SA node, AV node, bundle of His, bundle branches, and Purkinje fibers.'
    ],
    histology: [
      'Myocardium is composed of branching cardiac muscle fibers connected by intercalated discs.',
      'Endocardium lines the chambers, and epicardium forms the visceral serous pericardium.',
      'Purkinje fibers are modified cardiac muscle cells specialized for conduction.'
    ],
    embryology: [
      'Develops from the cardiogenic mesoderm and begins beating early in embryonic life.',
      'The primitive heart tube undergoes looping and septation to form definitive chambers and outflow tracts.',
      'High-yield defects include ASD, VSD, Tetralogy of Fallot, and transposition of great arteries.'
    ],
    clinicalCorrelation: [
      'Myocardial infarction most commonly involves the LAD; ECG and cardiac enzymes are essential for diagnosis.',
      'Valvular lesions produce characteristic murmurs that should be correlated with auscultation areas.',
      'Cardiac tamponade, heart failure, arrhythmias, and infective endocarditis are common exam topics.'
    ]
  },
  lungs: {
    summary: 'The lungs are paired organs of respiration occupying the pleural cavities. MBBS study includes lobes and fissures, bronchopulmonary segments, hilum contents, pleura, and microscopic gas-exchange units.',
    grossAnatomy: [
      'The right lung has three lobes and the left lung has two lobes with a cardiac notch and lingula.',
      'Each lung has an apex, base, costal surface, mediastinal surface, and hilum.',
      'Bronchopulmonary segments are surgically important functional units supplied by segmental bronchi.'
    ],
    vascularSupply: [
      'Functional blood supply is via pulmonary arteries carrying deoxygenated blood and pulmonary veins returning oxygenated blood.',
      'Nutritional blood supply is via bronchial arteries from the thoracic aorta or intercostal arteries.',
      'Bronchial veins drain partly into the azygos system and partly into pulmonary veins.'
    ],
    innervation: [
      'The pulmonary plexus contains sympathetic and parasympathetic fibers.',
      'Parasympathetic fibers from the vagus cause bronchoconstriction and increased glandular secretion.',
      'Sympathetic fibers cause bronchodilation and vasoconstriction.'
    ],
    histology: [
      'Conducting passages are lined by pseudostratified ciliated columnar epithelium, becoming simpler distally.',
      'Alveoli are lined mainly by type I pneumocytes, with type II pneumocytes producing surfactant.',
      'Alveolar macrophages are important in pulmonary defense and particulate clearance.'
    ],
    embryology: [
      'Develop from the respiratory diverticulum budding from the foregut.',
      'The branching pattern forms bronchi, bronchioles, and terminal respiratory units in successive developmental stages.',
      'Surfactant production becomes clinically important in late fetal life and prematurity.'
    ],
    clinicalCorrelation: [
      'Pleural effusion and pneumothorax are frequent clinically important pleural conditions.',
      'Asthma, COPD, pneumonia, pulmonary embolism, and lung carcinoma are core topics.',
      'Surface anatomy and segmental anatomy are essential for interpreting chest imaging and procedures.'
    ]
  },
  liver: {
    summary: 'The liver is the largest gland in the body and performs vital metabolic, synthetic, detoxification, and excretory functions. MBBS study should correlate gross lobes, segmental anatomy, portal triads, and dual blood supply.',
    grossAnatomy: [
      'Located mainly in the right hypochondrium and epigastrium, extending partially to the left hypochondrium.',
      'Anatomically it has right and left lobes with caudate and quadrate parts; functionally it is divided by vascular segmentation.',
      'Peritoneal reflections include the falciform, coronary, and triangular ligaments; the porta hepatis transmits major vessels and ducts.'
    ],
    vascularSupply: [
      'Receives dual blood supply from the hepatic artery proper and portal vein.',
      'Venous drainage occurs via hepatic veins directly into the inferior vena cava.',
      'Portal triads contain a branch of the portal vein, a branch of the hepatic artery, and a bile ductule.'
    ],
    innervation: [
      'Autonomic innervation is via the hepatic plexus, containing sympathetic and parasympathetic fibers.',
      'Visceral pain from the capsule may be referred to the right shoulder when diaphragmatic peritoneum is irritated.',
      'Neural control is less emphasized than vascular and biliary anatomy in undergraduate anatomy.'
    ],
    histology: [
      'The hepatic lobule contains plates of hepatocytes arranged around a central vein.',
      'Sinusoids contain fenestrated endothelium and Kupffer cells for phagocytic function.',
      'Bile canaliculi collect bile produced by hepatocytes and drain toward bile ducts in portal triads.'
    ],
    embryology: [
      'Develops from the hepatic diverticulum of the foregut endoderm.',
      'The cranial part forms the liver and intrahepatic biliary apparatus, while the caudal part contributes to the gallbladder and extrahepatic ducts.',
      'The fetal liver is a major site of hematopoiesis.'
    ],
    clinicalCorrelation: [
      'Portal hypertension causes ascites, splenomegaly, and portosystemic collateral formation.',
      'Jaundice can result from pre-hepatic, hepatic, or post-hepatic causes.',
      'Liver biopsy, cirrhosis, hepatocellular carcinoma, and hepatic segmental resection are common exam areas.'
    ]
  },
  stomach: {
    summary: 'The stomach is a muscular intraperitoneal organ involved in food storage, churning, acid secretion, and early digestion. MBBS study focuses on parts, curvatures, relations, blood supply, and histological layers.',
    grossAnatomy: [
      'Divided into cardia, fundus, body, and pyloric part including pyloric antrum and pylorus.',
      'Has lesser and greater curvatures and anterior and posterior surfaces.',
      'Suspended by the lesser and greater omenta and related anteriorly to the liver and diaphragm and posteriorly to the stomach bed.'
    ],
    vascularSupply: [
      'Supplied by branches of the celiac trunk: left and right gastric, left and right gastro-omental, and short gastric arteries.',
      'Venous drainage parallels the arteries and drains mainly to the portal venous system.',
      'Lymph drains to gastric and gastro-omental nodes, eventually to celiac nodes.'
    ],
    innervation: [
      'Parasympathetic supply is via the vagus nerves and stimulates motility and secretion.',
      'Sympathetic fibers are derived from the greater splanchnic nerves via the celiac plexus.',
      'Enteric neural circuits coordinate peristalsis and gastric emptying.'
    ],
    histology: [
      'Mucosa contains gastric pits and glands with mucous cells, chief cells, and parietal cells.',
      'Parietal cells secrete hydrochloric acid and intrinsic factor; chief cells secrete pepsinogen.',
      'The muscularis externa has an additional inner oblique layer aiding mechanical digestion.'
    ],
    embryology: [
      'Develops from the foregut and rotates 90 degrees clockwise during development.',
      'Its rotation creates the greater and lesser curvatures and contributes to the formation of the lesser sac.',
      'Differential growth of its walls explains final adult shape.'
    ],
    clinicalCorrelation: [
      'Peptic ulcer disease commonly affects the lesser curvature and first part of the duodenum.',
      'Carcinoma stomach, hypertrophic pyloric stenosis, and gastritis are common topics.',
      'Loss of intrinsic factor can lead to pernicious anemia due to vitamin B12 deficiency.'
    ]
  },
  'small-intestine': {
    summary: 'The small intestine is the principal site for digestion and absorption and is divided into duodenum, jejunum, and ileum. MBBS study emphasizes differentiation of these segments, peritoneal relations, mesentery, and absorptive histology.',
    grossAnatomy: [
      'The duodenum is mostly retroperitoneal and receives bile and pancreatic secretions at the major duodenal papilla.',
      'The jejunum has thicker walls, more plicae circulares, and longer vasa recta than the ileum.',
      'The ileum contains Peyer patches and ends at the ileocecal junction guarded by the ileocecal valve.'
    ],
    vascularSupply: [
      'The duodenum receives blood from superior and inferior pancreaticoduodenal arteries.',
      'The jejunum and ileum are supplied by branches of the superior mesenteric artery.',
      'Venous drainage is through the superior mesenteric vein into the portal system.'
    ],
    innervation: [
      'Autonomic supply is via the superior mesenteric plexus with vagal parasympathetic fibers and sympathetic fibers from thoracic splanchnics.',
      'Enteric nervous system regulates segmentation, peristalsis, and secretory activity.',
      'Pain from the midgut is typically referred to the umbilical region.'
    ],
    histology: [
      'Mucosa contains villi, crypts of Lieberkühn, and abundant absorptive enterocytes with microvilli.',
      'Brunner glands are characteristic of the duodenum and Peyer patches of the ileum.',
      'The large absorptive surface area depends on folds, villi, and microvilli.'
    ],
    embryology: [
      'The duodenum has dual origin from foregut and midgut, while the distal small intestine is derived from midgut.',
      'Physiological herniation and rotation of the midgut are high-yield developmental events.',
      'Malrotation, volvulus, and Meckel diverticulum are important embryological correlations.'
    ],
    clinicalCorrelation: [
      'Malabsorption syndromes, celiac disease, Crohn disease, and intestinal obstruction are common pathologies.',
      'Meckel diverticulum is the classic persistent vitellointestinal duct remnant.',
      'Mesenteric ischemia and perforation are important surgical conditions.'
    ]
  },
  'large-intestine': {
    summary: 'The large intestine absorbs water and electrolytes and forms, stores, and expels feces. MBBS study focuses on cecum, colon, rectum, characteristic gross features, vascular patterns, and gut microbiome relevance.',
    grossAnatomy: [
      'It includes cecum, appendix, ascending, transverse, descending, sigmoid colon, rectum, and anal canal.',
      'Characteristic features are taeniae coli, haustra, and appendices epiploicae.',
      'The rectum lacks taeniae and haustra and transitions into the anal canal with important sphincter anatomy.'
    ],
    vascularSupply: [
      'Proximal large intestine is supplied by branches of the superior mesenteric artery; distal colon by branches of the inferior mesenteric artery.',
      'The marginal artery provides an anastomotic channel along the colon.',
      'Venous drainage largely mirrors arterial supply and enters the portal circulation, except part of the lower rectum and anal canal.'
    ],
    innervation: [
      'The midgut-derived proximal colon receives vagal parasympathetic fibers, whereas hindgut-derived distal colon receives pelvic splanchnic nerves.',
      'Sympathetic supply arises via mesenteric plexuses and modulates motility and vascular tone.',
      'Defecation involves autonomic reflexes coordinated with somatic control of the external anal sphincter.'
    ],
    histology: [
      'The mucosa lacks villi but contains numerous goblet-cell-rich intestinal glands.',
      'Absorptive cells recover water and electrolytes from luminal contents.',
      'The appendix has prominent lymphoid tissue in its wall.'
    ],
    embryology: [
      'The proximal two-thirds of the transverse colon is midgut-derived; the distal third and beyond are hindgut-derived.',
      'Midgut rotation and fixation determine the position of cecum and ascending colon.',
      'Failure of normal rotation may predispose to volvulus and abnormal colonic positioning.'
    ],
    clinicalCorrelation: [
      'Appendicitis, ulcerative colitis, colorectal carcinoma, and volvulus are major exam conditions.',
      'Knowledge of portal-systemic anastomoses is important for understanding hemorrhoids and rectal varices.',
      'Sigmoid colon and rectum are common sites for diverticular disease and malignant lesions.'
    ]
  },
  kidneys: {
    summary: 'The kidneys are retroperitoneal organs responsible for filtration, fluid-electrolyte balance, and endocrine functions such as erythropoietin and renin secretion. At MBBS level, gross anatomy, nephron histology, and segmental blood supply are highly important.',
    grossAnatomy: [
      'Each kidney has superior and inferior poles, anterior and posterior surfaces, and a medial hilum opening into the renal sinus.',
      'Internally the kidney is divided into cortex and medulla with pyramids, papillae, calyces, and renal pelvis.',
      'The right kidney lies slightly lower than the left because of the liver.'
    ],
    vascularSupply: [
      'Supplied by renal arteries directly from the abdominal aorta.',
      'Segmental arteries divide into interlobar, arcuate, and interlobular arteries before reaching the glomeruli.',
      'Renal veins drain into the inferior vena cava; the left renal vein is longer and receives other tributaries.'
    ],
    innervation: [
      'Sympathetic fibers are derived mainly from the renal plexus and influence renal blood flow and renin release.',
      'Visceral pain fibers accompany sympathetic fibers and may refer pain to the loin-to-groin region.',
      'Parasympathetic influence is minimal in routine undergraduate discussion.'
    ],
    histology: [
      'The nephron consists of renal corpuscle, proximal tubule, loop of Henle, distal tubule, and collecting system.',
      'The glomerular filtration barrier includes fenestrated endothelium, basement membrane, and podocytes.',
      'Juxtaglomerular apparatus regulates renin secretion and tubular flow sensing.'
    ],
    embryology: [
      'Definitive kidneys arise from metanephros in the pelvis and ascend to the lumbar region.',
      'The ureteric bud forms collecting ducts, calyces, pelvis, and ureter, while metanephric blastema forms nephrons.',
      'Ectopic kidney, horseshoe kidney, and polycystic kidney disease are high-yield anomalies.'
    ],
    clinicalCorrelation: [
      'Acute kidney injury, chronic kidney disease, hydronephrosis, and nephrolithiasis are clinically significant.',
      'The costovertebral angle is examined in renal inflammation.',
      'Renal function tests and urinalysis correlate anatomy with physiology and pathology.'
    ]
  },
  bladder: {
    summary: 'The urinary bladder is a distensible muscular reservoir for urine located in the pelvis. MBBS study should include apex, body, fundus, neck, trigone, support structures, and neural control of micturition.',
    grossAnatomy: [
      'When empty the bladder lies entirely in the pelvis; when full it rises into the lower abdomen.',
      'It has an apex, body, fundus, and neck, with the trigone as a smooth triangular internal area between ureteric and urethral openings.',
      'The detrusor muscle forms the main muscular wall and is continuous with the internal urethral sphincter region.'
    ],
    vascularSupply: [
      'Supplied mainly by superior and inferior vesical arteries, with additional contributions depending on sex.',
      'Venous drainage forms the vesical venous plexus draining into the internal iliac veins.',
      'Lymph drains predominantly to external and internal iliac lymph nodes.'
    ],
    innervation: [
      'Parasympathetic fibers from pelvic splanchnic nerves contract the detrusor and relax the internal sphincter during voiding.',
      'Sympathetic fibers from the hypogastric plexus facilitate storage by relaxing the detrusor and tightening the internal sphincter.',
      'Somatic control of the external urethral sphincter is through the pudendal nerve.'
    ],
    histology: [
      'Lined by transitional epithelium (urothelium) specialized to stretch without leakage.',
      'The mucosa becomes smooth at the trigone and folded elsewhere when the bladder is empty.',
      'The muscular wall is thick and composed of interlacing smooth muscle bundles.'
    ],
    embryology: [
      'Develops largely from the vesicourethral part of the urogenital sinus.',
      'The trigone is formed by incorporation of the mesonephric ducts.',
      'The urachus, a remnant of the allantois, may persist as a fistula or cyst.'
    ],
    clinicalCorrelation: [
      'Urinary retention, cystitis, bladder outlet obstruction, and carcinoma bladder are common topics.',
      'Catheterization requires knowledge of urethral anatomy and sterile technique.',
      'Neurogenic bladder results from disruption of central or peripheral micturition pathways.'
    ]
  },
  skin: {
    summary: 'Skin is the largest organ of the body and forms the external protective barrier. MBBS study includes epidermal layers, dermal appendages, sensory receptors, thermoregulation, and clinical lesions.',
    grossAnatomy: [
      'Skin is composed of epidermis, dermis, and subcutaneous tissue (hypodermis).',
      'Appendages include hair, nails, sebaceous glands, and sweat glands.',
      'Thick skin is found on palms and soles and lacks hair follicles, whereas thin skin covers most of the body.'
    ],
    vascularSupply: [
      'Cutaneous blood supply is via rich dermal vascular plexuses and subpapillary networks.',
      'These vessels are important in thermoregulation through vasodilation and vasoconstriction.',
      'Lymphatic drainage follows regional superficial lymphatic pathways.'
    ],
    innervation: [
      'Supplied by cutaneous nerves carrying pain, temperature, touch, and pressure sensations.',
      'Specialized receptors include Meissner corpuscles, Pacinian corpuscles, Merkel cells, and free nerve endings.',
      'Autonomic fibers supply sweat glands, arrector pili muscles, and cutaneous vessels.'
    ],
    histology: [
      'The epidermis consists mainly of keratinized stratified squamous epithelium with basal, spinous, granular, lucidum, and corneum layers.',
      'The dermis has papillary and reticular layers containing collagen, elastic fibers, vessels, and adnexal structures.',
      'Cells of importance include keratinocytes, melanocytes, Langerhans cells, and Merkel cells.'
    ],
    embryology: [
      'Epidermis is ectodermal in origin, while dermis is largely mesodermal.',
      'Melanocytes are derived from neural crest cells.',
      'Hair follicles and glands arise as epidermal downgrowths into the dermis.'
    ],
    clinicalCorrelation: [
      'Burn depth is classified into epidermal, partial-thickness, and full-thickness injury.',
      'Melanoma, basal cell carcinoma, squamous cell carcinoma, psoriasis, and eczema are major dermatological topics.',
      'Dermatomes are clinically useful in spinal nerve lesion assessment and herpes zoster.'
    ]
  },
  bones: {
    summary: 'Bones form the structural framework of the body, protect organs, store minerals, and house marrow. MBBS study requires understanding bone classification, histology, ossification, and clinically important landmarks.',
    grossAnatomy: [
      'Bones are classified as long, short, flat, irregular, sesamoid, and pneumatic.',
      'A typical long bone has diaphysis, metaphysis, epiphysis, medullary cavity, and periosteum.',
      'Surface features such as tubercles, foramina, fossae, and condyles are clinically and anatomically important.'
    ],
    vascularSupply: [
      'Nutrient arteries supply medulla and inner cortex, while periosteal arteries supply outer cortex.',
      'Epiphyseal and metaphyseal vessels are especially important in growing bones.',
      'Venous channels accompany arteries and communicate with marrow sinusoids.'
    ],
    innervation: [
      'The periosteum is richly innervated and highly sensitive to pain.',
      'Articular surfaces themselves are not pain sensitive, but associated joint structures are.',
      'Neurovascular bundles around bones are important in trauma and surgical approaches.'
    ],
    histology: [
      'Compact bone contains osteons with concentric lamellae around Haversian canals.',
      'Spongy bone consists of trabeculae with marrow spaces.',
      'Cells include osteoblasts, osteocytes, and osteoclasts.'
    ],
    embryology: [
      'Bones develop by intramembranous or endochondral ossification.',
      'Flat skull bones are classic examples of intramembranous ossification.',
      'Most long bones form by endochondral ossification from cartilage models.'
    ],
    clinicalCorrelation: [
      'Fracture healing, osteoporosis, osteomyelitis, osteosarcoma, and rickets are common topics.',
      'Knowledge of ossification centers is important in pediatrics and radiology.',
      'Avascular necrosis and growth-plate injuries are clinically relevant high-yield conditions.'
    ]
  },
  muscles: {
    summary: 'Muscles generate movement, maintain posture, and contribute to heat production. MBBS study includes skeletal muscle architecture, neuromuscular junctions, fiber types, and basic clinical testing.',
    grossAnatomy: [
      'Muscles may be arranged as parallel, pennate, fusiform, or circular depending on function.',
      'Each skeletal muscle has origin, insertion, belly, tendons, and fascial coverings.',
      'Functionally, muscles act as agonists, antagonists, fixators, or synergists.'
    ],
    vascularSupply: [
      'Skeletal muscles receive a rich arterial supply that increases during activity.',
      'Capillary networks are essential for oxygen delivery, especially in oxidative fibers.',
      'Venous drainage follows companion veins and is assisted by muscular contraction.'
    ],
    innervation: [
      'Each skeletal muscle fiber is supplied by a somatic motor neuron forming a neuromuscular junction.',
      'Motor units vary in size according to precision of movement required.',
      'Muscle spindles and Golgi tendon organs mediate proprioception and reflexes.'
    ],
    histology: [
      'Skeletal muscle fibers are multinucleated and striated due to sarcomere organization.',
      'Cardiac and smooth muscle should be distinguished from skeletal muscle by structure and function.',
      'Satellite cells contribute to limited regeneration after muscle injury.'
    ],
    embryology: [
      'Most skeletal muscles arise from paraxial mesoderm, specifically myotomes of somites.',
      'Limb muscles develop from migrating myoblasts.',
      'Patterns of innervation reflect embryologic origin and migration.'
    ],
    clinicalCorrelation: [
      'Muscular dystrophies, myasthenia gravis, compartment syndrome, and tendon injuries are common clinical topics.',
      'Testing power, tone, and reflexes links anatomy with clinical neurological examination.',
      'Denervation leads to atrophy, whereas disuse causes wasting without primary nerve injury.'
    ]
  },
  pancreas: {
    summary: 'The pancreas is a mixed exocrine and endocrine gland situated retroperitoneally behind the stomach. It is an important MBBS organ because it links digestive anatomy, endocrine regulation, and clinically significant inflammatory disease.',
    grossAnatomy: [
      'It has head, uncinate process, neck, body, and tail.',
      'The head lies in the duodenal curve, while the tail approaches the spleen within the splenorenal ligament.',
      'The main pancreatic duct usually joins the bile duct to open at the major duodenal papilla.'
    ],
    vascularSupply: [
      'Supplied by superior and inferior pancreaticoduodenal arteries and branches of the splenic artery.',
      'Venous drainage is into the splenic vein and superior mesenteric vein, entering the portal system.',
      'Its rich vascular network is clinically relevant in pancreatic surgery and inflammation.'
    ],
    innervation: [
      'Autonomic innervation is via celiac and superior mesenteric plexuses.',
      'Parasympathetic stimulation enhances pancreatic secretion.',
      'Visceral pain from pancreatic inflammation is often severe and may radiate to the back.'
    ],
    histology: [
      'Exocrine acini produce digestive enzymes and drain into ductal channels.',
      'Endocrine islets of Langerhans contain beta, alpha, delta, and PP cells.',
      'Beta cells secrete insulin, while alpha cells secrete glucagon.'
    ],
    embryology: [
      'Develops from dorsal and ventral pancreatic buds arising from the foregut.',
      'Fusion of these buds explains the adult arrangement of the pancreas and duct system.',
      'Annular pancreas results from abnormal migration of the ventral bud.'
    ],
    clinicalCorrelation: [
      'Acute and chronic pancreatitis, pancreatic carcinoma, and diabetes mellitus are high-yield disorders.',
      'Serum amylase and lipase are important laboratory markers in pancreatitis.',
      'Pancreatic head tumors may cause obstructive jaundice by compressing the bile duct.'
    ]
  },
  thyroid: {
    summary: 'The thyroid gland is a vascular endocrine gland in the anterior neck that regulates metabolic activity through T3 and T4 secretion. MBBS study includes lobes, isthmus, blood supply, recurrent laryngeal nerve relations, and microscopic follicles.',
    grossAnatomy: [
      'Consists of right and left lobes connected by an isthmus, and may have a pyramidal lobe.',
      'It lies anterolateral to the upper trachea and lower larynx and moves during swallowing.',
      'The posterior relation to the recurrent laryngeal nerve and parathyroid glands is surgically crucial.'
    ],
    vascularSupply: [
      'Supplied by superior and inferior thyroid arteries, with occasional thyroid ima artery.',
      'Venous drainage is through superior, middle, and inferior thyroid veins.',
      'Its vascularity explains the potential for operative bleeding.'
    ],
    innervation: [
      'The gland receives sympathetic fibers from cervical ganglia via periarterial plexuses.',
      'Hormone secretion is controlled primarily by pituitary TSH rather than direct neural input.',
      'In surgery, preservation of laryngeal nerves is more important than gland innervation itself.'
    ],
    histology: [
      'Composed of spherical follicles lined by simple epithelium surrounding colloid.',
      'Follicular cells produce thyroglobulin and thyroid hormones.',
      'Parafollicular or C cells secrete calcitonin.'
    ],
    embryology: [
      'Develops from an endodermal diverticulum at the foramen cecum of the tongue and descends into the neck.',
      'The thyroglossal duct normally disappears; persistence may form a thyroglossal cyst or fistula.',
      'Ectopic thyroid tissue may occur anywhere along the line of descent.'
    ],
    clinicalCorrelation: [
      'Goiter, Graves disease, Hashimoto thyroiditis, and thyroid carcinoma are major conditions.',
      'Thyroidectomy requires knowledge of recurrent laryngeal nerve, external laryngeal nerve, and parathyroid preservation.',
      'Clinical examination includes inspection and palpation during swallowing and assessment of metabolic symptoms.'
    ]
  },
  'male-reproductive': {
    summary: 'The male reproductive organs include testes, epididymides, duct system, accessory glands, and external genitalia. MBBS study emphasizes spermatogenesis, coverings of the testis, inguinal canal relations, and clinical hernia/scrotal pathology.',
    grossAnatomy: [
      'Testes lie in the scrotum and connect to the epididymis and vas deferens.',
      'Accessory glands include seminal vesicles, prostate, and bulbourethral glands.',
      'The penis contains paired corpora cavernosa and a corpus spongiosum enclosing the urethra.'
    ],
    vascularSupply: [
      'Testicular arteries arise from the abdominal aorta; venous drainage forms the pampiniform plexus.',
      'The right testicular vein drains to the IVC and the left usually to the left renal vein.',
      'The penis receives branches from the internal pudendal artery.'
    ],
    innervation: [
      'Autonomic supply to pelvic reproductive structures is via inferior hypogastric plexuses.',
      'Somatic innervation of the perineum and external genitalia is largely via the pudendal nerve.',
      'Erection is predominantly parasympathetic, while ejaculation is predominantly sympathetic.'
    ],
    histology: [
      'Seminiferous tubules contain spermatogenic cells and Sertoli cells.',
      'Leydig cells in the interstitium secrete testosterone.',
      'The prostate is composed of glandular and fibromuscular tissue prone to benign hyperplasia.'
    ],
    embryology: [
      'The testes develop on the posterior abdominal wall and descend into the scrotum.',
      'Failure of descent results in cryptorchidism.',
      'External genital differentiation depends on androgen influence during development.'
    ],
    clinicalCorrelation: [
      'Varicocele, hydrocele, testicular torsion, inguinal hernia, and BPH are major clinical topics.',
      'Prostate enlargement can obstruct urine flow and alter the urinary stream.',
      'Testicular tumors often spread first to para-aortic nodes because of embryologic origin.'
    ]
  },
  'female-reproductive': {
    summary: 'The female reproductive organs include ovaries, uterine tubes, uterus, cervix, vagina, and external genitalia. MBBS study should combine pelvic anatomy, menstrual physiology, pregnancy-related changes, and gynecological correlations.',
    grossAnatomy: [
      'Ovaries lie in the ovarian fossae and are attached by the mesovarium, ovarian ligament, and suspensory ligament.',
      'The uterine tube has infundibulum, ampulla, isthmus, and intramural part; fertilization usually occurs in the ampulla.',
      'The uterus has fundus, body, isthmus, and cervix and is normally anteverted and anteflexed.'
    ],
    vascularSupply: [
      'The ovary is supplied by the ovarian artery from the abdominal aorta.',
      'The uterus is supplied mainly by the uterine artery, a branch of the internal iliac artery.',
      'The uterine artery crosses superior to the ureter, creating the classic surgical relation “water under the bridge”.'
    ],
    innervation: [
      'Autonomic fibers reach the uterus and ovaries through ovarian and uterovaginal plexuses.',
      'Pain from the body of the uterus often follows sympathetic pathways, while cervical pain may follow pelvic splanchnic routes.',
      'The lower vagina has somatic sensory supply via the pudendal nerve.'
    ],
    histology: [
      'The ovary contains follicles in various stages and an endocrine stroma.',
      'The uterine wall has endometrium, myometrium, and perimetrium.',
      'The endometrium undergoes cyclical proliferative, secretory, and menstrual changes.'
    ],
    embryology: [
      'Uterine tubes, uterus, cervix, and upper vagina develop from the paramesonephric ducts.',
      'The lower vagina develops mainly from the urogenital sinus.',
      'Fusion defects may produce bicornuate uterus, uterus didelphys, or vaginal septa.'
    ],
    clinicalCorrelation: [
      'Ectopic pregnancy, uterine fibroids, ovarian cysts, endometriosis, and cervical carcinoma are important topics.',
      'Pelvic inflammatory disease can affect the tubes and fertility.',
      'Knowledge of uterine supports is important in prolapse and obstetric injury.'
    ]
  }
};
