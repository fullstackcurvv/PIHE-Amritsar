import course1 from '../../imports/course1.png';
import course2 from '../../imports/course2.png';
import course3 from '../../imports/course3.png';
import course4 from '../../imports/course4.png';
import { BookOpen, BarChart3 } from 'lucide-react';

export function CoursesSection() {
  const courses = [
    {
      image: course1,
      badge: 'Best Seller',
      badgeColor: '#FF8000',
      tag: 'Free',
      tagColor: '#10B981',
      title: 'Bhagavad Gita Foundation',
      description: 'Understand the timeless wisdom of the Bhagavad Gita.',
      lessons: 12,
      level: 'Beginner',
    },
    {
      image: course2,
      badge: 'Popular',
      badgeColor: '#8B5CF6',
      tag: 'Free',
      tagColor: '#10B981',
      title: 'Introduction to ISKCON',
      description: 'Discover the history, philosophy and mission of ISKCON.',
      lessons: 10,
      level: 'Beginner',
    },
    {
      image: course3,
      tag: 'Paid',
      tagColor: '#EF4444',
      title: 'Bhakti Yoga Practice',
      description: 'A practical guide to devotional service and spiritual life.',
      lessons: 15,
      level: 'Intermediate',
    },
    {
      image: course4,
      tag: 'Paid',
      tagColor: '#EF4444',
      title: 'Srimad Bhagavatam Overview',
      description: 'Dive deep into the essence of Srimad Bhagavatam.',
      lessons: 18,
      level: 'Advanced',
    },
  ];

  return (
    <section className="px-20 py-10" style={{ backgroundColor: '#F7F5EE' }}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl" style={{ fontWeight: 600, color: '#1A1A1A' }}>
          Popular Courses
        </h2>
        <button 
          className="text-sm flex items-center gap-2"
          style={{ fontWeight: 500, color: '#FF8000' }}
        >
          View All Courses
          <span>→</span>
        </button>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl overflow-hidden"
            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
          >
            {/* Course Image */}
            <div className="relative h-36 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {course.badge && (
                  <span 
                    className="text-xs px-2 py-1 rounded text-white"
                    style={{ 
                      fontWeight: 600,
                      backgroundColor: course.badgeColor
                    }}
                  >
                    {course.badge}
                  </span>
                )}
              </div>
              
              <div className="absolute top-3 right-3">
                <span 
                  className="text-xs px-2 py-1 rounded text-white"
                  style={{ 
                    fontWeight: 600,
                    backgroundColor: course.tagColor
                  }}
                >
                  {course.tag}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-4">
              <h3 
                className="text-base mb-2"
                style={{ fontWeight: 600, color: '#1A1A1A' }}
              >
                {course.title}
              </h3>
              <p 
                className="text-sm mb-4"
                style={{ color: '#666', lineHeight: 1.5 }}
              >
                {course.description}
              </p>

              {/* Course Meta */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#F0F0F0' }}>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#FF8000' }}>
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons} Lessons</span>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ 
                  color: course.level === 'Beginner' ? '#10B981' : 
                         course.level === 'Intermediate' ? '#F59E0B' : '#8B5CF6'
                }}>
                  <BarChart3 className="w-4 h-4" />
                  <span>{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
