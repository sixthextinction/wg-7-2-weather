import { createOperation, z } from '../../generated/wundergraph.factory';

export default createOperation.query({
	input: z.object({
		city: z.string(),
	}),
	handler: async ({ input }) => {

        //step 1 : get lat/long by city name
        // const geoData = await fetch(`http://www.geoplugin.net/extras/forward_place.gp?format=json&place=${input.city}&country=US`)
        const geoData = await fetch(`https://nominatim.openstreetmap.org/search/${input.city}?format=json&limit=1`)
        const geoResult = await geoData.json()

        // step 2: get station by lat/long
        const stationData = await fetch(`https://api.weather.gov/points/${geoResult[0].lat},${geoResult[0].lon}`)
        const stationResult = await stationData.json()

        // step 3: get weather by station
        const weatherData = await fetch(`https://api.weather.gov/gridpoints/${stationResult.properties.gridId}/${stationResult.properties.gridX},${stationResult.properties.gridY}/forecast`)
        const weatherResult = await weatherData.json();

		return {
			city: input.city,
			lat: geoResult[0]?.lat,
            long: geoResult[0]?.lon,
            gridId: stationResult?.properties.gridId,
            gridX: stationResult?.properties.gridX,
            gridY: stationResult?.properties.gridY,
            weather: {
                temperature: weatherResult?.properties.periods[0].temperature,
                temperatureUnit: weatherResult?.properties.periods[0].temperatureUnit,
                windSpeed: weatherResult?.properties.periods[0].windSpeed,
                windDirection: weatherResult?.properties.periods[0].windDirection,
                icon: weatherResult?.properties.periods[0].icon,
                forecast: weatherResult?.properties.periods[0].detailedForecast
            }

		};
	},
});
