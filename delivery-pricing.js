// Delivery Pricing Data for Algerian Wilayas
const deliveryPricing = {
    "stop_desk_tariffs": [
        {"wilaya_number": 1, "wilaya_name": "Adrar", "tarif": 700},
        {"wilaya_number": 2, "wilaya_name": "Chlef", "tarif": 500},
        {"wilaya_number": 3, "wilaya_name": "Laghouat", "tarif": 500},
        {"wilaya_number": 4, "wilaya_name": "Oum El Bouaghi Ain fekroun", "tarif": 500},
        {"wilaya_number": 5, "wilaya_name": "Batna", "tarif": 500},
        {"wilaya_number": 6, "wilaya_name": "Béjaia", "tarif": 500},
        {"wilaya_number": 7, "wilaya_name": "Biskra", "tarif": 500},
        {"wilaya_number": 8, "wilaya_name": "Béchar", "tarif": 500},
        {"wilaya_number": 9, "wilaya_name": "Blida - boufarik", "tarif": 500},
        {"wilaya_number": 10, "wilaya_name": "Bouira", "tarif": 500},
        {"wilaya_number": 11, "wilaya_name": "Tamarrasset", "tarif": 1000},
        {"wilaya_number": 12, "wilaya_name": "Tébessa", "tarif": 500},
        {"wilaya_number": 13, "wilaya_name": "Tlemcen", "tarif": 500},
        {"wilaya_number": 14, "wilaya_name": "Tiaret", "tarif": 500},
        {"wilaya_number": 15, "wilaya_name": "Tizi Ouzou", "tarif": 500},
        {"wilaya_number": 16, "wilaya_name": "Alger (Oued Smar, Kouba, etc.)", "tarif": 500},
        {"wilaya_number": 17, "wilaya_name": "Djelfa / Ain Ouessara", "tarif": 500},
        {"wilaya_number": 18, "wilaya_name": "Jijel", "tarif": 500},
        {"wilaya_number": 19, "wilaya_name": "Sétif / Hidhab / EL EULMA", "tarif": 500},
        {"wilaya_number": 20, "wilaya_name": "Saïda", "tarif": 500},
        {"wilaya_number": 21, "wilaya_name": "Skikda", "tarif": 500},
        {"wilaya_number": 22, "wilaya_name": "Sidi Bel Abbès", "tarif": 500},
        {"wilaya_number": 23, "wilaya_name": "Annaba", "tarif": 500},
        {"wilaya_number": 24, "wilaya_name": "Guelma", "tarif": 500},
        {"wilaya_number": 25, "wilaya_name": "Constantine (N-ville, Sidi Mebrouk)", "tarif": 500},
        {"wilaya_number": 26, "wilaya_name": "Médéa", "tarif": 500},
        {"wilaya_number": 27, "wilaya_name": "Mostaganem", "tarif": 500},
        {"wilaya_number": 28, "wilaya_name": "MSila", "tarif": 500},
        {"wilaya_number": 29, "wilaya_name": "Mascara (SIG & centre)", "tarif": 500},
        {"wilaya_number": 30, "wilaya_name": "Ouargla", "tarif": 500},
        {"wilaya_number": 31, "wilaya_name": "Oran / Bir el djir", "tarif": 500},
        {"wilaya_number": 32, "wilaya_name": "El Bayadh", "tarif": 500},
        {"wilaya_number": 33, "wilaya_name": "Illizi", "tarif": 1000},
        {"wilaya_number": 34, "wilaya_name": "Bordj Bou Arreridj", "tarif": 500},
        {"wilaya_number": 35, "wilaya_name": "Boumerdès / Bordj menaiel", "tarif": 500},
        {"wilaya_number": 36, "wilaya_name": "El Tarf", "tarif": 500},
        {"wilaya_number": 37, "wilaya_name": "Tindouf", "tarif": 1000},
        {"wilaya_number": 38, "wilaya_name": "Tissemsilt", "tarif": 500},
        {"wilaya_number": 39, "wilaya_name": "El Oued", "tarif": 500},
        {"wilaya_number": 40, "wilaya_name": "Khenchela", "tarif": 500},
        {"wilaya_number": 41, "wilaya_name": "Souk Ahras", "tarif": 500},
        {"wilaya_number": 42, "wilaya_name": "Tipaza / Hadjout", "tarif": 500},
        {"wilaya_number": 43, "wilaya_name": "Mila", "tarif": 500},
        {"wilaya_number": 44, "wilaya_name": "Aïn Defla", "tarif": 500},
        {"wilaya_number": 45, "wilaya_name": "Naâma", "tarif": 500},
        {"wilaya_number": 46, "wilaya_name": "Aïn Témouchent / Beni Saf", "tarif": 500},
        {"wilaya_number": 47, "wilaya_name": "Ghardaïa", "tarif": 500},
        {"wilaya_number": 48, "wilaya_name": "Relizane", "tarif": 500},
        {"wilaya_number": 49, "wilaya_name": "Timimoun", "tarif": "غير متوفر"},
        {"wilaya_number": 50, "wilaya_name": "Bordj Badji Mokhtar", "tarif": "غير متوفر"},
        {"wilaya_number": 51, "wilaya_name": "Ouled Djellal", "tarif": 500},
        {"wilaya_number": 52, "wilaya_name": "Beni Abbes", "tarif": "غير متوفر"},
        {"wilaya_number": 53, "wilaya_name": "In Salah", "tarif": 800},
        {"wilaya_number": 54, "wilaya_name": "In Guezzam", "tarif": "غير متوفر"},
        {"wilaya_number": 55, "wilaya_name": "Touggourt", "tarif": 500},
        {"wilaya_number": 56, "wilaya_name": "Djanet", "tarif": 1000},
        {"wilaya_number": 57, "wilaya_name": "El M'Ghair", "tarif": "غير متوفر"},
        {"wilaya_number": 58, "wilaya_name": "El Meniaa", "tarif": "غير متوفر"}
    ],
    "metadata": {
        "pricing_rules": {
            "standard_rate": 500,
            "premium_rates": [700, 800, 1000],
            "not_available": "غير متوفر"
        },
        "counts": {
            "total_wilayas": 58,
            "standard_rate": 46,
            "premium_rate": 7,
            "not_available": 5
        }
    }
};

// Function to get delivery price for a wilaya
function getDeliveryPrice(wilayaName) {
    const wilaya = deliveryPricing.stop_desk_tariffs.find(w => 
        w.wilaya_name.toLowerCase().includes(wilayaName.toLowerCase()) ||
        wilayaName.toLowerCase().includes(w.wilaya_name.toLowerCase())
    );
    
    if (wilaya) {
        return {
            price: wilaya.tarif,
            isAvailable: wilaya.tarif !== "غير متوفر",
            wilayaName: wilaya.wilaya_name
        };
    }
    
    return {
        price: null,
        isAvailable: false,
        wilayaName: null
    };
}

// Function to format price display
function formatDeliveryPrice(price) {
    if (price === "غير متوفر") {
        return "غير متوفر";
    }
    return `${price} دج`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { deliveryPricing, getDeliveryPrice, formatDeliveryPrice };
}
