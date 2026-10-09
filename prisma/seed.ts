import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const img = (id: string, w = 1800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

// Verified-resolving Unsplash photos. Reused across places where no dedicated photo is sourced yet.
const IMG = {
  hampi: img("1631622958637-11d9f35ef78e"),
  munnar: img("1740744519967-a323d7ec73ad"),
  gokarna: img("1587923623987-c7e4083beb23"),
  coorgHouse: img("1710612198146-77512950a4b7"),
  coorgBridge: img("1661492359562-419ba0ebaece"),
  coorgRoad: img("1634874634941-78abc0a00298"),
  falls: img("1569996980833-901b5cd2eb70"),
  valley: img("1730621697273-233e874a7f88"),
  coffee: img("1710612079273-0a555390fef1"),
  alleppey: img("1677475455506-1e429162f44f"),
  boats: img("1704365159747-1f7b8913044f"),
  houseboat: img("1593693397690-362cb9666fc2"),
  chikmagalur: img("1622725859789-8e9ccf920693"),
  chikLake: img("1680092338119-444efe802f1e"),
  goa: img("1652820330085-82a0c2b88d78"),
  goaCoast: img("1642516864726-a243f416fc00"),
  madurai: img("1692173248120-59547c3d4653"),
  maduraiTank: img("1572146462570-2129a547e6dd"),
  rameswaram: img("1701665836329-57c6a17a2daf"),
  pamban: img("1706932642959-97cdde19ef0b"),
  tirupati: img("1741003412854-bd4b264c4af3"),
  tirumala: img("1733805569204-41768c7d8c0f"),
  mangaluru: img("1622173324953-adb598835e7a"),
  lighthouse: img("1602498014594-5acf3888f111"),
};

const destinations = [
  { slug: "chikmagalur", name: "Chikmagalur", state: "Karnataka", tagline: "Coffee hills and Mullayanagiri sunrises.", heroImage: IMG.chikmagalur,
    description: "Karnataka's coffee capital, about 245 km from Bengaluru. Mullayanagiri, Baba Budangiri and estate stays in the Baba Budan hills." },
  { slug: "mangaluru", name: "Mangaluru", state: "Karnataka", tagline: "Coast, seafood and Udupi on the way.", heroImage: IMG.mangaluru,
    description: "The coastal gateway of Karnataka: Panambur and Tannirbavi beaches, Kadri temple, fish thalis, and Udupi and Dharmasthala close by." },
  { slug: "goa", name: "Goa", state: "Goa", tagline: "Beaches north, quiet south.", heroImage: IMG.goa,
    description: "An overnight drive from Bengaluru via Hubballi. North Goa for the shacks and forts, south for Palolem and Agonda." },
  { slug: "madurai", name: "Madurai", state: "Tamil Nadu", tagline: "Meenakshi Amman and a city that never sleeps.", heroImage: IMG.madurai,
    description: "A 2,500 year old temple city. The Meenakshi Amman complex, Thirumalai Nayakkar Mahal and jigarthanda at midnight." },
  { slug: "rameswaram", name: "Rameswaram", state: "Tamil Nadu", tagline: "Ramanathaswamy and the Pamban bridge.", heroImage: IMG.rameswaram,
    description: "One of the Char Dham pilgrimages: 22 theerthams inside Ramanathaswamy temple, Dhanushkodi and the Pamban sea bridge." },
  { slug: "tirupati", name: "Tirupati", state: "Andhra Pradesh", tagline: "Sri Venkateswara at Tirumala.", heroImage: IMG.tirupati,
    description: "Tirumala is among the most visited temples in the world. We plan darshan slots, travel and stay at Tirupati." },
  { slug: "udupi", name: "Udupi", state: "Karnataka", tagline: "Sri Krishna Matha and the coast.", heroImage: IMG.lighthouse,
    description: "Krishna Matha, the home of Udupi cuisine, with Malpe beach and St Mary's Island nearby." },
  { slug: "coorg", name: "Coorg", state: "Karnataka", tagline: "Coffee plantations, misty mornings, slow roads.", heroImage: IMG.coorgRoad,
    description: "Five hours from Bengaluru, Kodagu is estate country: coffee and pepper under silver oak, homestays that serve pandi curry, and roads that reward going slowly." },
  { slug: "munnar", name: "Munnar", state: "Kerala", tagline: "Tea country above the clouds.", heroImage: IMG.munnar,
    description: "Rolling tea estates, Eravikulam's Nilgiri tahr and cold mornings at 1,600 metres. Best from September to March." },
  { slug: "gokarna", name: "Gokarna", state: "Karnataka", tagline: "Quiet beaches, easy days.", heroImage: IMG.gokarna,
    description: "A temple town with Om Beach, Kudle and Paradise Beach a short trek apart. Overnight bus or a long drive from Bengaluru." },
  { slug: "hampi", name: "Hampi", state: "Karnataka", tagline: "Boulders, ruins and the Tungabhadra.", heroImage: IMG.hampi,
    description: "The Vijayanagara capital spread across a boulder-strewn river valley. Cycle between Virupaksha, Vittala and Hemakuta at sunrise." },
  { slug: "alleppey", name: "Alleppey", state: "Kerala", tagline: "Houseboats and green water.", heroImage: IMG.alleppey,
    description: "Kerala's backwaters by kettuvallam, with appam and karimeen served on board." },
  { slug: "wayanad", name: "Wayanad", state: "Kerala", tagline: "Forest stays and waterfalls.", heroImage: IMG.falls,
    description: "Edakkal caves, Banasura Sagar and spice plantations, a comfortable weekend drive from Mysuru." },
];

type Pkg = { slug: string; title: string; route?: string; category?: "LEISURE" | "RELIGIOUS"; dest: string; days: number; price: number; featured: boolean; summary: string; overview: string;
  hotels: string[]; images: string[]; itinerary: [string, string][] };

const packages: Pkg[] = [
  { slug: "coorg-3-days", title: "Coorg Coffee Estate Escape", dest: "coorg", days: 3, price: 7999, featured: true,
    summary: "Estate homestay, Abbey Falls and Dubare, with a plantation walk.",
    overview: "Leave Bengaluru on Friday night or Saturday morning. Two nights in a working coffee estate, with guided plantation walks, Namdroling and a sunrise at Raja's Seat.",
    hotels: ["Misty Woods Estate Homestay, Madikeri"], images: [IMG.coorgRoad, IMG.coorgHouse, IMG.coffee, IMG.falls],
    itinerary: [["Bengaluru to Madikeri", "Drive via Kushalnagar, check in to the estate and walk the plantation at dusk."],
      ["Abbey Falls, Raja's Seat, Dubare", "Morning at Abbey Falls, Raja's Seat sunset, optional elephant camp at Dubare."],
      ["Namdroling and return", "Golden Temple at Bylakuppe, lunch at Kushalnagar, back in Bengaluru by evening."]] },
  { slug: "munnar-family-trip", title: "Munnar Family Trip", dest: "munnar", days: 4, price: 11999, featured: true,
    summary: "Tea estates, Eravikulam and Mattupetty with a private cab.",
    overview: "Four relaxed days in the Kerala hills with a private vehicle and a hotel overlooking the tea estates.",
    hotels: ["Tea Valley Resort, Chithirapuram"], images: [IMG.munnar, IMG.valley, IMG.falls],
    itinerary: [["Bengaluru to Munnar", "Overnight drive or early start via Coimbatore and Udumalpet."],
      ["Eravikulam and Tea Museum", "Rajamalai for the Nilgiri tahr, then the Kanan Devan tea museum."],
      ["Mattupetty, Echo Point, Top Station", "Boating at Mattupetty and sunset at Top Station."],
      ["Return", "Breakfast with a view and a slow drive back."]] },
  { slug: "gokarna-weekend", title: "Gokarna Weekend", dest: "gokarna", days: 3, price: 8499, featured: true,
    summary: "Om Beach, Kudle and the beach trek with a seaside stay.",
    overview: "A short coastal break. Walk the Kudle to Paradise trail and watch sunset from Om Beach.",
    hotels: ["Kudle Beach Cottages"], images: [IMG.gokarna, IMG.boats],
    itinerary: [["Overnight to Gokarna", "Sleeper bus from Bengaluru, arrive early morning."],
      ["Beach trek", "Kudle, Om, Half Moon and Paradise beaches, ending with sunset."],
      ["Mahabaleshwar Temple and return", "Morning darshan and afternoon departure."]] },
  { slug: "hampi-heritage-weekend", title: "Hampi Heritage Weekend", dest: "hampi", days: 3, price: 9499, featured: false,
    summary: "Vittala, Virupaksha and Matanga Hill at sunrise.",
    overview: "Two full days among the Vijayanagara ruins with a local guide and a coracle ride on the Tungabhadra.",
    hotels: ["Boulder Garden Stay, Hampi"], images: [IMG.hampi],
    itinerary: [["Bengaluru to Hampi", "Overnight train or bus, arrive for breakfast."],
      ["Royal Enclosure and Vittala", "Guided walk, stone chariot and Virupaksha at dusk."],
      ["Matanga Hill sunrise", "Early climb, coracle ride and departure."]] },
  { slug: "alleppey-houseboat-getaway", title: "Alleppey Houseboat Getaway", dest: "alleppey", days: 3, price: 12999, featured: false,
    summary: "A night on a kettuvallam with Kerala meals on board.",
    overview: "Cruise the backwaters, eat fresh karimeen and stay a night on a private houseboat.",
    hotels: ["Private AC houseboat, Punnamada"], images: [IMG.alleppey, IMG.houseboat, IMG.boats],
    itinerary: [["Bengaluru to Alleppey", "Morning flight to Kochi, transfer to Alleppey."],
      ["Houseboat cruise", "Board at noon, overnight on the water."],
      ["Marari Beach and return", "Morning at Marari and evening departure."]] },
  { slug: "wayanad-forest-stay", title: "Wayanad Forest Stay", dest: "wayanad", days: 3, price: 10499, featured: false,
    summary: "Edakkal, Banasura Sagar and a spice plantation stay.",
    overview: "Two nights in a plantation cottage with guided forest walks and waterfall visits.",
    hotels: ["Spice Trail Plantation Cottages, Vythiri"], images: [IMG.falls, IMG.valley],
    itinerary: [["Bengaluru to Vythiri", "Drive via Mysuru and Bandipur."],
      ["Edakkal and Banasura", "Morning trek to Edakkal caves, afternoon at Banasura Sagar."],
      ["Spice walk and return", "Plantation walk before the drive back."]] },
  { slug: "bengaluru-to-chikmagalur-2-days", title: "Chikmagalur Weekend Getaway", route: "Bengaluru → Chikmagalur", dest: "chikmagalur", days: 2, price: 5999, featured: false,
    summary: "Mullayanagiri sunrise, Hebbe Falls and an estate stay.",
    overview: "A quick two-day break. Leave Bengaluru early on Saturday and be on the Mullayanagiri trail by afternoon.",
    hotels: ["Baba Budan Estate Stay, Chikmagalur"], images: [IMG.chikmagalur, IMG.chikLake],
    itinerary: [["Bengaluru to Chikmagalur, Mullayanagiri", "Drive via Hassan and Belur. Evening coffee estate walk."], ["Hebbe Falls, Kemmanagundi and return", "Early Mullayanagiri sunrise, Hebbe Falls and drive back by night."]] },
  { slug: "bengaluru-to-mangaluru-udupi-3-days", title: "Mangaluru and Udupi Coast Trip", route: "Bengaluru → Mangaluru", dest: "mangaluru", days: 3, price: 9999, featured: false,
    summary: "Mangaluru beaches, Udupi Krishna Matha and Malpe via Shiradi Ghat.",
    overview: "Down the Shiradi Ghat to the coast: temples, beaches and a lot of seafood.",
    hotels: ["Sea View Residency, Mangaluru"], images: [IMG.mangaluru, IMG.lighthouse],
    itinerary: [["Bengaluru to Mangaluru", "Drive via Hassan and Shiradi Ghat. Panambur beach at sunset."], ["Kadri, St Aloysius Chapel, Udupi", "Morning in Mangaluru, afternoon darshan at Krishna Matha, Malpe beach."], ["Tannirbavi and return", "Beach breakfast and the drive back."]] },
  { slug: "bengaluru-to-goa-4-days", title: "Goa Beach Break", route: "Bengaluru → Goa", dest: "goa", days: 4, price: 12499, featured: false,
    summary: "North Goa beaches and forts, with a day in the south.",
    overview: "Overnight to Goa and three relaxed days on the coast with a private vehicle for local sightseeing.",
    hotels: ["Candolim Beach Resort, North Goa"], images: [IMG.goa, IMG.goaCoast],
    itinerary: [["Overnight to Goa", "Depart Bengaluru in the evening via Hubballi."], ["North Goa", "Fort Aguada, Baga, Anjuna and a sunset at Vagator."], ["South Goa", "Palolem or Agonda beach and old Goa churches."], ["Return", "Late morning check-out and drive back."]] },
  { slug: "alleppey-munnar-5-days", title: "Alleppey and Munnar Kerala Circuit", route: "Bengaluru → Munnar → Alleppey", dest: "munnar", days: 5, price: 18999, featured: true,
    summary: "Tea hills first, then a night on the Alleppey backwaters.",
    overview: "The classic Kerala pairing in five days: two in Munnar, a night on a houseboat, a beach stop at Marari.",
    hotels: ["Tea Valley Resort, Munnar", "Private AC houseboat, Alleppey"], images: [IMG.munnar, IMG.alleppey, IMG.houseboat],
    itinerary: [["Bengaluru to Munnar", "Early drive via Coimbatore and Udumalpet."], ["Munnar sightseeing", "Eravikulam, tea museum and Top Station."], ["Munnar to Alleppey", "Via Kottayam; board the houseboat at 1pm."], ["Backwater cruise, Marari Beach", "Morning cruise, afternoon at Marari."], ["Return to Bengaluru", "Overnight drive or flight from Kochi."]] },
  { slug: "tirupati-tirumala-darshan-2-days", title: "Tirupati Tirumala Darshan", route: "Bengaluru → Tirupati", category: "RELIGIOUS", dest: "tirupati", days: 2, price: 4999, featured: true,
    summary: "Special entry darshan at Tirumala with Padmavathi temple.",
    overview: "Overnight travel, early darshan slot and a visit to Sri Padmavathi temple at Tiruchanoor. Darshan tickets are booked in advance for your date.",
    hotels: ["Tirupati lodge near Alipiri"], images: [IMG.tirupati, IMG.tirumala],
    itinerary: [["Bengaluru to Tirupati", "Overnight drive. Check in and rest before the evening."], ["Tirumala darshan and return", "Early darshan slot, Padmavathi temple, drive back to Bengaluru."]] },
  { slug: "madurai-rameswaram-4-days", title: "Madurai and Rameswaram Yatra", route: "Bengaluru → Madurai → Rameswaram", category: "RELIGIOUS", dest: "rameswaram", days: 4, price: 13999, featured: true,
    summary: "Meenakshi Amman, Ramanathaswamy and Dhanushkodi.",
    overview: "A Tamil Nadu temple circuit: Madurai's Meenakshi Amman, the 22 theerthams at Rameswaram and the Pamban bridge.",
    hotels: ["Madurai heritage hotel", "Rameswaram temple-side lodge"], images: [IMG.rameswaram, IMG.pamban, IMG.madurai, IMG.maduraiTank],
    itinerary: [["Bengaluru to Madurai", "Overnight drive. Evening darshan at Meenakshi Amman."], ["Madurai to Rameswaram", "Morning darshan; drive to Rameswaram over the Pamban bridge."], ["Ramanathaswamy and Dhanushkodi", "Theertham bath at dawn, Dhanushkodi in the afternoon."], ["Return", "Drive back with a stop at Trichy."]] },
  { slug: "udupi-dharmasthala-kukke-3-days", title: "Udupi, Dharmasthala and Kukke Subramanya", route: "Bengaluru → Udupi → Dharmasthala", category: "RELIGIOUS", dest: "udupi", days: 3, price: 8999, featured: false,
    summary: "Krishna Matha, Manjunatha and Kukke on one coastal circuit.",
    overview: "Three Karnataka pilgrimage towns in one loop through the Western Ghats.",
    hotels: ["Udupi temple-town hotel", "Dharmasthala guest house"], images: [IMG.lighthouse, IMG.mangaluru],
    itinerary: [["Bengaluru to Udupi", "Drive via Hassan. Evening at Krishna Matha."], ["Dharmasthala and Kukke Subramanya", "Manjunatha darshan, then Kukke Subramanya by afternoon."], ["Return", "Back via Sakleshpur."]] },
];

const vehicleTypes = [
  { name: "Car", minSeats: 4, maxSeats: 5 }, { name: "SUV", minSeats: 6, maxSeats: 7 },
  { name: "Tempo Traveller", minSeats: 12, maxSeats: 17 }, { name: "Bus", minSeats: 20, maxSeats: 50 },
];
const vehicles = [
  { type: "Car", model: "Maruti Dzire", reg: "KA 01 AB 1234", seats: 4, day: 2800, km: 12, ac: true },
  { type: "SUV", model: "Toyota Innova Crysta", reg: "KA 05 MN 4521", seats: 7, day: 4500, km: 18, ac: true },
  { type: "Tempo Traveller", model: "Force Traveller 17-seater", reg: "KA 03 CD 7788", seats: 17, day: 7500, km: 24, ac: true },
  { type: "Bus", model: "Tata Starbus 32-seater", reg: "KA 51 EF 2210", seats: 32, day: 14000, km: 38, ac: false },
];
const drivers = [
  { name: "Manjunath Gowda", phone: "+919845000101", licenseNo: "KA0120180012345" },
  { name: "Suresh Kumar", phone: "+919845000102", licenseNo: "KA0520170054321" },
  { name: "Abdul Rahman", phone: "+919845000103", licenseNo: "KA0320190098765" },
  { name: "Venkatesh Naik", phone: "+919845000104", licenseNo: "KA5120160045678" },
];
const reviews = [
  ["coorg-3-days", 5, "The Coorg trip was incredibly well organized. Everything from the homestay to the driver was smooth.", "Rahul", "Bengaluru"],
  ["munnar-family-trip", 5, "Travelled with my parents and two kids. The cab was clean and the driver knew every stop worth making.", "Priya", "Mysuru"],
  ["gokarna-weekend", 4, "Great value for a weekend. Cottages were basic but right on the beach.", "Karthik", "Bengaluru"],
  ["hampi-heritage-weekend", 5, "Our guide made the ruins come alive. Sunrise at Matanga was worth the early start.", "Ananya", "Hyderabad"],
] as const;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, role: "ADMIN" },
      create: { email: adminEmail, name: "Admin", passwordHash, role: "ADMIN" },
    });
    console.log("Admin user ready:", adminEmail);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin user.");
  }

  const destBySlug: Record<string, string> = {};
  for (const d of destinations) {
    const row = await db.destination.upsert({ where: { slug: d.slug }, update: d, create: d });
    destBySlug[d.slug] = row.id;
  }

  const pkgBySlug: Record<string, string> = {};
  for (const p of packages) {
    const data = {
      slug: p.slug, title: p.title, category: p.category ?? "LEISURE",
      route: p.route ?? `Bengaluru → ${destinations.find((d) => d.slug === p.dest)!.name}`, summary: p.summary, overview: p.overview, days: p.days, nights: p.days - 1,
      pricePerPerson: p.price, featured: p.featured, published: true, hotels: p.hotels,
      inclusions: ["Accommodation", "Daily breakfast", "Private AC vehicle from Bengaluru", "Driver allowance, tolls and parking", "Sightseeing as per itinerary"],
      exclusions: ["Lunch and dinner unless stated", "Entry tickets and activities", "Personal expenses", "GST (5%)"],
      destinationId: destBySlug[p.dest],
    };
    const row = await db.package.upsert({ where: { slug: p.slug }, update: data, create: data });
    pkgBySlug[p.slug] = row.id;
    await db.packageImage.deleteMany({ where: { packageId: row.id } });
    await db.packageItinerary.deleteMany({ where: { packageId: row.id } });
    await db.packageDate.deleteMany({ where: { packageId: row.id } });
    await db.packageImage.createMany({ data: p.images.map((url, i) => ({ packageId: row.id, url, alt: `${p.title} photo ${i + 1}`, position: i })) });
    await db.packageItinerary.createMany({ data: p.itinerary.map(([title, description], i) => ({ packageId: row.id, day: i + 1, title, description })) });
    // Fridays over the next ~10 weeks
    const start = new Date(); start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() + ((5 - start.getUTCDay() + 7) % 7 || 7));
    await db.packageDate.createMany({ data: Array.from({ length: 10 }, (_, w) => ({ packageId: row.id, startDate: new Date(start.getTime() + w * 7 * 864e5), seatsLeft: 20 - (w % 4) })) });
  }

  const typeId: Record<string, string> = {};
  for (const t of vehicleTypes) {
    const row = await db.vehicleType.upsert({ where: { name: t.name }, update: {}, create: { ...t, image: IMG.coorgRoad } });
    typeId[t.name] = row.id;
  }
  const vehicleIds: string[] = [];
  for (const v of vehicles) {
    const data = { typeId: typeId[v.type], model: v.model, registration: v.reg, seats: v.seats, ac: v.ac, dailyPrice: v.day, perKmPrice: v.km,
      features: v.ac ? ["Air conditioning", "Music system", "Luggage carrier"] : ["Pushback seats", "Luggage space"], image: IMG.coorgRoad };
    const row = await db.vehicle.upsert({ where: { registration: v.reg }, update: data, create: data });
    vehicleIds.push(row.id);
  }
  for (const [i, d] of drivers.entries()) {
    await db.driver.upsert({ where: { licenseNo: d.licenseNo }, update: {}, create: { ...d, vehicleId: vehicleIds[i] } });
  }

  if ((await db.review.count()) === 0) {
    await db.review.createMany({ data: reviews.map(([slug, rating, body, authorName, authorCity]) => ({
      packageId: pkgBySlug[slug], rating, body, authorName, authorCity, status: "APPROVED" as const })) });
  }
  console.log("Seeded", destinations.length, "destinations,", packages.length, "packages,", vehicles.length, "vehicles");
}

main().finally(() => db.$disconnect());
