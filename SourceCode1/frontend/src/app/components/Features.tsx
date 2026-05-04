import { CheckCircle, Users, Award } from 'lucide-react';

export function Features() {
  return (
    <section className="px-20 py-8" style={{ backgroundColor: '#F7F5EE' }}>
      <div className="flex items-center justify-start gap-12">
        {/* Feature 1 */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: '#FFF5EB' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#FF8000' }} />
          </div>
          <span className="text-sm" style={{ fontWeight: 500, color: '#333' }}>
            Authentic Content
          </span>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: '#FFF5EB' }}>
            <Users className="w-5 h-5" style={{ color: '#FF8000' }} />
          </div>
          <span className="text-sm" style={{ fontWeight: 500, color: '#333' }}>
            Expert Guidance
          </span>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: '#FFF5EB' }}>
            <Award className="w-5 h-5" style={{ color: '#FF8000' }} />
          </div>
          <span className="text-sm" style={{ fontWeight: 500, color: '#333' }}>
            Certified Learning
          </span>
        </div>
      </div>
    </section>
  );
}
