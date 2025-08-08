// Delivery Pricing Data for Algerian Wilayas - Corrected with official numbering
const deliveryPricing = {
    "stop_desk_tariffs": [
        {"wilaya_number": 1, "wilaya_name": "Adrar", "tarif": 700},
        {"wilaya_number": 2, "wilaya_name": "Chlef", "tarif": 500},
        {"wilaya_number": 3, "wilaya_name": "Laghouat", "tarif": 500},
        {"wilaya_number": 4, "wilaya_name": "Oum El Bouaghi", "tarif": 500},
        {"wilaya_number": 5, "wilaya_name": "Batna", "tarif": 500},
        {"wilaya_number": 6, "wilaya_name": "Bejaia", "tarif": 500},
        {"wilaya_number": 7, "wilaya_name": "Biskra", "tarif": 500},
        {"wilaya_number": 8, "wilaya_name": "Bechar", "tarif": 500},
        {"wilaya_number": 9, "wilaya_name": "Blida", "tarif": 500},
        {"wilaya_number": 10, "wilaya_name": "Bouira", "tarif": 500},
        {"wilaya_number": 11, "wilaya_name": "Tamanrasset", "tarif": 1000},
        {"wilaya_number": 12, "wilaya_name": "Tebessa", "tarif": 500},
        {"wilaya_number": 13, "wilaya_name": "Tlemcen", "tarif": 500},
        {"wilaya_number": 14, "wilaya_name": "Tiaret", "tarif": 500},
        {"wilaya_number": 15, "wilaya_name": "Tissemsilt", "tarif": 500},
        {"wilaya_number": 16, "wilaya_name": "El Oued", "tarif": 500},
        {"wilaya_number": 17, "wilaya_name": "Khenchela", "tarif": 500},
        {"wilaya_number": 18, "wilaya_name": "Souk Ahras", "tarif": 500},
        {"wilaya_number": 19, "wilaya_name": "Tipaza", "tarif": 500},
        {"wilaya_number": 20, "wilaya_name": "Mila", "tarif": 500},
        {"wilaya_number": 21, "wilaya_name": "Ain Defla", "tarif": 500},
        {"wilaya_number": 22, "wilaya_name": "Naama", "tarif": 500},
        {"wilaya_number": 23, "wilaya_name": "Ain Temouchent", "tarif": 500},
        {"wilaya_number": 24, "wilaya_name": "Ghardaia", "tarif": 500},
        {"wilaya_number": 25, "wilaya_name": "Relizane", "tarif": 500},
        {"wilaya_number": 26, "wilaya_name": "El Tarf", "tarif": 500},
        {"wilaya_number": 27, "wilaya_name": "Tindouf", "tarif": 1000},
        {"wilaya_number": 28, "wilaya_name": "El M'Ghair", "tarif": "غير متوفر"},
        {"wilaya_number": 29, "wilaya_name": "El Meniaa", "tarif": "غير متوفر"},
        {"wilaya_number": 30, "wilaya_name": "Ouled Djellal", "tarif": 500},
        {"wilaya_number": 31, "wilaya_name": "Bordj Baji Mokhtar", "tarif": "غير متوفر"},
        {"wilaya_number": 32, "wilaya_name": "Béni Abbès", "tarif": "غير متوفر"},
        {"wilaya_number": 33, "wilaya_name": "Timimoun", "tarif": "غير متوفر"},
        {"wilaya_number": 34, "wilaya_name": "Touggourt", "tarif": 500},
        {"wilaya_number": 35, "wilaya_name": "Djanet", "tarif": 1000},
        {"wilaya_number": 36, "wilaya_name": "In Salah", "tarif": 800},
        {"wilaya_number": 37, "wilaya_name": "In Guezzam", "tarif": "غير متوفر"},
        {"wilaya_number": 38, "wilaya_name": "Alger", "tarif": 500},
        {"wilaya_number": 39, "wilaya_name": "Djelfa", "tarif": 500},
        {"wilaya_number": 40, "wilaya_name": "Jijel", "tarif": 500},
        {"wilaya_number": 41, "wilaya_name": "Setif", "tarif": 500},
        {"wilaya_number": 42, "wilaya_name": "Saida", "tarif": 500},
        {"wilaya_number": 43, "wilaya_name": "Skikda", "tarif": 500},
        {"wilaya_number": 44, "wilaya_name": "Annaba", "tarif": 500},
        {"wilaya_number": 45, "wilaya_name": "Guelma", "tarif": 500},
        {"wilaya_number": 46, "wilaya_name": "Constantine", "tarif": 500},
        {"wilaya_number": 47, "wilaya_name": "Medea", "tarif": 500},
        {"wilaya_number": 48, "wilaya_name": "Mostaganem", "tarif": 500},
        {"wilaya_number": 49, "wilaya_name": "Mascara", "tarif": 500},
        {"wilaya_number": 50, "wilaya_name": "Oran", "tarif": 500},
        {"wilaya_number": 51, "wilaya_name": "El Bayadh", "tarif": 500},
        {"wilaya_number": 52, "wilaya_name": "Illizi", "tarif": 1000},
        {"wilaya_number": 53, "wilaya_name": "Bordj Bou Arreridj", "tarif": 500},
        {"wilaya_number": 54, "wilaya_name": "Boumerdes", "tarif": 500},
        {"wilaya_number": 55, "wilaya_name": "El Taref", "tarif": 500},
        {"wilaya_number": 56, "wilaya_name": "Tindouf", "tarif": 1000},
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
            "standard_rate": 48,
            "premium_rate": 6,
            "not_available": 4
        }
    }
};

