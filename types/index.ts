export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  activity_id: string;
  image_url: string;
}
