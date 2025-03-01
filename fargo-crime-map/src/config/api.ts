export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
    DISPATCH: `${API_BASE_URL}/api/dispatch`,
    MAP_TILES: `${API_BASE_URL}/maptiles/tile`,
};
