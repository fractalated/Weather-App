# WX

A lightweight, dark-themed weather dashboard built for the iPhone home screen.

**[▶ Open WX](https://fractalated.github.io/Weather-App/)**

On iPhone, open the link in Safari and choose **Share → Add to Home Screen** to install it as an app.

## Views

- **Radar:** the NWS MRMS multi-radar mosaic (CONUS, Alaska, Hawaii, Caribbean and Guam), not a single radar site. It shows a 1-hour loop built from the scan times NWS has actually published.
- **Forecast:** HRRR simulated reflectivity out to 18 hours, from the Iowa Environmental Mesonet. The run time comes from IEM, and the ★ frame is the current hour.
- **AFD:** the latest Area Forecast Discussion from your local NWS office.

The app refreshes every 5 minutes while it's on screen, and again when you come back to it. The app shell is cached, so it still opens without a connection.

## Data sources

| Data | Source |
| --- | --- |
| Radar mosaic | [NOAA/NCEP opengeo WMS](https://opengeo.ncep.noaa.gov/geoserver/) (`*_bref_qcd`) |
| HRRR forecast | [IEM HRRR WMS](https://mesonet.agron.iastate.edu/ogc/) |
| Forecast discussion | [api.weather.gov](https://www.weather.gov/documentation/services-web-api) |
| City name | [Nominatim / OpenStreetMap](https://nominatim.org/) |
| Base map | [Esri Dark Gray Canvas](https://www.arcgis.com/home/item.html?id=358ec1e175ea41c3bf5c68f0da11ae2b) |

## Development

Everything lives in `index.html`, with no build step. To run it locally, serve the folder with any static server:

```bash
python3 -m http.server 8000
```

The service worker registers only over HTTPS, so local testing isn't affected by caching.
