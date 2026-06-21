import React from 'react';

interface IllustrationProps {
  id: string;
  className?: string;
  size?: number;
}

const imageMap: Record<string, string> = {
  cardiovascular: '/assets/anatomy-real/cardiovascular.jpg',
  nervous: '/assets/anatomy-real/nervous.jpg',
  skeletal: '/assets/anatomy-real/skeletal.jpg',
  muscular: '/assets/anatomy-real/muscular.jpg',
  respiratory: '/assets/anatomy-real/respiratory.jpg',
  digestive: '/assets/anatomy-real/digestive.jpg',
  urinary: '/assets/anatomy-real/urinary.jpg',
  endocrine: '/assets/anatomy-real/endocrine.jpg',
  lymphatic: '/assets/anatomy-real/lymphatic.jpg',
  integumentary: '/assets/anatomy-real/integumentary.jpg',
  reproductive: '/assets/anatomy-real/reproductive.jpg',

  brain: '/assets/anatomy-real/brain.jpg',
  'spinal-cord': '/assets/anatomy-real/spinal-cord.jpg',
  heart: '/assets/anatomy-real/heart.jpg',
  lungs: '/assets/anatomy-real/lungs.jpg',
  liver: '/assets/anatomy-real/liver.jpg',
  stomach: '/assets/anatomy-real/stomach.jpg',
  'small-intestine': '/assets/anatomy-real/small-intestine.jpg',
  'large-intestine': '/assets/anatomy-real/large-intestine.jpg',
  kidneys: '/assets/anatomy-real/kidneys.jpg',
  bladder: '/assets/anatomy-real/bladder.jpg',
  skin: '/assets/anatomy-real/skin.jpg',
  bones: '/assets/anatomy-real/bones.jpg',
  muscles: '/assets/anatomy-real/muscles.jpg',
  pancreas: '/assets/anatomy-real/pancreas.jpg',
  thyroid: '/assets/anatomy-real/thyroid.jpg',
  'male-reproductive': '/assets/anatomy-real/male-reproductive.jpg',
  'female-reproductive': '/assets/anatomy-real/female-reproductive.jpg',
};

const labelMap: Record<string, string> = {
  cardiovascular: 'Cardiovascular System', nervous: 'Nervous System', skeletal: 'Skeletal System', muscular: 'Muscular System',
  respiratory: 'Respiratory System', digestive: 'Digestive System', urinary: 'Urinary System', endocrine: 'Endocrine System',
  lymphatic: 'Lymphatic / Immune System', integumentary: 'Integumentary System', reproductive: 'Reproductive System',
  brain: 'Brain', 'spinal-cord': 'Spinal cord', heart: 'Heart', lungs: 'Lungs', liver: 'Liver', stomach: 'Stomach',
  'small-intestine': 'Small intestine', 'large-intestine': 'Large intestine', kidneys: 'Kidneys', bladder: 'Bladder',
  skin: 'Skin', bones: 'Bones', muscles: 'Muscles', pancreas: 'Pancreas', thyroid: 'Thyroid gland',
  'male-reproductive': 'Male reproductive organs', 'female-reproductive': 'Female reproductive organs',
};

export const AnatomyIllustrations: React.FC<IllustrationProps> = ({ id, className = '', size = 200 }) => {
  const src = imageMap[id] || '/anatomy-human-body.png';
  const label = labelMap[id] || 'Human anatomy image';

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-inner select-none ${className}`}
      title={label}
    >
      <img
        src={src}
        alt={label}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain p-2 bg-white transition-transform duration-500 hover:scale-105"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.src = '/anatomy-human-body.png';
        }}
      />
    </div>
  );
};
