import { createSocialImage, edgeConfig } from './_lib/social-image.jsx';

export const config = edgeConfig;

export default function handler(request) {
  return createSocialImage(request, 'og');
}
