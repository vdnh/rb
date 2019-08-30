//
// ===== File globals.ts    
//
'use strict'; // with strict mode, we cannot, for example use undeclared variables

export const adServer: string="https://192.168.0.131" //"https://cts.sosprestige.com";//"https://192.168.0.131"; // adresse de server java - spring
export const host: string=adServer+":8080"; // adresse de server avec :8080
export const hostUserInfo: string=host+"/users/"; // adresse de server avec  /users/
export const emailPrincipal: string = "ventesosprestige@gmail.com"
export const version: string="1.0.0"; 
export const camionTypes = [
    { id: 1, name: 'Van/DryBox' },
    { id: 2, name: 'FlatBed' },
    { id: 3, name: 'RackAndTarp' },
    { id: 4, name: 'Floats' },
    { id: 5, name: 'Reefer' },
    { id: 6, name: 'StepDeck' },
    { id: 7, name: 'Container' },
    { id: 8, name: 'LowBoy/RGN' },
    { id: 9, name: 'StraightTruck' },
    { id: 10, name: 'DoubleDrop' },
    { id: 11, name: 'SuperB' },
    { id: 12, name: 'PowerOnly' },
    { id: 13, name: 'CurtainSide' },
    { id: 14, name: 'RollTiteTrailer' },
    { id: 15, name: 'DumpTrailer' },
    { id: 16, name: 'Other' },
    { id: 17, name: 'Air Ride' },
    { id: 18, name: 'Chains' },
    { id: 19, name: 'Tarps' },
    { id: 20, name: 'Team' },
    { id: 21, name: 'Heat' },
    { id: 22, name: 'B-Train' },
    { id: 23, name: 'HazMat' },
    { id: 24, name: 'Vented' },
    { id: 25, name: 'Talgate' },
    { id: 26, name: 'Expedite' },
    { id: 27, name: 'Blanket Wrap' },
    { id: 28, name: 'Insulated' },
    { id: 29, name: 'Tri-Axle' },
    { id: 30, name: 'Frozen' },
    { id: 31, name: 'Inbond' },
    { id: 32, name: 'Other' }
  ];