// Function to get delivery price for a wilaya
function getDeliveryPrice(wilayaName) {
    // Extract the wilaya name without the number prefix if it exists
    const cleanWilayaName = wilayaName.replace(/^\d+\s*-\s*/, '');
    
    // First try exact match
    let wilaya = deliveryPricing.stop_desk_tariffs.find(w => 
        w.wilaya_name.toLowerCase() === cleanWilayaName.toLowerCase()
    );
    
    // If no exact match, try partial matches
    if (!wilaya) {
        wilaya = deliveryPricing.stop_desk_tariffs.find(w => 
            w.wilaya_name.toLowerCase().includes(cleanWilayaName.toLowerCase()) ||
            cleanWilayaName.toLowerCase().includes(w.wilaya_name.toLowerCase()) ||
            // Also check if the original name matches
            w.wilaya_name.toLowerCase().includes(wilayaName.toLowerCase()) ||
            wilayaName.toLowerCase().includes(w.wilaya_name.toLowerCase())
        );
    }
    
    // If still no match, try matching by wilaya number
    if (!wilaya && /^\d+/.test(wilayaName)) {
        const wilayaNumber = parseInt(wilayaName.match(/^(\d+)/)[1]);
        wilaya = deliveryPricing.stop_desk_tariffs.find(w => w.wilaya_number === wilayaNumber);
    }
    
    if (wilaya) {
        return {
            price: wilaya.tarif,
            isAvailable: wilaya.tarif !== "غير متوفر",
            wilayaName: wilaya.wilaya_name
        };
    }
    
    // Debug logging
    console.log('🔍 Delivery pricing lookup failed for:', wilayaName);
    console.log('🔍 Clean name:', cleanWilayaName);
    console.log('🔍 Available wilayas:', deliveryPricing.stop_desk_tariffs.map(w => w.wilaya_name));
    
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

// Test function to verify all wilayas have delivery pricing
function testAllWilayaDeliveryPricing() {
    console.log('🧪 Testing delivery pricing for all wilayas...');
    
    const testWilayas = [
        '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
        '06 - Bejaia', '07 - Biskra', '08 - Bechar', '09 - Blida', '10 - Bouira',
        '11 - Tamanrasset', '12 - Tebessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tissemsilt',
        '16 - El Oued', '17 - Khenchela', '18 - Souk Ahras', '19 - Tipaza', '20 - Mila',
        '21 - Ain Defla', '22 - Naama', '23 - Ain Temouchent', '24 - Ghardaia', '25 - Relizane',
        '26 - El Tarf', '27 - Tindouf', '28 - El M\'Ghair', '29 - El Meniaa', '30 - Ouled Djellal',
        '31 - Bordj Baji Mokhtar', '32 - Béni Abbès', '33 - Timimoun', '34 - Touggourt',
        '35 - Djanet', '36 - In Salah', '37 - In Guezzam', '38 - Alger', '39 - Djelfa',
        '40 - Jijel', '41 - Setif', '42 - Saida', '43 - Skikda', '44 - Annaba',
        '45 - Guelma', '46 - Constantine', '47 - Medea', '48 - Mostaganem', '49 - Mascara',
        '50 - Oran', '51 - El Bayadh', '52 - Illizi', '53 - Bordj Bou Arreridj', '54 - Boumerdes',
        '55 - El Taref', '56 - Tindouf', '57 - El M\'Ghair', '58 - El Meniaa'
    ];
    
    let successCount = 0;
    let failCount = 0;
    
    testWilayas.forEach(wilaya => {
        const result = getDeliveryPrice(wilaya);
        if (result.wilayaName) {
            console.log(`✅ ${wilaya}: ${result.wilayaName} - ${formatDeliveryPrice(result.price)}`);
            successCount++;
        } else {
            console.log(`❌ ${wilaya}: No delivery pricing found`);
            failCount++;
        }
    });
    
    console.log(`📊 Test Results: ${successCount} successful, ${failCount} failed`);
    return { successCount, failCount };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { deliveryPricing, getDeliveryPrice, formatDeliveryPrice, testAllWilayaDeliveryPricing };
}
