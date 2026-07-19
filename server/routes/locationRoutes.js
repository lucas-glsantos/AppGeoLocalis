import express from "express";

const locationRouter = express.Router();

locationRouter.get("/my-ip", async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
            || req.headers['x-real-ip'] 
            || req.ip;

        // Pular IPs privados
        const isPrivateIp = !clientIp
            || clientIp === '::1'
            || clientIp === '127.0.0.1'
            || clientIp === '::ffff:127.0.0.1'
            || clientIp.startsWith('10.')
            || clientIp.startsWith('192.168.')
            || /^172\.(1[6-9]|2\d|3[01])\./.test(clientIp);

        async function tryApi(url) {
            try {
                const response = await fetch (url, { 
                    signal: AbortSignal.timeout(8000),
                    headers: { "User-Agent": "GeoLocalisApp/1.0" }
                });
                return await response.json();
            } catch {
                return null;
            }
        }

        let data;

        // 1. Tentativa ipapi.co com o IP do cliente
        data = await tryApi(`https://ipapi.co/${clientIp}/json/`);
        if (data && !data.error && data.status === "success") {
            return res.status(200).json({ 
                success: true, city: data.city, region: data.region, 
                country: data.country, latitude: data.lat, longitude: data.lon 
            });
        }            
            
        // 2. Tentativa: ip-api.com com o IP do cliente
        data = await tryApi(`https://ip-api.com/json/${clientIp}?fields=city,region,country,lat,lon`);
        if (data && !data.error && data.status === "success") {
            return res.status(200).json({ 
                success: true, city: data.city, region: data.region, 
                country: data.country, latitude: data.lat, longitude: data.lon 
            });
        }

        // 3. Fallback ipapi.co
        data = await tryApi("https://ipapi.co/json/");
        if (data && !data.error && data.status === "success") {
            return res.status(200).json({ 
                success: true, city: data.city, region: data.region, 
                country: data.country, latitude: data.lat, longitude: data.lon 
            });
        }

        // 4. Fallback: ip-api.com
        data = await tryApi("https://ip-api.com/json/?fields=city,region,country,lat,lon");  
        if (data && !data.error && data.status === "success") {
            return res.status(200).json({ 
                success: true, city: data.city, region: data.region, 
                country: data.country, latitude: data.lat, longitude: data.lon 
            });
        }

        // 5. Tentativa: ipinfo,io
        data = await tryApi("https://ipinfo.io/json")
        if (data && !data.error && data.loc) {
            const [lat, lon] = data.loc.split(",");
            return res.status(200).json({
                success: true, city: data.city, region: data.region,
                country: data.country, latitude: parseFloat(lat), longitude: parseFloat(lon)
            });
        }

        // Fallback padrão: coordenadas do centro do brasil
        res.status(200).json({ 
            success: true, latitude: -14.2350, longitude: -51.9253, 
            city: "Brasil", region: "", isApproximate: true 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default locationRouter;