export const provinceList=['Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon',]
export const villeList=['Banff',
  'Brooks',
  'Calgary',
  'Edmonton',
  'Fort McMurray',
  'Grande Prairie',
  'Jasper',
  'Lake Louise',
  'Lethbridge',
  'Medicine Hat',
  'Red Deer',
  'Saint Albert',
  'Barkerville',
  'Burnaby',
  'Campbell River',
  'Chilliwack',
  'Courtenay',
  'Cranbrook',
  'Dawson Creek',
  'Delta',
  'Esquimalt',
  'Fort Saint James',
  'Fort Saint John',
  'Hope',
  'Kamloops',
  'Kelowna',
  'Kimberley',
  'Kitimat',
  'Langley',
  'Nanaimo',
  'Nelson',
  'New Westminster',
  'North Vancouver',
  'Oak Bay',
  'Penticton',
  'Powell River',
  'Prince George',
  'Prince Rupert',
  'Quesnel',
  'Revelstoke',
  'Rossland',
  'Trail',
  'Vancouver',
  'Vernon',
  'Victoria',
  'West Vancouver',
  'White Rock',
  'Advertisement',
  'Brandon',
  'Churchill',
  'Dauphin',
  'Flin Flon',
  'Kildonan',
  'Saint Boniface',
  'Swan River',
  'Thompson',
  'Winnipeg',
  'York Factory',
  'Bathurst',
  'Caraquet',
  'Dalhousie',
  'Fredericton',
  'Miramichi',
  'Moncton',
  'Saint John',
  'Argentia',
  'Bonavista',
  'Channel-Port aux Basques',
  'Corner Brook',
  'Ferryland',
  'Gander',
  'Grand Falls–Windsor',
  'Happy Valley–Goose Bay',
  'Harbour Grace',
  'Labrador City',
  'Placentia',
  'Saint Anthony',
  'St. John`s',
  'Wabana',
  'Advertisement',
  'Fort Smith',
  'Hay River',
  'Inuvik',
  'Tuktoyaktuk',
  'Yellowknife',
  'Baddeck',
  'Digby',
  'Glace Bay',
  'Halifax',
  'Liverpool',
  'Louisbourg',
  'Lunenburg',
  'Pictou',
  'Port Hawkesbury',
  'Springhill',
  'Sydney',
  'Yarmouth',
  'Iqaluit',
  'Bancroft',
  'Barrie',
  'Belleville',
  'Brampton',
  'Brantford',
  'Brockville',
  'Burlington',
  'Cambridge',
  'Chatham',
  'Chatham-Kent',
  'Cornwall',
  'Elliot Lake',
  'Etobicoke',
  'Fort Erie',
  'Fort Frances',
  'Gananoque',
  'Guelph',
  'Hamilton',
  'Iroquois Falls',
  'Kapuskasing',
  'Kawartha Lakes',
  'Kenora',
  'Kingston',
  'Kirkland Lake',
  'Kitchener',
  'Laurentian Hills',
  'London',
  'Midland',
  'Mississauga',
  'Moose Factory',
  'Moosonee',
  'Niagara Falls',
  'Niagara-on-the-Lake',
  'North Bay',
  'North York',
  'Oakville',
  'Orillia',
  'Oshawa',
  'Ottawa',
  'Parry Sound',
  'Perth',
  'Peterborough',
  'Picton',
  'Port Colborne',
  'Saint Catharines',
  'Saint Thomas',
  'Sarnia-Clearwater',
  'Sault Sainte Marie',
  'Scarborough',
  'Simcoe',
  'Stratford',
  'Sudbury',
  'Temiskaming Shores',
  'Thorold',
  'Thunder Bay',
  'Timmins',
  'Toronto',
  'Trenton',
  'Waterloo',
  'Welland',
  'West Nipissing',
  'Windsor',
  'Woodstock',
  'York',
  'Borden',
  'Cavendish',
  'Charlottetown',
  'Souris',
  'Summerside',
  'Asbestos',
  'Baie-Comeau',
  'Beloeil',
  'Cap-de-la-Madeleine',
  'Chambly',
  'Charlesbourg',
  'Châteauguay',
  'Chibougamau',
  'Côte-Saint-Luc',
  'Dorval',
  'Gaspé',
  'Gatineau',
  'Granby',
  'Havre-Saint-Pierre',
  'Hull',
  'Jonquière',
  'Kuujjuaq',
  'La Salle',
  'La Tuque',
  'Lachine',
  'Laval',
  'Lévis',
  'Longueuil',
  'Magog',
  'Matane',
  'Montreal',
  'Montréal-Nord',
  'Terrebonne',
  'Percé',
  'Port-Cartier',
  'Quebec',
  'Rimouski',
  'Rouyn-Noranda',
  'Saguenay',
  'Saint-Eustache',
  'Saint-Hubert',
  'Sainte-Anne-de-Beaupré',
  'Sainte-Foy',
  'Sainte-Thérèse',
  'Sept-Îles',
  'Sherbrooke',
  'Sorel-Tracy',
  'Trois-Rivières',
  'Val-d’Or',
  'Waskaganish',
  'Batoche',
  'Cumberland House',
  'Estevan',
  'Flin Flon',
  'Moose Jaw',
  'Prince Albert',
  'Regina',
  'Saskatoon',
  'Uranium City',
  'Dawson',
  'Watson Lake',
  'Whitehorse',]
export const AlbertaVilles=['Banff',
  'Brooks',
  'Calgary',
  'Edmonton',
  'Fort McMurray',
  'Grande Prairie',
  'Jasper',
  'Lake Louise',
  'Lethbridge',
  'Medicine Hat',
  'Red Deer',
  'Saint Albert',]
export const BritishColumbiaVilles=['Barkerville',
  'Burnaby',
  'Campbell River',
  'Chilliwack',
  'Courtenay',
  'Cranbrook',
  'Dawson Creek',
  'Delta',
  'Esquimalt',
  'Fort Saint James',
  'Fort Saint John',
  'Hope',
  'Kamloops',
  'Kelowna',
  'Kimberley',
  'Kitimat',
  'Langley',
  'Nanaimo',
  'Nelson',
  'New Westminster',
  'North Vancouver',
  'Oak Bay',
  'Penticton',
  'Powell River',
  'Prince George',
  'Prince Rupert',
  'Quesnel',
  'Revelstoke',
  'Rossland',
  'Trail',
  'Vancouver',
  'Vernon',
  'Victoria',
  'West Vancouver',
  'White Rock',
  'Advertisement',
  ]
export const ManitobaVilles=['Brandon',
  'Churchill',
  'Dauphin',
  'Flin Flon',
  'Kildonan',
  'Saint Boniface',
  'Swan River',
  'Thompson',
  'Winnipeg',
  'York Factory',]
