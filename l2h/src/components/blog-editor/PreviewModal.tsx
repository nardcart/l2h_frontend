import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, User, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
}

export default function PreviewModal({
  open,
  onClose,
  title,
  content,
  coverImage,
  category,
  tags = [],
  excerpt,
}: PreviewModalProps) {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin User' };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 bg-white/90 hover:bg-white rounded-full shadow-lg"
        >
          <X className="w-4 h-4" />
        </Button>

        <article className="bg-white">
          {/* Cover Image */}
          {coverImage && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-12">
            {/* Category & Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              {category && (
                <Badge variant="secondary" className="text-sm">
                  {category}
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <span>By {user.name}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              {title || 'Untitled Post'}
            </h1>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {excerpt}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ 
                __html: content || '<p class="text-gray-500 italic">No content yet... Start writing to see your post preview.</p>' 
              }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Section (Optional) */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    About {user.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Content creator and writer passionate about sharing knowledge and insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                📝 <strong>Preview Mode</strong> - This is how your post will appear when published
              </p>
            </div>
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
}



