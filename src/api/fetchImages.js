import axios from "axios";

const BASE_ULR = 'https://pixabay.com/api/';
const API_KEY = '29611226-20562b3ecebd93b134dc5359f';

export const ITEMS_PER_PAGE = 40; 
export async function fetchImages(q, page) {
    try {
        return await axios
            .get(BASE_ULR, {
                params: {
                    key: API_KEY,
                    q,
                    per_page: ITEMS_PER_PAGE,
                    page,
                    image_type: 'photo',
                    orientation: 'horizontal',
                    safesearch: true
                }
            });
    } catch (error) {
        console.log(error);
    }
    
}