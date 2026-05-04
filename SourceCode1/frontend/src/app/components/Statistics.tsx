import { Users, BookOpen, FileCheck, Award } from 'lucide-react';

export function Statistics() {
  const stats = [
    {
      icon: Users,
      value: '25K+',
      label: 'Students Enrolled',
      color: '#FF8000',
    },
    {
      icon: BookOpen,
      value: '120+',
      label: 'Courses Available',
      color: '#10B981',
    },
    {
      icon: FileCheck,
      value: '10K+',
      label: 'Exams Completed',
      color: '#3B82F6',
    },
    {
      icon: Award,
      value: '8K+',
      label: 'Certificates Issued',
      color: '#8B5CF6',
    },
  ];

  return (
    <section className="px-20 py-16" style={{ backgroundColor: '#F7F5EE' }}>
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl" style={{ fontWeight: 600, color: '#1A1A1A' }}>
          Trusted by Learners Worldwide
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>

              {/* Value */}
              <div className="text-4xl mb-2" style={{ fontWeight: 700, color: '#1A1A1A' }}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm" style={{ color: '#666' }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
