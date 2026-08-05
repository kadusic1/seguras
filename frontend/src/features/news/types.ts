export interface NewsImageData {
  id: number;
  url: string;
  display_order: number;
}

export interface NewsItemData {
  id: number;
  heading: string;
  text: string;
  created_at: string;
  time_ago: string;
  images: NewsImageData[];
}

export interface CreateNewsImageInput {
  image_key: string;
  display_order: number;
}

export interface CreateNewsInput {
  heading: string;
  text: string;
  images: CreateNewsImageInput[];
}
