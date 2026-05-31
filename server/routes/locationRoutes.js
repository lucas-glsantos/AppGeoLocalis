import express from "express";

const locationRouter = express.Router();

locationRouter.get("/my-ip", async (req, res) => {
    try {
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
                        || req.headers['x-real-ip'] 
                        || req.ip;

        async function tryApi(url) {
            try {
                const response = await fetch (url, { signal: AbortSignal.timeout(500) });
                return await response.json();
            } catch {
                return null;
            }
        }

        let data;

        // 1. Tentativa: ipapi.co com o IP do cliente
        data = await tryApi(`https://ipapi.co/${clientIp}/json/`);
        if (data && !data.error) {
            return res.status(200).json({ 
                success: true, ...data 
            });
        }            
            
        // 2. Tentativa: ip-api.com com o IP do cliente
        data = await tryApi(`http://ip-api.com/json/${clientIp}?fields=city,region,country,lat,lon`);
        if (data && data.status === "success") {
            return res.status(200).json({ 
                success: true, city: data.city, region: data.region,
                country: data.country, latitude: data.lat, longitude: data.lon
            });
        }

        // 3. Fallback: ipapi.co sem IP (usa IP do servidor/localhost)
        data = await tryApi("https://ipapi.co/json/");
        if (data && !data.error) {
            return res.status(200).json({ 
                success: true, ...data 
            });
        }

        // 4. Fallback: ip-api.com sem IP
        data = await tryApi("http://ip-api.com/json/?fields=city,region,country,lat,lon");  
        if (data && data.status === "success") {
            return res.status(200).json({ 
                success: true, city: data.city, region: data.region, 
                country: data.country, latitude: data.lat, longitude: data.lon 
            });
        }
        res.status(400).json({ success: false, message: "API de localização indisponível" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default locationRouter;