export const NewBrunswickVilles=['Bathurst',
  'Caraquet',
  'Dalhousie',
  'Fredericton',
  'Miramichi',
  'Moncton',
  'Saint John',]
export const NewfoundlandLabradorVilles=['Argentia',
  'Bonavista',
  'Channel-Port aux Basques',
  'Corner Brook',
  'Ferryland',
  'Gander',
  'Grand Falls–Windsor',
  'Happy Valley–Goose Bay',
  'Harbour Grace',
  'Labrador City',
  'Placentia',
  'Saint Anthony',
  'St. John`s',
  'Wabana',
  'Advertisement',]
export const NorthwestTerritoriesVilles=['Fort Smith',
  'Hay River',
  'Inuvik',
  'Tuktoyaktuk',
  'Yellowknife',]
export const NovaScotiaVilles=['Baddeck',
  'Digby',
  'Glace Bay',
  'Halifax',
  'Liverpool',
  'Louisbourg',
  'Lunenburg',
  'Pictou',
  'Port Hawkesbury',
  'Springhill',
  'Sydney',
  'Yarmouth',]
export const NunavutVilles=['Iqaluit',]
export const OntarioVilles=['Bancroft',
  'Barrie',
  'Belleville',
  'Brampton',
  'Brantford',
  'Brockville',
  'Burlington',
  'Cambridge',
  'Chatham',
  'Chatham-Kent',
  'Cornwall',
  'Elliot Lake',
  'Etobicoke',
  'Fort Erie',
  'Fort Frances',
  'Gananoque',
  'Guelph',
  'Hamilton',
  'Iroquois Falls',
  'Kapuskasing',
  'Kawartha Lakes',
  'Kenora',
  'Kingston',
  'Kirkland Lake',
  'Kitchener',
  'Laurentian Hills',
  'London',
  'Midland',
  'Mississauga',
  'Moose Factory',
  'Moosonee',
  'Niagara Falls',
  'Niagara-on-the-Lake',
  'North Bay',
  'North York',
  'Oakville',
  'Orillia',
  'Oshawa',
  'Ottawa',
  'Parry Sound',
  'Perth',
  'Peterborough',
  'Picton',
  'Port Colborne',
  'Saint Catharines',
  'Saint Thomas',
  'Sarnia-Clearwater',
  'Sault Sainte Marie',
  'Scarborough',
  'Simcoe',
  'Stratford',
  'Sudbury',
  'Temiskaming Shores',
  'Thorold',
  'Thunder Bay',
  'Timmins',
  'Toronto',
  'Trenton',
  'Waterloo',
  'Welland',
  'West Nipissing',
  'Windsor',
  'Woodstock',
  'York',]
export const PrinceEdwardIslandVilles=['Borden',
  'Cavendish',
  'Charlottetown',
  'Souris',
  'Summerside',]
export const QuebecVilles=['Asbestos',
  'Baie-Comeau',
  'Beloeil',
  'Cap-de-la-Madeleine',
  'Chambly',
  'Charlesbourg',
  'Châteauguay',
  'Chibougamau',
  'Côte-Saint-Luc',
  'Dorval',
  'Gaspé',
  'Gatineau',
  'Granby',
  'Havre-Saint-Pierre',
  'Hull',
  'Jonquière',
  'Kuujjuaq',
  'La Salle',
  'La Tuque',
  'Lachine',
  'Laval',
  'Lévis',
  'Longueuil',
  'Magog',
  'Matane',
  'Montreal',
  'Montréal-Nord',
  'Percé',
  'Port-Cartier',
  'Quebec',
  'Rimouski',
  'Rouyn-Noranda',
  'Saguenay',
  'Saint-Eustache',
  'Saint-Hubert',
  'Sainte-Anne-de-Beaupré',
  'Sainte-Foy',
  'Sainte-Thérèse',
  'Sept-Îles',
  'Sherbrooke',
  'Sorel-Tracy',
  'Terrebonne',
  'Trois-Rivières',
  'Val-d’Or',
  'Waskaganish'
  ]
export const SaskatchewanVilles=['Batoche',
  'Cumberland House',
  'Estevan',
  'Flin Flon',
  'Moose Jaw',
  'Prince Albert',
  'Regina',
  'Saskatoon',
  'Uranium City',]
export const YukonVilles=['Dawson',
  'Watson Lake',
  'Whitehorse',]
