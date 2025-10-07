import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText } from 'lucide-react';
import type { Ebook } from '@/types/ebook';
import { API_BASE_URL } from '@/config/api';

interface EbookCardProps {
  ebook: Ebook;
  onDownloadClick: (ebook: Ebook) => void;
}

export default function EbookCard({ ebook, onDownloadClick }: EbookCardProps) {
  const apiBaseUrl = API_BASE_URL?.replace('/api', '') || API_BASE_URL;
  const imageUrl = ebook.image.startsWith('http')
    ? ebook.image
    : `${apiBaseUrl}/uploads/ebook/${ebook.image}`;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 group bg-white/90 backdrop-blur-sm">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={ebook.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        {ebook.featured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg">
            ⭐ Featured
          </Badge>
        )}
        {ebook.category && (
          <Badge className="absolute top-2 left-2 bg-purple-600 hover:bg-purple-700 text-white">
            {ebook.category}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem] text-gray-900">
          {ebook.name}
        </h3>

        {ebook.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {ebook.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
          {ebook.pageCount && (
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{ebook.pageCount} pages</span>
            </div>
          )}
          <div className="flex items-center gap-1" title="Downloads">
            <Download className="w-4 h-4" />
            <span>{ebook.downloadCount || 0}</span>
          </div>
          <div className="flex items-center gap-1" title="Views">
            <Eye className="w-4 h-4" />
            <span>{ebook.viewCount || 0}</span>
          </div>
        </div>

        {/* Author and Language */}
        {(ebook.author || ebook.language) && (
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            {ebook.author && (
              <div>
                <span className="font-semibold">Author:</span> {ebook.author}
              </div>
            )}
            {ebook.language && (
              <div>
                <span className="font-semibold">Language:</span> {ebook.language}
              </div>
            )}
          </div>
        )}

        {/* Download Button */}
        <Button
          onClick={() => onDownloadClick(ebook)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 text-base shadow-lg"
        >
          📥 Download Now
        </Button>
      </CardContent>
    </Card>
  );
}


