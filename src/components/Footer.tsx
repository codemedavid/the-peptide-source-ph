import React from 'react';
import { MessageCircle, Shield, Heart, Crown } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Viber contact number in +63 format
  const viberNumber = '+639953928293';
  // Viber deep link requires number without + sign
  const viberNumberForLink = viberNumber.replace('+', '');
  // Use chat format to open chat directly
  const viberUrl = `viber://chat?number=${viberNumberForLink}`;

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {/* Compact Footer Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 max-w-5xl mx-auto">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="The Peptide Source PH" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg object-cover border-2 border-white/20"
            />
            <div className="text-center md:text-left">
              <div className="text-white font-bold text-sm md:text-base flex items-center gap-1.5">
                The Peptide Source PH
                <Crown className="w-3 h-3 md:w-4 md:h-4 text-pink-400" />
              </div>
              <div className="text-[10px] md:text-xs text-gray-300">Premium Research Peptides</div>
            </div>
          </div>

          {/* Viber Button */}
          <a
            href={viberUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl transition-all font-medium text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
            Chat on Viber
          </a>

        </div>
      </div>

      {/* Compact Footer Bottom */}
      <div className="bg-black/30 py-3 md:py-4 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-1">
            <p className="text-[10px] md:text-xs text-gray-300 flex items-center justify-center gap-1.5 flex-wrap">
              Made with 
              <Heart className="w-3 h-3 text-pink-400 animate-pulse" />
              © {currentYear} The Peptide Source PH. All rights reserved.
            </p>
            <p className="text-[9px] md:text-[10px] text-gray-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-blue-400" />
              All products are for research purposes only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
