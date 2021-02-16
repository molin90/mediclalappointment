import { howAppIsRunning } from '../../src/utils/commonUtils';
import { DEV, BASE_WEBSITE_URL } from './constants';

export let baseApiUrl = howAppIsRunning() === DEV ? 'http://127.0.0.1/apprenilla/public/api/' : `//${BASE_WEBSITE_URL}/api/`;

export const API = {
  SEO: {
    GET: `${baseApiUrl}seo/getSeo.php`,
  },
}
