import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import EbookGrid from '@/components/ebook/EbookGrid';
import DownloadModal from '@/components/ebook/DownloadModal';
import { ebookApi } from '@/api/ebookApi';
import type { Ebook } from '@/types/ebook';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Search, Loader2, BookOpen, Download, Mail, X } from 'lucide-react';

export default function Ebooks() {
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch all ebooks for fuzzy search
  const { data: ebooksData, isLoading, refetch } = useQuery({
    queryKey: ['ebooks'],
    queryFn: () => ebookApi.getEbooks({ page: 1, limit: 1000 }),
  });

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    if (!ebooksData?.data) return null;
    
    return new Fuse(ebooksData.data, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'author', weight: 1.5 },
        { name: 'tags', weight: 1.2 },
        { name: 'category', weight: 1 },
      ],
      threshold: 0.4, // Lower = more strict, Higher = more fuzzy
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [ebooksData?.data]);

  // Perform fuzzy search
  const searchResults = useMemo(() => {
    if (!ebooksData?.data) return [];
    
    if (!searchQuery.trim()) {
      return ebooksData.data;
    }

    if (!fuse) return ebooksData.data;

    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [ebooksData?.data, searchQuery, fuse]);

  // Paginate results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchResults.slice(startIndex, endIndex);
  }, [searchResults, currentPage]);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDownloadClick = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowDownloadModal(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-white py-8 relative overflow-hidden">
        <div className="relative h-[500px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center h-full w-full">
              {/* Left Content */}
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Free Ebooks
                </h1>
                
                {/* Feature List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">100+</span> Free ebooks to download
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">Instant</span> Download - No OTP required
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">Expert</span> Content & resources
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                    onClick={() => {
                      const ebookSection = document.querySelector('#ebooks-section');
                      ebookSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Browse Ebooks
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/collage.jpg" 
                    alt="Free Ebooks - Professional resources" 
                    className="w-[110%] h-[520px] object-cover image-edge-fade -ml-[5%] -mt-[10px]"
                  />
                  {/* Optimized gradient overlays for seamless blending with white background */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search with Fuzzy Search */}
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search ebooks by name, author, category, tags... (Fuzzy search enabled)"
                  className="pl-10 pr-10 py-6 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Search Info */}
            {searchQuery && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{searchResults.length}</span> results found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12" id="ebooks-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats & Pagination */}
          {!isLoading && searchResults.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {searchQuery ? 'Search Results' : 'Available Ebooks'}
                  </h2>
                  <p className="text-muted-foreground">
                    Showing {paginatedResults.length} of {searchResults.length} ebooks
                    {searchQuery && ' matching your search'}
                  </p>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ebook Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-muted-foreground text-lg">Loading ebooks...</p>
            </div>
          ) : paginatedResults.length > 0 ? (
            <EbookGrid
              ebooks={paginatedResults}
              onDownloadClick={handleDownloadClick}
            />
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No ebooks found</h3>
              <p className="text-muted-foreground mb-4">
                No results found for "{searchQuery}"
              </p>
              <Button onClick={clearSearch} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No ebooks available</h3>
              <p className="text-muted-foreground">Check back later for new content</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Download className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Notified of New Ebooks</h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter and be the first to know when we add new ebooks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="pl-10 py-3 text-gray-900"
              />
            </div>
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Download Modal - Simple, No OTP */}
      {selectedEbook && (
        <DownloadModal
          open={showDownloadModal}
          onClose={() => {
            setShowDownloadModal(false);
            // Refetch to update download counts
            refetch();
          }}
          ebook={selectedEbook}
        />
      )}

      <Footer />
    </div>
  );
}


