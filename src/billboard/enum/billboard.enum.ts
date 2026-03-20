export enum BillBoardOrientationEnum {
  landscape = 'landscape',
  portrait = 'portrait',
}

export enum BillboardPrintProductType {
  // Billboard & Flex Materials
  BillboardRegularFlex440 = 'Billboard material (regular flex 440 grams)',
  BillboardRegularFlex550 = 'Billboard material (regular flex 550 grams)',
  BillboardBacklitFlex = 'Billboard material (backlit flex)',
  BacklitFlex = 'Backlit flex',
  ReflectiveFlex = 'Reflective flex',
  MatteFlex = 'Matte flex',

  // Specialized Materials
  WindowGraphicsMesh = 'Window graphics (mesh material)',
  SoliteMaterial = 'Solite material',
  ClearSAV = 'Clear sav',
  ReflectiveSAV = 'Reflective sav',
  BRTPrint = 'BRT Print',

  // Banners & Displays
  RollUpBigBaseFlex = 'Roll Up banner with a big base flex',
  RollUpBigBaseSolite = 'Rollup banner with a big base solite',
  RollUpSmallBaseFlex = 'Rollup banner with a smaller base flex',
  RollUpSmallBaseSolite = 'Rollup banner with a smaller base Solite',
  PopUpDisplay = 'Pop Up Display banner',

  // Product Categories
  VehicleBranding = 'Vehicle branding',
  VehicleBrandingProduct = 'Vehicle branding (product)',
  FlyersHandbills = 'Flyers and Handbills (product)',
  CarrierBags = 'Carrier bags (product)',
  CorporateGifts = 'Corporate Gifts (product)',
  NotepadsJotters = 'Notepads and Jotters (product)',
  LargeFormatProduct = 'Large Format (product)',
}

export enum BillboardMediaTypeEnum {
  // Billboard Types
  StaticBillboard = 'Static Billboard',
  LEDBillboard = 'LED Billboard',
  MegaBillboard = 'Mega Billboard',

  // Location-Based
  AirportAdvertising = 'Airport Advertising',
  RetailStoreAdvertising = 'Retail Store Advertising',
  MarketAdvertising = 'Market Advertising',

  // Street & Transit
  LamppostAdvertising = 'Lamppost Advertising',
  TransitAdvertising = 'Transit Advertising',
  BusShelter = 'Bus Shelter',

  // Specialty & Branding
  BuildingBranding = 'Building Branding',
  InflatableBranding = 'Inflatable Branding',
}

export enum BillboardProductType {
  // Standard Large Format
  Sheet48 = '48 Sheets',
  Sheet98 = '98 Sheets',
  Unipole = 'Unipole',
  Gantry = 'Gantry',
  BridgeSign = 'Bridge Sign',
  Rooftop = 'Roof top',
  Portrait = 'Portrait',
  Eyecatcher = 'Eyecatcher',
  RoadSidePanel = 'Road Side panel',
  Walldrape = 'Walldrape',

  // Digital & LED
  LEDBillboard = 'LED Billboards',
  GantryLED = 'Gantry LED',
  MobileLEDBillboard = 'Mobile LED Billboard',
  TricycleLED = 'Tricycle LED',
  InMallScreens = 'In-mall Screens',

  // Transit & Vehicle
  LamppostBanners = 'Lamppost Banners',
  BRT = 'BRT',
  MiniBusBranding = 'Mini Bus branding',
  TricycleBranding = 'Tricycle branding',
  VehicleBranding = 'Vehicle branding',
  BusShelter = 'Bus Shelter',

  // Specialized & Ambient
  LightboxBacklit = 'Lightbox/Backlit',
  BuildingBranding = 'Building branding',
  InflatableBranding = 'Inflatable branding',
  IconicStructures = 'Iconic structures',
  AirportAdvertising = 'Airport advertising',
  InMarketAdvertising = 'In-Market Advertising',
}

export enum BillboardLandmark {
  // --- Cultural & Natural Landmarks ---
  NationalTheatreLagos = 'National Theatre, Lagos',
  AsoRockVilla = 'Aso Rock Presidential Villa, Abuja',
  OlumoRock = 'Olumo Rock, Abeokuta',
  ZumaRock = 'Zuma Rock, Abuja',
  EmirsPalaceKano = "Emir's Palace, Kano",
  LekkiConservationCentre = 'Lekki Conservation Centre, Lagos',
  YankariNationalPark = 'Yankari National Park, Bauchi',
  GuraraFalls = 'Gurara Falls, Niger',
  OgbunikeCaves = 'Ogbunike Caves, Anambra',
  EkoAtlanticCity = 'Eko Atlantic City, Lagos',

