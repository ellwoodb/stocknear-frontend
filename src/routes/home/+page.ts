import { userRegion, getCache, setCache } from '$lib/store';
import defaultAvatar from '$lib/images/senator/default-avatar.png';
import { getPartyForPoliticians } from '$lib/utils';
import { redirect } from '@sveltejs/kit';


const usRegion = ['cle1','iad1','pdx1','sfo1'];

let apiURL;
let apiKey = import.meta.env.VITE_STOCKNEAR_API_KEY;



let images = {};
// Function to load images only when they are viewed
async function loadImages() {
  const imageFiles = import.meta.glob('$lib/images/senator/*.png');
  const imagesPromises = [];

  for (const [path, resolver] of Object?.entries(imageFiles)) {
    const imageNameMatch = path?.match(/\/([^/]+)\.png$/);
    if (imageNameMatch && imageNameMatch[1] !== 'default-avatar') {
      imagesPromises?.push(resolver()?.then(module => {
        images[imageNameMatch[1]] = module.default;
      }));
    }
  }

  await Promise?.all(imagesPromises);
}



userRegion.subscribe(value => {

  if (usRegion.includes(value)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
  }
});


export const load = async ({ parent}) => {

  const data = await parent();

  if (!data?.user) {
		redirect(303, '/');
	}


  const getDashboard = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'getDashboard');
    if (cachedData) {
      output = cachedData;
    } else {

      const response = await fetch(apiURL + '/dashboard-info', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", "X-API-KEY": apiKey
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'getDashboard'
      let congressFlow = output?.congressFlow;
      await loadImages();
      congressFlow?.forEach(item => {
        let representative = item?.representative || '';
    
        representative = representative?.replace('Jr', '')
            .replace(/Dr./g, '')
            .replace(/Dr_/g, '')
    
        const fullName = representative?.replace(/(\s(?:Dr\s)?\w(?:\.|(?=\s)))?\s/g, '_').trim();
        item.image = images[fullName] || defaultAvatar;
        item.representative = fullName?.replace(/_/g, ' ');
        });
    
        congressFlow = congressFlow?.map(item => {
            const party = getPartyForPoliticians(item?.representative);
            return {
                ...item,
                party: party
            };
      });

      output.congressFlow = congressFlow;

      setCache('', output, 'getDashboard');
    }
    return output;
  };

  // Make sure to return a promise
  return {
    getDashboard: await getDashboard(),
  };
};