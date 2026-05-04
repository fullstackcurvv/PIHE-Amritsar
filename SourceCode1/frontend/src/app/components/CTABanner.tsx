export function CTABanner() {
  return (
    <section 
      className="px-20 py-16 relative overflow-hidden"
      style={{ backgroundColor: '#FF8000' }}
    >
      {/* Decorative Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative flex flex-col items-center text-center gap-6">
        {/* Heading */}
        <h2 className="text-4xl text-white" style={{ fontWeight: 600 }}>
          Begin your spiritual journey today
        </h2>

        {/* Subheading */}
        <p className="text-lg text-white opacity-90">
          Join thousands of learners in exploring the wisdom of Vedic knowledge.
        </p>

        {/* CTA Button */}
        <button 
          className="px-8 py-3 rounded-lg text-sm flex items-center gap-2 mt-2"
          style={{ 
            fontWeight: 500,
            backgroundColor: 'white',
            color: '#FF8000'
          }}
        >
          Get Started Now
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
