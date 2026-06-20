const coimbatoreAreas = [
  {
    id: 1,
    name: "RS Puram",
    safeScore: 88,
    status: "Safe",
    lat: 11.0060,
    lng: 76.9558,
    safeTime: "6:00 AM – 9:00 PM",
    unsafeTime: "10:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "12 Jun 2025", time: "8:30 PM", severity: "medium" },
      { type: "Vehicle Theft", date: "05 Jun 2025", time: "11:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "28 May 2025", time: "2:00 PM", severity: "low" },
    ]
  },
  {
    id: 2,
    name: "Gandhipuram",
    safeScore: 62,
    status: "Caution",
    lat: 11.0168,
    lng: 76.9558,
    safeTime: "7:00 AM – 7:00 PM",
    unsafeTime: "8:00 PM – 6:00 AM",
    recentCrimes: [
      { type: "Pickpocketing", date: "15 Jun 2025", time: "5:30 PM", severity: "medium" },
      { type: "Chain Snatching", date: "10 Jun 2025", time: "9:00 PM", severity: "high" },
      { type: "Assault", date: "02 Jun 2025", time: "11:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "25 May 2025", time: "10:00 PM", severity: "medium" },
    ]
  },
  {
    id: 3,
    name: "Peelamedu",
    safeScore: 81,
    status: "Safe",
    lat: 11.0274,
    lng: 77.0198,
    safeTime: "6:00 AM – 10:00 PM",
    unsafeTime: "11:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Vehicle Theft", date: "14 Jun 2025", time: "9:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "07 Jun 2025", time: "3:00 PM", severity: "low" },
    ]
  },
  {
    id: 4,
    name: "Saibaba Colony",
    safeScore: 90,
    status: "Safe",
    lat: 11.0215,
    lng: 76.9426,
    safeTime: "6:00 AM – 10:00 PM",
    unsafeTime: "11:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "10 Jun 2025", time: "4:00 PM", severity: "low" },
    ]
  },
  {
    id: 5,
    name: "Singanallur",
    safeScore: 70,
    status: "Caution",
    lat: 10.9977,
    lng: 77.0249,
    safeTime: "7:00 AM – 8:00 PM",
    unsafeTime: "9:00 PM – 6:00 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "16 Jun 2025", time: "7:30 PM", severity: "high" },
      { type: "Robbery", date: "11 Jun 2025", time: "10:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "03 Jun 2025", time: "8:00 PM", severity: "medium" },
    ]
  },
  {
    id: 6,
    name: "Ukkadam",
    safeScore: 48,
    status: "Alert",
    lat: 10.9922,
    lng: 76.9628,
    safeTime: "8:00 AM – 6:00 PM",
    unsafeTime: "7:00 PM – 7:00 AM",
    recentCrimes: [
      { type: "Robbery", date: "17 Jun 2025", time: "9:00 PM", severity: "high" },
      { type: "Assault", date: "13 Jun 2025", time: "11:00 PM", severity: "high" },
      { type: "Chain Snatching", date: "08 Jun 2025", time: "8:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "01 Jun 2025", time: "10:00 PM", severity: "medium" },
      { type: "Drug Activity", date: "28 May 2025", time: "12:00 AM", severity: "high" },
    ]
  },
  {
    id: 7,
    name: "Tidel Park Area",
    safeScore: 85,
    status: "Safe",
    lat: 11.0134,
    lng: 77.0311,
    safeTime: "6:00 AM – 10:00 PM",
    unsafeTime: "11:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "09 Jun 2025", time: "6:00 PM", severity: "low" },
      { type: "Vehicle Theft", date: "30 May 2025", time: "9:00 PM", severity: "medium" },
    ]
  },
  {
    id: 8,
    name: "Kavundampalayam",
    safeScore: 75,
    status: "Caution",
    lat: 11.0421,
    lng: 76.9671,
    safeTime: "6:00 AM – 9:00 PM",
    unsafeTime: "10:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "14 Jun 2025", time: "8:00 PM", severity: "high" },
      { type: "Petty Theft", date: "06 Jun 2025", time: "2:00 PM", severity: "low" },
    ]
  },
  {
    id: 9,
    name: "Sowripalayam",
    safeScore: 55,
    status: "Caution",
    lat: 11.0011,
    lng: 76.9988,
    safeTime: "7:00 AM – 7:00 PM",
    unsafeTime: "8:00 PM – 6:00 AM",
    recentCrimes: [
      { type: "Robbery", date: "15 Jun 2025", time: "10:00 PM", severity: "high" },
      { type: "Assault", date: "09 Jun 2025", time: "11:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "02 Jun 2025", time: "9:00 PM", severity: "medium" },
    ]
  },
  {
    id: 10,
    name: "Vadavalli",
    safeScore: 83,
    status: "Safe",
    lat: 11.0274,
    lng: 76.9102,
    safeTime: "6:00 AM – 10:00 PM",
    unsafeTime: "11:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "11 Jun 2025", time: "3:30 PM", severity: "low" },
      { type: "Vehicle Theft", date: "04 Jun 2025", time: "8:00 PM", severity: "medium" },
    ]
  },
  {
    id: 11,
    name: "Hopes College",
    safeScore: 79,
    status: "Safe",
    lat: 11.0134,
    lng: 76.9671,
    safeTime: "6:00 AM – 9:30 PM",
    unsafeTime: "10:00 PM – 5:30 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "13 Jun 2025", time: "8:30 PM", severity: "medium" },
      { type: "Petty Theft", date: "05 Jun 2025", time: "1:00 PM", severity: "low" },
    ]
  },
  {
    id: 12,
    name: "Kovaipudur",
    safeScore: 92,
    status: "Safe",
    lat: 10.9752,
    lng: 76.9426,
    safeTime: "6:00 AM – 11:00 PM",
    unsafeTime: "12:00 AM – 5:00 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "08 Jun 2025", time: "5:00 PM", severity: "low" },
    ]
  },
  {
    id: 13,
    name: "Thudiyalur",
    safeScore: 72,
    status: "Caution",
    lat: 11.0620,
    lng: 76.9558,
    safeTime: "6:30 AM – 8:30 PM",
    unsafeTime: "9:00 PM – 6:00 AM",
    recentCrimes: [
      { type: "Vehicle Theft", date: "16 Jun 2025", time: "9:30 PM", severity: "medium" },
      { type: "Chain Snatching", date: "10 Jun 2025", time: "7:30 PM", severity: "high" },
      { type: "Petty Theft", date: "02 Jun 2025", time: "4:00 PM", severity: "low" },
    ]
  },
  {
    id: 14,
    name: "Ramanathapuram",
    safeScore: 58,
    status: "Caution",
    lat: 11.0060,
    lng: 76.9865,
    safeTime: "7:00 AM – 7:30 PM",
    unsafeTime: "8:00 PM – 6:30 AM",
    recentCrimes: [
      { type: "Robbery", date: "17 Jun 2025", time: "10:00 PM", severity: "high" },
      { type: "Chain Snatching", date: "12 Jun 2025", time: "8:00 PM", severity: "high" },
      { type: "Vehicle Theft", date: "06 Jun 2025", time: "9:30 PM", severity: "medium" },
    ]
  },
  {
    id: 15,
    name: "Podanur",
    safeScore: 45,
    status: "Alert",
    lat: 10.9700,
    lng: 76.9742,
    safeTime: "8:00 AM – 6:00 PM",
    unsafeTime: "7:00 PM – 7:00 AM",
    recentCrimes: [
      { type: "Assault", date: "18 Jun 2025", time: "11:00 PM", severity: "high" },
      { type: "Robbery", date: "14 Jun 2025", time: "10:30 PM", severity: "high" },
      { type: "Drug Activity", date: "10 Jun 2025", time: "1:00 AM", severity: "high" },
      { type: "Chain Snatching", date: "05 Jun 2025", time: "8:30 PM", severity: "high" },
    ]
  },
  {
    id: 16,
    name: "Ganapathy",
    safeScore: 80,
    status: "Safe",
    lat: 11.0349,
    lng: 76.9742,
    safeTime: "6:00 AM – 10:00 PM",
    unsafeTime: "11:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Vehicle Theft", date: "13 Jun 2025", time: "9:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "07 Jun 2025", time: "2:30 PM", severity: "low" },
    ]
  },
  {
    id: 17,
    name: "Kuniyamuthur",
    safeScore: 68,
    status: "Caution",
    lat: 10.9840,
    lng: 76.9310,
    safeTime: "7:00 AM – 8:00 PM",
    unsafeTime: "9:00 PM – 6:00 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "15 Jun 2025", time: "7:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "09 Jun 2025", time: "10:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "01 Jun 2025", time: "3:00 PM", severity: "low" },
    ]
  },
  {
    id: 18,
    name: "Ondipudur",
    safeScore: 74,
    status: "Caution",
    lat: 11.0011,
    lng: 77.0434,
    safeTime: "6:30 AM – 9:00 PM",
    unsafeTime: "10:00 PM – 6:00 AM",
    recentCrimes: [
      { type: "Vehicle Theft", date: "16 Jun 2025", time: "9:30 PM", severity: "medium" },
      { type: "Petty Theft", date: "08 Jun 2025", time: "4:00 PM", severity: "low" },
    ]
  },
  {
    id: 19,
    name: "Neelambur",
    safeScore: 77,
    status: "Safe",
    lat: 11.0421,
    lng: 77.0434,
    safeTime: "6:00 AM – 9:30 PM",
    unsafeTime: "10:30 PM – 5:30 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "12 Jun 2025", time: "5:00 PM", severity: "low" },
      { type: "Vehicle Theft", date: "04 Jun 2025", time: "8:30 PM", severity: "medium" },
    ]
  },
  {
    id: 20,
    name: "Sulur",
    safeScore: 84,
    status: "Safe",
    lat: 11.0274,
    lng: 77.1243,
    safeTime: "6:00 AM – 10:00 PM",
    unsafeTime: "11:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "11 Jun 2025", time: "3:00 PM", severity: "low" },
    ]
  },
  {
    id: 21,
    name: "Kinathukadavu",
    safeScore: 87,
    status: "Safe",
    lat: 10.9385,
    lng: 76.9310,
    safeTime: "6:00 AM – 10:30 PM",
    unsafeTime: "11:30 PM – 5:00 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "09 Jun 2025", time: "4:30 PM", severity: "low" },
    ]
  },
  {
    id: 22,
    name: "Perur",
    safeScore: 89,
    status: "Safe",
    lat: 10.9840,
    lng: 76.9179,
    safeTime: "6:00 AM – 10:30 PM",
    unsafeTime: "11:30 PM – 5:00 AM",
    recentCrimes: [
      { type: "Petty Theft", date: "07 Jun 2025", time: "5:30 PM", severity: "low" },
    ]
  },
  {
    id: 23,
    name: "Saravanampatty",
    safeScore: 82,
    status: "Safe",
    lat: 11.0620,
    lng: 77.0065,
    safeTime: "6:00 AM – 10:00 PM",
    unsafeTime: "11:00 PM – 5:00 AM",
    recentCrimes: [
      { type: "Vehicle Theft", date: "14 Jun 2025", time: "9:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "06 Jun 2025", time: "2:00 PM", severity: "low" },
    ]
  },
  {
    id: 24,
    name: "Kalapatti",
    safeScore: 76,
    status: "Safe",
    lat: 11.0497,
    lng: 77.0311,
    safeTime: "6:30 AM – 9:30 PM",
    unsafeTime: "10:30 PM – 5:30 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "13 Jun 2025", time: "8:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "05 Jun 2025", time: "3:00 PM", severity: "low" },
    ]
  },
  {
    id: 25,
    name: "Vellalore",
    safeScore: 65,
    status: "Caution",
    lat: 10.9700,
    lng: 77.0065,
    safeTime: "7:00 AM – 8:00 PM",
    unsafeTime: "9:00 PM – 6:00 AM",
    recentCrimes: [
      { type: "Robbery", date: "17 Jun 2025", time: "10:00 PM", severity: "high" },
      { type: "Chain Snatching", date: "11 Jun 2025", time: "8:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "04 Jun 2025", time: "9:30 PM", severity: "medium" },
    ]
  },
  {
    id: 26,
    name: "Coimbatore Junction",
    safeScore: 53,
    status: "Caution",
    lat: 11.0017,
    lng: 76.9673,
    safeTime: "8:00 AM – 7:00 PM",
    unsafeTime: "8:00 PM – 7:00 AM",
    recentCrimes: [
      { type: "Pickpocketing", date: "18 Jun 2025", time: "6:00 PM", severity: "medium" },
      { type: "Chain Snatching", date: "15 Jun 2025", time: "9:00 PM", severity: "high" },
      { type: "Assault", date: "10 Jun 2025", time: "11:00 PM", severity: "high" },
      { type: "Drug Activity", date: "03 Jun 2025", time: "12:30 AM", severity: "high" },
    ]
  },
  {
    id: 27,
    name: "Town Hall",
    safeScore: 60,
    status: "Caution",
    lat: 11.0048,
    lng: 76.9634,
    safeTime: "8:00 AM – 7:00 PM",
    unsafeTime: "8:00 PM – 7:00 AM",
    recentCrimes: [
      { type: "Pickpocketing", date: "17 Jun 2025", time: "5:00 PM", severity: "medium" },
      { type: "Chain Snatching", date: "12 Jun 2025", time: "8:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "06 Jun 2025", time: "10:00 PM", severity: "medium" },
    ]
  },
  {
    id: 28,
    name: "Nanjundapuram",
    safeScore: 71,
    status: "Caution",
    lat: 11.0011,
    lng: 76.9426,
    safeTime: "7:00 AM – 8:30 PM",
    unsafeTime: "9:30 PM – 6:00 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "14 Jun 2025", time: "8:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "07 Jun 2025", time: "3:30 PM", severity: "low" },
    ]
  },
  {
    id: 29,
    name: "Pappanaickenpalayam",
    safeScore: 78,
    status: "Safe",
    lat: 11.0497,
    lng: 76.9865,
    safeTime: "6:00 AM – 9:30 PM",
    unsafeTime: "10:30 PM – 5:30 AM",
    recentCrimes: [
      { type: "Vehicle Theft", date: "13 Jun 2025", time: "9:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "05 Jun 2025", time: "2:00 PM", severity: "low" },
    ]
  },
  {
    id: 30,
    name: "Mettupalayam Road",
    safeScore: 73,
    status: "Caution",
    lat: 11.0620,
    lng: 76.9865,
    safeTime: "6:30 AM – 8:30 PM",
    unsafeTime: "9:30 PM – 6:00 AM",
    recentCrimes: [
      { type: "Chain Snatching", date: "16 Jun 2025", time: "7:30 PM", severity: "high" },
      { type: "Vehicle Theft", date: "10 Jun 2025", time: "9:00 PM", severity: "medium" },
      { type: "Petty Theft", date: "03 Jun 2025", time: "4:00 PM", severity: "low" },
    ]
  },
]

export default coimbatoreAreas