import { createSocialImage } from './_lib/social-image';

export const runtime = 'nodejs';

export function GET(request: Request) {
  return createSocialImage(request, 'og');
}
