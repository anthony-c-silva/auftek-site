import React, { useEffect } from 'react';
import { Author } from '../../../../blog-v1/types.ts';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  author?: Author;
  publishDate?: string;
  keywords?: string[];
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://picsum.photos/seed/auftek-share/1200/630', 
  type = 'website',
  author,
  publishDate,
  keywords = [],
  url = window.location.href
}) => {

  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords.join(', '));
    
    // Open Graph
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:url', url, 'property');

    // Twitter
    updateMeta('twitter:title', title, 'property');
    updateMeta('twitter:description', description, 'property');
    updateMeta('twitter:image', image, 'property');

    // Clean up function (optional, resetting to default if needed when unmounting)
    return () => {
      // Could reset to default app title here if necessary
    };
  }, [title, description, image, type, keywords, url]);

  // Structured Data (JSON-LD)
  let structuredData = null;

  if (type === 'article' && author && publishDate) {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "image": [image],
      "datePublished": publishDate, // Needs ISO format ideally, but passing string for now
      "dateModified": publishDate,
      "author": [{
          "@type": "Person",
          "name": author.name,
          "jobTitle": author.role
      }],
      "publisher": {
        "@type": "Organization",
        "name": "Auftek",
        "logo": {
          "@type": "ImageObject",
          "url": "https://via.placeholder.com/112x112?text=Logo" // Placeholder logo
        }
      },
      "description": description
    };
  } else {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Auftek Blog",
      "url": "https://auftek-blog.com.br/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://auftek-blog.com.br/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  }

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default SEO;