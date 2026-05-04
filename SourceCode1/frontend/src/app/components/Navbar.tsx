import logo from '../../imports/logo.png';

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
      <div className="flex items-center justify-between px-20 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="ISKCON Logo" className="w-10 h-10 object-contain" />
          <span className="text-sm tracking-wide" style={{ fontWeight: 700, color: '#1A1A1A' }}>
            ISKCON COURSE PORTAL
          </span>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-8">
          <a href="#home" className="text-sm" style={{ fontWeight: 600, color: '#FF8000' }}>
            Home
          </a>
          <a href="#about" className="text-sm" style={{ fontWeight: 500, color: '#666' }}>
            About Us
          </a>
          <a href="#courses" className="text-sm" style={{ fontWeight: 500, color: '#666' }}>
            Courses
          </a>
          <a href="#how-it-works" className="text-sm" style={{ fontWeight: 500, color: '#666' }}>
            How It Works
          </a>
          <a href="#exam-guidelines" className="text-sm" style={{ fontWeight: 500, color: '#666' }}>
            Exam Guidelines
          </a>
          <a href="#contact" className="text-sm" style={{ fontWeight: 500, color: '#666' }}>
            Contact Us
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button 
            className="px-5 py-2 rounded-lg border text-sm"
            style={{ 
              fontWeight: 500,
              color: '#333',
              borderColor: '#E0E0E0',
              backgroundColor: 'white'
            }}
          >
            Login
          </button>
          <button 
            className="px-6 py-2 rounded-lg text-sm text-white"
            style={{ 
              fontWeight: 500,
              backgroundColor: '#FF8000'
            }}
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
