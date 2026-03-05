import heartImg1 from 'figma:asset/c52dca24cbc45e4e86f93cfdbfa47f11e06a5bed.png';
import heartImg2 from 'figma:asset/ab60d90145417df872533ec4a1a41fef58f5e041.png';
import heartImg3 from 'figma:asset/a7dc2be9edda4d0a12361a472ad0073299561ca3.png';
import heartImg4 from 'figma:asset/91274c11ab1ac4fd2a6fb0cd5b80c8aacac19fd5.png';

interface FeatureCardProps {
  image: string;
  title: string;
  gradient: string;
}

function FeatureCard({ image, title, gradient }: FeatureCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-xl hover:scale-105 transition-transform duration-300`}>
      <div className="relative z-10">
        <img src={image} alt={title} className="w-full h-32 object-cover rounded-lg mb-3 shadow-lg" />
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
          <p className="text-white text-sm text-center drop-shadow-lg">{title}</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
    </div>
  );
}

export function HeroSection() {
  const features = [
    {
      image: 'https://images.unsplash.com/photo-1758874089799-2ab9dafc10ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwcHJlc2VudCUyMGNlbGVicmF0aW9uJTIwbG92ZXxlbnwxfHx8fDE3NzE1MTIzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Let your gift speak the language of love.',
      gradient: 'bg-gradient-to-br from-pink-500/80 to-purple-600/80'
    },
    {
      image: 'https://images.unsplash.com/photo-1701611199863-428eeb566b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBkZWxpdmVyeSUyMGdyb2Nlcmllc3xlbnwxfHx8fDE3NzE1MTIzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Get the Fresh foods to your doorstep',
      gradient: 'bg-gradient-to-br from-green-500/80 to-emerald-600/80'
    },
    {
      image: 'https://images.unsplash.com/photo-1758270705657-f28eec1a5694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMGhhcHB5JTIwY2FtcHVzfGVufDF8fHx8MTc3MTUxMjMwMHww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Safe living. Smart Studying. Happy Uni LIFE.',
      gradient: 'bg-gradient-to-br from-blue-500/80 to-cyan-600/80'
    },
    {
      image: 'https://images.unsplash.com/photo-1514178494750-80c2ed3def1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcGFydCUyMHRpbWUlMjBqb2IlMjB3b3JraW5nfGVufDF8fHx8MTc3MTUxMjMwMXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Flexible part-time jobs opportunities',
      gradient: 'bg-gradient-to-br from-orange-500/80 to-red-600/80'
    }
  ];

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-12 overflow-hidden">
      {/* Floating text decorations */}
      <div className="absolute top-10 left-10 opacity-20 animate-float">
        <img src={heartImg1} alt="" className="w-64 drop-shadow-2xl" />
      </div>
      <div className="absolute top-20 right-10 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <img src={heartImg2} alt="" className="w-64 drop-shadow-2xl" />
      </div>
      <div className="absolute bottom-32 left-16 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <img src={heartImg3} alt="" className="w-64 drop-shadow-2xl" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
        <img src={heartImg4} alt="" className="w-64 drop-shadow-2xl" />
      </div>

      {/* Logo and Main Content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Large 3D Logo */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            {/* Logo shadow layers for 3D effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 blur-2xl opacity-50 scale-110"></div>
            <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-16 shadow-2xl border-4 border-black/20">
              {/* Graduation cap icon */}
              <div className="relative">
                <div className="w-48 h-48 relative">
                  {/* Cap square */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-black transform rotate-12 shadow-2xl rounded-lg">
                    <div className="absolute inset-2 border-4 border-yellow-400/50"></div>
                  </div>
                  {/* Cap base */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-24 bg-gradient-to-b from-black to-gray-900 rounded-t-full shadow-2xl"></div>
                  {/* Tassel */}
                  <div className="absolute top-12 right-8 w-2 h-20 bg-yellow-400 shadow-lg"></div>
                  <div className="absolute top-32 right-6 w-6 h-6 bg-yellow-400 rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-white/90 text-sm">Official Campus Partner</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl text-white text-center mb-8 drop-shadow-2xl">
          University Life,<br />
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Connected.
          </span>
        </h1>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
