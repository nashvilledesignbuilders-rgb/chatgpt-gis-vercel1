export default async function handler(req, res) {
  const { apn } = req.query;

  if (!apn) {
    return res.status(400).json({ error: "Missing required query parameter: apn" });
  }

  try {
    const url = new URL(
      "https://maps.nashville.gov/arcgis/rest/services/ParcelViewer/MapServer/0/query"
    );

    url.search = new URLSearchParams({
      where: `PIN='${apn}'`,
      outFields: "*",
      f: "json"
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`ArcGIS request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return res.status(404).json({ error: `Parcel with APN ${apn} not found.` });
    }

    const attrs = data.features[0].attributes;

    const parcel = {
      apn: attrs.PIN || apn,
      owner: attrs.OWNER || null,
      address: attrs.SITUSADDRESS || null,
      acreage: attrs.ACREAGE ?? null,
      land_use: attrs.LU || attrs.LANDUSE || null,
      zoning: attrs.ZONING || null,
      mailing_address: attrs.MAILADDR1 || null,
      city: attrs.CITY || null,
      zip: attrs.ZIPCODE || null
    };

    return res.status(200).json(parcel);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
