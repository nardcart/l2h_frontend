import type { Ebook } from '@/types/ebook';
import EbookCard from './EbookCard';

interface EbookGridProps {
  ebooks: Ebook[];
  onDownloadClick: (ebook: Ebook) => void;
}

export default function EbookGrid({ ebooks, onDownloadClick }: EbookGridProps) {
  if (ebooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Ebooks Found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ebooks.map((ebook) => (
        <EbookCard key={ebook._id} ebook={ebook} onDownloadClick={onDownloadClick} />
      ))}
    </div>
  );
}


