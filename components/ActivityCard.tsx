import Image from 'next/image';
import { Calendar, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Activity } from '@/types';

export default function ActivityCard({ activity }: { activity: Activity }) {
  const coverPhoto = activity.photos?.[0]?.image_url;
  const photoCount = activity.photos?.length ?? 0;

  return (
    <div className="card group">
      {/* Cover Image */}
      <div className="relative h-52 bg-gradient-to-br from-nss-green/20 to-nss-blue/20 overflow-hidden">
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={activity.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageIcon size={36} />
            <span className="text-sm">No photo</span>
          </div>
        )}
        {photoCount > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ImageIcon size={11} />
            {photoCount} photos
          </div>
        )}
        {/* Date badge */}
        <div className="absolute bottom-3 left-3 bg-nss-green text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow">
          <Calendar size={12} />
          {format(new Date(activity.date), 'dd MMM yyyy')}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-gray-800 text-lg leading-snug mb-2 group-hover:text-nss-green transition-colors">
          {activity.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {activity.description}
        </p>

        {/* Photo thumbnails */}
        {activity.photos && activity.photos.length > 1 && (
          <div className="flex gap-1.5 mt-4 overflow-hidden">
            {activity.photos.slice(0, 4).map((photo, i) => (
              <div
                key={photo.id}
                className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0"
              >
                <Image src={photo.image_url} alt="" fill className="object-cover" />
                {i === 3 && activity.photos!.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                    +{activity.photos!.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
