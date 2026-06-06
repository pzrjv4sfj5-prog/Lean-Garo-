import DICT_RAW from '../master_dictionary.json' with { type: 'json' };
import compiledDict from './compiled_dict.json' with { type: 'json' };

export const phraseMaps = DICT_RAW.map((entry) => ({
  english: String(entry.english || '').trim(),
  garo: String(entry.garo || '').trim(),
  category: String(entry.category || 'general').trim(),
}));

export { compiledDict };

export default phraseMaps;
