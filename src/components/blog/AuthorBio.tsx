import React from 'react';
import { Author } from '../../types/blog';
import {FileText, Linkedin} from "lucide-react";

interface AuthorBioProps {
  author: Author;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ author }) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 mt-12 mb-8">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <img 
            src={author.avatarUrl} 
            alt={author.name} 
            className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div>
               <h4 className="text-xl font-bold text-slate-900">{author.name}</h4>
               <p className="text-sm font-medium text-auftek-600">{author.role}</p>
            </div>
            <div className="flex gap-3 mt-2 sm:mt-0">
               <a href="#" className="p-2 bg-white text-slate-500 rounded-full hover:text-auftek-600 hover:shadow-sm transition-all" title="LinkedIn">
                 <Linkedin size={18} />
               </a>
               <a href="#" className="p-2 bg-white text-slate-500 rounded-full hover:text-auftek-600 hover:shadow-sm transition-all" title="Outros Artigos">
                 <FileText size={18} />
               </a>
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            {author.bio}
          </p>
          
          <div className="mt-4">
             <a href="#" className="text-sm font-semibold text-auftek-600 hover:text-auftek-800 hover:underline inline-flex items-center gap-1">
               Ver perfil completo
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;