  // --- Infrastructure & Government ---
  ThirdMainlandBridge = 'Third Mainland Bridge, Lagos',
  LekkiIkoyiLinkBridge = 'Lekki-Ikoyi Link Bridge, Lagos',
  EkoBridge = 'Eko Bridge, Lagos',
  NationalAssemblyComplex = 'National Assembly Complex, Abuja',
  CBNHeadquarters = 'CBN Headquarters, Abuja',
  NigerianStockExchange = 'Nigerian Stock Exchange, Lagos',
  NationalHospitalAbuja = 'National Hospital, Abuja',
  LagosStateSecretariat = 'Lagos State Government Secretariat',

  // --- Higher Institutions & Education ---
  UniversityOfIbadan = 'University of Ibadan',
  UniversityOfLagos = 'University of Lagos',
  ObafemiAwolowoUniversity = 'Obafemi Awolowo University, Ile-Ife',
  AhmaduBelloUniversity = 'Ahmadu Bello University, Zaria',
  LagosStateUniversity = 'Lagos State University',
  YabaCollegeOfTechnology = 'Yaba College of Technology, Lagos',
  NigerianLawSchoolLagos = 'Nigerian Law School, Lagos',
  LagosBusinessSchool = 'Lagos Business School',

  // --- Sports & Recreation ---
  NationalStadiumLagos = 'National Stadium, Lagos',
  AbujaNationalStadium = 'Abuja National Stadium',
  IBBGolfClub = 'IBB Golf Club, Abuja',
  IkoyiClub1938 = 'Ikoyi Club 1938, Lagos',
  JabiLake = 'Jabi Lake, Abuja',
  MillenniumPark = 'Millennium Park, Abuja',

  // --- Commercial & Hospitality ---
  EkoHotelSuites = 'Eko Hotel & Suites, Lagos',
  ThePalmsShoppingMall = 'The Palms Shopping Mall, Lagos',
  JabiLakeMall = 'Jabi Lake Mall, Abuja',
  TinapaResort = 'Tinapa Resort, Calabar',
  NikeArtGallery = 'Nike Art Gallery, Lagos',

  // --- General Categories (From the end of your list) ---
  UniversityCampus = 'University Campus',
  StateSecretariat = 'State Secretariat',
  PrimarySchool = 'Primary School',
  SecondarySchool = 'Secondary School',
  IndustrialArea = 'Industrial Area',
  CommercialArea = 'Commercial Area',
  IndustrialLayout = 'Industrial Layout',
  GroceryStore = 'Grocery Store',
  Hotel5Star = '5-star hotel',
  RecreationalCentre = 'Recreational Centre',
  Hospitality = 'Hospitality',
}

export enum BillboardTargetAudience {
  // General Consumer Segments
  MassMarket = 'Mass Market Consumers',
  Households = 'Households',
  Individuals = 'Individuals',
  YouthAndStudents = 'Youth & Students',

  // Professional & Decision Makers
  KeyDecisionMakers = 'Key Decision Makers',
  HouseholdBuyers = 'Household Buyers',
  WorkingProfessionors = 'Working Professionals',

  // B2B & Trade
  TradeRetailChannel = 'Trade & Retail Channel (B2B Audience)',
  DistributorsAndRetailers = 'Distributors & Retailers',

  // Economic Segments
  LowIncome = 'Low-Income Consumers',
  MiddleIncome = 'Middle-Income Consumers',
  HighIncome = 'High-Income Consumers',
  UrbanConsumers = 'Urban Consumers',

  //Location
  HighTrafficLocations = 'High-traffic locations (markets, bus stops, junctions)',
  RetailOutlets = 'Retail outlets',
  TransitRoutes = 'Transit routes',
  MajorMarkets = 'Major markets',
}

export enum BillboardServiceCategory {
  OutdoorAdvertising = 'Outdoor Advertising',
  Prints = 'Prints',
  DigitalMarketing = 'Digital Marketing',
  RadioAdvertising = 'Radio Advertising',
  TVAdvertising = 'TV Advertising',
  ConsultancyServices = 'Consultancy Services',
}
