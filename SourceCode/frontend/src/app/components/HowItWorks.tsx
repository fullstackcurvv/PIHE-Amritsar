import { UserPlus, BookOpen, GraduationCap, Award } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      number: '1',
      title: 'Register',
      description: 'Create your account in few simple steps.',
      color: '#FF8000',
    },
    {
      icon: BookOpen,
      number: '2',
      title: 'Enroll',
      description: 'Choose and enroll in your desired courses.',
      color: '#10B981',
    },
    {
      icon: GraduationCap,
      number: '3',
      title: 'Learn',
      description: 'Access lessons, study materials and exams.',
      color: '#3B82F6',
    },
    {
      icon: Award,
      number: '4',
      title: 'Get Certified',
      description: 'Complete exams and earn your certificate.',
      color: '#8B5CF6',
    },
  ];

  return (
    <section className="px-20 py-16" style={{ backgroundColor: '#FFF' }}>
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#1A1A1A' }}>
          How It Works
        </h2>
      </div>

      {/* Steps */}
      <div className="flex items-start justify-center gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              {/* Icon Circle */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <Icon className="w-10 h-10" style={{ color: step.color }} />
              </div>

              {/* Step Number & Title */}
              <div className="mb-2">
                <span className="text-sm" style={{ fontWeight: 600, color: '#999' }}>
                  {step.number}.{' '}
                </span>
                <span className="text-lg" style={{ fontWeight: 600, color: '#1A1A1A' }}>
                  {step.title}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm" style={{ color: '#666', lineHeight: 1.6 }}>
                {step.description}
              </p>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div 
                  className="absolute text-2xl"
                  style={{ 
                    left: `${(index + 1) * 25 - 5}%`,
                    top: '40px',
                    color: '#D1D5DB'
                  }}
                >
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
