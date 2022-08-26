import { getAllNeighours, getNeighborhood, getNeighbour } from './apiService';

class Neighborhood {
  async getNeighborhoodsFromNeighbour(neighbour) {
    if (!neighbour) return [];

    const response = await getNeighbour(neighbour);

    if (!response.data.neighborhoods) return [];

    const neighborhoods = await Promise.all(
      response.data.neighborhoods.map(async (neighborhood) => {
        const resp = await getNeighborhood(neighborhood);
        if (resp.status === 200) return resp.data;
        return null;
      })
    );

    return neighborhoods.filter((neighborhood) => neighborhood);
  }

  async userIsMyNeighbour(neighbour) {
    try {
      if (!neighbour) return false;

      const response = await getAllNeighours(neighbour);
      if (!response.data || response.data.length === 0) return false;

      return response.data.includes(neighbour);
    } catch (err) {
      return false;
    }
  }
}

export default new Neighborhood();
