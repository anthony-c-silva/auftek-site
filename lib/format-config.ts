export type PostFormat = 'feed' | 'stories';

export interface FormatConfig {
  aspectRatio: string;
  label: string;
  cssAspect: string;
  cropAspect: number;
  formatDescription: string;
  promptAspectNote: string;
}

export const FORMAT_CONFIG: Record<PostFormat, FormatConfig> = {
  feed: {
    aspectRatio: '4:5',
    label: 'Feed (4:5)',
    cssAspect: '4/5',
    cropAspect: 4 / 5,
    formatDescription: 'formato retrato 4:5 (ideal para feed de Instagram)',
    promptAspectNote: 'A imagem DEVE ter proporção 4:5 (retrato vertical para Instagram).',
  },
  stories: {
    aspectRatio: '9:16',
    label: 'Stories (9:16)',
    cssAspect: '9/16',
    cropAspect: 9 / 16,
    formatDescription: 'formato vertical 9:16 (ideal para Stories do Instagram)',
    promptAspectNote: 'A imagem DEVE ter proporção 9:16 (vertical para Stories do Instagram).',
  },
};

export const ALLOWED_ASPECT_RATIOS = Object.values(FORMAT_CONFIG).map(c => c.aspectRatio);

export function getFormatByAspectRatio(aspectRatio: string): PostFormat {
  for (const [format, config] of Object.entries(FORMAT_CONFIG)) {
    if (config.aspectRatio === aspectRatio) return format as PostFormat;
  }
  return 'feed';
}
