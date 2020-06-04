//
// ===== File globals.ts    
//
'use strict'; // with strict mode, we cannot, for example use undeclared variables

export const adServer: string="https://cts.sosprestige.com" //"https://cts.sosprestige.com";//"https://192.168.0.131"; // adresse de server java - spring
export const host: string=adServer+":8080"; // adresse de server avec :8080
export const hostUserInfo: string=host+"/users/"; // adresse de server avec  /users/
export const emailPrincipal: string = "cts.solution.transport@gmail.com"; // email de cts.solution.transport
export const telPrincipal: string = "5147283785"; // cellphone de cts.solution.transport
export const version: string="1.0.0"; 
export const camionTypes = [
    { id: 1, name: 'TiltNLoad6Roues' },
    { id: 2, name: 'TiltNLoad16Roues' },
    { id: 3, name: 'Landoll' },
    { id: 4, name: 'Van/DryBox' },
    { id: 5, name: 'FlatBed' },
    { id: 6, name: 'RackAndTarp' },
    { id: 7, name: 'Floats' },
    { id: 8, name: 'Reefer' },
    { id: 9, name: 'StepDeck' },
    { id: 10, name: 'Container' },
    { id: 11, name: 'LowBoy/RGN' },
    { id: 12, name: 'StraightTruck' },
    { id: 13, name: 'DoubleDrop' },
    { id: 14, name: 'SuperB' },
    { id: 15, name: 'PowerOnly' },
    { id: 16, name: 'CurtainSide' },
    { id: 17, name: 'RollTiteTrailer' },
    { id: 18, name: 'DumpTrailer' },
    { id: 19, name: 'Other' },
  ];


/*/
    { id: 20, name: 'Air Ride' },
    { id: 21, name: 'Chains' },
    { id: 22, name: 'Tarps' },
    { id: 23, name: 'Team' },
    { id: 24, name: 'Heat' },
    { id: 25, name: 'B-Train' },
    { id: 26, name: 'HazMat' },
    { id: 27, name: 'Vented' },
    { id: 28, name: 'Talgate' },
    { id: 29, name: 'Expedite' },
    { id: 30, name: 'Blanket Wrap' },
    { id: 31, name: 'Insulated' },
    { id: 32, name: 'Tri-Axle' },
    { id: 33, name: 'Frozen' },
    { id: 34, name: 'Inbond' },
    { id: 35, name: 'Other' }
  //*/
export const optionTypes = [
  { id: 1, name: 'Air Ride' },
  { id: 2, name: 'Chains' },
  { id: 3, name: 'Tarps' },
  { id: 4, name: 'Team' },
  { id: 5, name: 'Heat' },
  { id: 6, name: 'B-Train' },
  { id: 7, name: 'HazMat' },
  { id: 8, name: 'Vented' },
  { id: 9, name: 'Talgate' },
  { id: 10, name: 'Expedite' },
  { id: 11, name: 'Blanket Wrap' },
  { id: 12, name: 'Insulated' },
  { id: 13, name: 'Tri-Axle' },
  { id: 14, name: 'Frozen' },
  { id: 15, name: 'Inbond' },
  { id: 16, name: 'Other' }
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
  

  export const d2cmediaacura = new Array();
  d2cmediaacura.push(new Array('1.7 El','Acura','2005','2005','1','Auto',''));
  d2cmediaacura.push(new Array('CSX','Acura','2006','2010','7','Auto',''));
  d2cmediaacura.push(new Array('ILX','Acura','2013','2019','76','Auto',''));
  d2cmediaacura.push(new Array('MDX','Acura','2003','2020','140','VUS',''));
  d2cmediaacura.push(new Array('NSX','Acura','2017','2017','1','Auto',''));
  d2cmediaacura.push(new Array('RDX','Acura','2007','2020','158','VUS',''));
  d2cmediaacura.push(new Array('RLX','Acura','2017','2018','2','Auto',''));
  d2cmediaacura.push(new Array('TL','Acura','2006','2014','27','Auto',''));
  d2cmediaacura.push(new Array('Tl Tech','Acura','2012','2013','2','Auto',''));
  d2cmediaacura.push(new Array('TLX','Acura','2015','2020','174','Auto',''));
  d2cmediaacura.push(new Array('TSX','Acura','2009','2012','6','Auto',''));

  export const d2cmediaalfa_romeo = new Array();
  d2cmediaalfa_romeo.push(new Array('4c spider','Alfa Romeo','2019','2019','1','Auto',''));
  d2cmediaalfa_romeo.push(new Array('Giulia','Alfa Romeo','2017','2019','8','Auto',''));
  d2cmediaalfa_romeo.push(new Array('Spider','Alfa Romeo','1996','1996','1','Auto',''));
  d2cmediaalfa_romeo.push(new Array('Stelvio','Alfa Romeo','2018','2019','16','VUS',''));
  
  export const d2cmediaaston_martin = new Array();
  d2cmediaaston_martin.push(new Array('Rapide','Aston Martin','2015','2015','1','Auto',''));
  
  export const d2cmediaaudi = new Array();
  d2cmediaaudi.push(new Array('A3','Audi','2006','2019','57','Auto',''));
  d2cmediaaudi.push(new Array('A3','Audi','2018','2018','1','Electrique',''));
  d2cmediaaudi.push(new Array('A4','Audi','2003','2019','181','Auto',''));
  d2cmediaaudi.push(new Array('A5','Audi','2009','2019','70','Auto',''));
  d2cmediaaudi.push(new Array('A6','Audi','2004','2019','20','Auto',''));
  d2cmediaaudi.push(new Array('A7','Audi','2012','2019','16','Auto',''));
  d2cmediaaudi.push(new Array('A8','Audi','2015','2019','3','Auto',''));
  d2cmediaaudi.push(new Array('Allroad','Audi','2015','2019','10','Auto',''));
  d2cmediaaudi.push(new Array('e-tron','Audi','2019','2019','1','Electrique',''));
  d2cmediaaudi.push(new Array('e-tron','Audi','2019','2019','1','VUS',''));
  d2cmediaaudi.push(new Array('Q3','Audi','2014','2019','48','VUS',''));
  d2cmediaaudi.push(new Array('Q5','Audi','2010','2019','132','VUS',''));
  d2cmediaaudi.push(new Array('Q7','Audi','2008','2019','45','VUS',''));
  d2cmediaaudi.push(new Array('R8','Audi','2011','2017','10','Auto',''));
  d2cmediaaudi.push(new Array('RS 5','Audi','2013','2019','5','Auto',''));
  d2cmediaaudi.push(new Array('RS 7','Audi','2014','2018','3','Auto',''));
  d2cmediaaudi.push(new Array('S3','Audi','2015','2016','6','Auto',''));
  d2cmediaaudi.push(new Array('S4','Audi','2005','2018','13','Auto',''));
  d2cmediaaudi.push(new Array('S5','Audi','2011','2018','11','Auto',''));
  d2cmediaaudi.push(new Array('S6','Audi','2007','2007','1','Auto',''));
  d2cmediaaudi.push(new Array('SQ5','Audi','2015','2019','9','VUS',''));
  d2cmediaaudi.push(new Array('TT','Audi','2008','2019','11','Auto',''));
  d2cmediaaudi.push(new Array('TT RS','Audi','2012','2018','3','Auto',''));
  d2cmediaaudi.push(new Array('TTS','Audi','2016','2017','5','Auto',''));
  
  export const d2cmediabentley = new Array();
  d2cmediabentley.push(new Array('Continental','Bentley','2007','2007','1','Auto',''));
  d2cmediabentley.push(new Array('Flying Spur','Bentley','2007','2007','1','Auto',''));

  export const d2cmediabmw = new Array();
  d2cmediabmw.push(new Array('1 Series','BMW','2005','2013','15','Auto','1 Series'));
  d2cmediabmw.push(new Array('128','BMW','2008','2013','5','Auto','1 Series'));
  d2cmediabmw.push(new Array('135','BMW','2009','2009','1','Auto','1 Series'));
  d2cmediabmw.push(new Array('2 Series','BMW','2014','2019','17','Auto','2 Series'));
  d2cmediabmw.push(new Array('228i','BMW','2015','2016','5','Auto','2 Series'));
  d2cmediabmw.push(new Array('230i','BMW','2017','2020','12','Auto',''));
  d2cmediabmw.push(new Array('3 Series','BMW','2004','2020','134','Auto','3 Series'));
  d2cmediabmw.push(new Array('320','BMW','2013','2017','42','Auto','3 Series'));
  d2cmediabmw.push(new Array('323','BMW','1998','2011','7','Auto','3 Series'));
  d2cmediabmw.push(new Array('325','BMW','2005','2005','1','Auto','3 Series'));
  d2cmediabmw.push(new Array('328','BMW','2007','2018','28','Auto','3 Series'));
  d2cmediabmw.push(new Array('328i','BMW','2007','2016','36','Auto','3 Series'));
  d2cmediabmw.push(new Array('330','BMW','2017','2020','27','Auto','3 Series'));
  d2cmediabmw.push(new Array('335','BMW','2008','2015','12','Auto','3 Series'));
  d2cmediabmw.push(new Array('340i','BMW','2016','2018','6','Auto','3 Series'));
  d2cmediabmw.push(new Array('4 Series','BMW','2014','2019','30','Auto','4 Series'));
  d2cmediabmw.push(new Array('428i','BMW','2014','2016','10','Auto','4 Series'));
  d2cmediabmw.push(new Array('430i','BMW','2017','2020','3','Auto','4 Series'));
  d2cmediabmw.push(new Array('435i','BMW','2016','2016','4','Auto','4 Series'));
  d2cmediabmw.push(new Array('440','BMW','2019','2019','7','Auto','4 Series'));
  d2cmediabmw.push(new Array('5 Series','BMW','2006','2018','21','Auto','5 Series'));
  d2cmediabmw.push(new Array('525','BMW','2006','2006','1','Auto','5 Series'));
  d2cmediabmw.push(new Array('528','BMW','2008','2016','5','Auto','5 Series'));
  d2cmediabmw.push(new Array('530','BMW','2004','2020','9','Auto','5 Series'));
  d2cmediabmw.push(new Array('530','BMW','2019','2019','2','Electrique','5 Series'));
  d2cmediabmw.push(new Array('535','BMW','2009','2016','5','Auto','5 Series'));
  d2cmediabmw.push(new Array('540','BMW','2018','2020','3','Auto','5 Series'));
  d2cmediabmw.push(new Array('550','BMW','2011','2016','4','Auto','5 Series'));
  d2cmediabmw.push(new Array('6 Series','BMW','2006','2015','4','Auto','6 Series'));
  d2cmediabmw.push(new Array('640','BMW','2019','2019','1','Auto',''));
  d2cmediabmw.push(new Array('650','BMW','2012','2019','4','Auto','6 Series'));
  d2cmediabmw.push(new Array('7 Series','BMW','2006','2017','7','Auto','7 Series'));
  d2cmediabmw.push(new Array('750','BMW','2012','2019','4','Auto','7 Series'));
  d2cmediabmw.push(new Array('I3','BMW','2014','2016','5','Electrique',''));
  d2cmediabmw.push(new Array('M','BMW','2020','2020','2','Auto','M Series'));
  d2cmediabmw.push(new Array('M2','BMW','2016','2020','7','Auto','M Series'));
  d2cmediabmw.push(new Array('M235i','BMW','2016','2016','1','Auto','M Series'));
  d2cmediabmw.push(new Array('M240i','BMW','2020','2020','1','Auto','M Series'));
  d2cmediabmw.push(new Array('M3','BMW','2002','2020','16','Auto','M Series'));
  d2cmediabmw.push(new Array('M4','BMW','2016','2020','6','Auto','M Series'));
  d2cmediabmw.push(new Array('M5','BMW','2006','2019','4','Auto','M Series'));
  d2cmediabmw.push(new Array('M6','BMW','2013','2017','2','Auto','M Series'));
  d2cmediabmw.push(new Array('X1','BMW','2012','2020','117','VUS','X Series'));
  d2cmediabmw.push(new Array('X2','BMW','2018','2019','13','VUS','X Series'));
  d2cmediabmw.push(new Array('X3','BMW','2004','2020','93','VUS','X Series'));
  d2cmediabmw.push(new Array('X4','BMW','2015','2020','21','VUS','X Series'));
  d2cmediabmw.push(new Array('X5','BMW','2005','2020','69','VUS','X Series'));
  d2cmediabmw.push(new Array('X6','BMW','2008','2019','15','VUS','X Series'));
  d2cmediabmw.push(new Array('X7','BMW','2020','2020','1','Auto',''));
  d2cmediabmw.push(new Array('X7','BMW','2019','2019','4','VUS',''));
  d2cmediabmw.push(new Array('Z3','BMW','1996','2001','4','Auto','Z Series'));
  d2cmediabmw.push(new Array('Z4','BMW','2003','2020','13','Auto','Z Series'));
  
  export const d2cmediabombardier = new Array();
  d2cmediabombardier.push(new Array('Speedster 200','Bombardier','2003','2003','1','Auto',''));

  export const d2cmediabuick = new Array();
  d2cmediabuick.push(new Array('Allure','Buick','2005','2008','5','Auto',''));
  d2cmediabuick.push(new Array('Cascada','Buick','2016','2016','3','Auto',''));
  d2cmediabuick.push(new Array('Enclave','Buick','2011','2020','40','VUS',''));
  d2cmediabuick.push(new Array('Encore','Buick','2013','2020','335','VUS',''));
  d2cmediabuick.push(new Array('Envision','Buick','2016','2020','36','VUS',''));
  d2cmediabuick.push(new Array('LaCrosse','Buick','2010','2019','19','Auto',''));
  d2cmediabuick.push(new Array('LeSabre','Buick','2005','2005','1','Auto',''));
  d2cmediabuick.push(new Array('Lucerne','Buick','2011','2011','1','Auto',''));
  d2cmediabuick.push(new Array('Regal','Buick','2011','2019','21','Auto',''));
  d2cmediabuick.push(new Array('RendezVous','Buick','2006','2007','2','VUS',''));
  d2cmediabuick.push(new Array('Verano','Buick','2012','2017','63','Auto',''));
  
  var d2cmediacadillac = new Array();
  d2cmediacadillac.push(new Array('Ats','Cadillac','2013','2018','67','Auto',''));
  d2cmediacadillac.push(new Array('CT6','Cadillac','2017','2018','2','Auto',''));
  d2cmediacadillac.push(new Array('CTS','Cadillac','2006','2019','30','Auto',''));
  d2cmediacadillac.push(new Array('Cts-v','Cadillac','2009','2009','1','Auto',''));
  d2cmediacadillac.push(new Array('DeVille','Cadillac','2003','2003','1','Auto',''));
  d2cmediacadillac.push(new Array('Eldorado','Cadillac','1966','1966','1','Auto',''));
  d2cmediacadillac.push(new Array('Escalade','Cadillac','2002','2020','27','VUS',''));
  d2cmediacadillac.push(new Array('Sixty Special','Cadillac','1993','1993','1','Auto',''));
  d2cmediacadillac.push(new Array('SRX','Cadillac','2006','2016','49','VUS',''));
  d2cmediacadillac.push(new Array('STS','Cadillac','2006','2007','2','Auto',''));
  d2cmediacadillac.push(new Array('XT4','Cadillac','2019','2020','19','Auto',''));
  d2cmediacadillac.push(new Array('XT4','Cadillac','2019','2020','20','VUS',''));
  d2cmediacadillac.push(new Array('XT5','Cadillac','2017','2020','48','VUS',''));
  d2cmediacadillac.push(new Array('XT6','Cadillac','2020','2020','3','Auto',''));
  d2cmediacadillac.push(new Array('XT6','Cadillac','2020','2020','2','VUS',''));
  d2cmediacadillac.push(new Array('XTS','Cadillac','2013','2019','10','Auto',''));
  
  export const d2cmediacampagna = new Array();
  d2cmediacampagna.push(new Array('T-rex','Campagna','2016','2016','1','Auto',''));
  d2cmediacampagna.push(new Array('V13r','Campagna','2012','2012','1','Auto',''));
  
  export const d2cmediachevrolet = new Array();
  d2cmediachevrolet.push(new Array('1500','Chevrolet','1994','2019','11','Camion',''));
  d2cmediachevrolet.push(new Array('2500','Chevrolet','2010','2018','6','Camion',''));
  d2cmediachevrolet.push(new Array('3500','Chevrolet','2012','2012','1','Camion',''));
  d2cmediachevrolet.push(new Array('Astro','Chevrolet','1998','1998','1','Minivan',''));
  d2cmediachevrolet.push(new Array('Avalanche','Chevrolet','2003','2011','8','Camion',''));
  d2cmediachevrolet.push(new Array('Aveo','Chevrolet','2005','2011','22','Auto',''));
  d2cmediachevrolet.push(new Array('Blazer','Chevrolet','2019','2019','1','Electrique',''));
  d2cmediachevrolet.push(new Array('Blazer','Chevrolet','2019','2020','39','VUS',''));
  d2cmediachevrolet.push(new Array('Bolt','Chevrolet','2019','2019','18','Auto',''));
  d2cmediachevrolet.push(new Array('Bolt','Chevrolet','2017','2019','35','Electrique',''));
  d2cmediachevrolet.push(new Array('Bolt EV','Chevrolet','2019','2019','28','Auto',''));
  d2cmediachevrolet.push(new Array('Bolt EV','Chevrolet','2017','2020','75','Electrique',''));
  d2cmediachevrolet.push(new Array('Camaro','Chevrolet','2010','2020','74','Auto',''));
  d2cmediachevrolet.push(new Array('Camaro','Chevrolet','2018','2018','1','Electrique',''));
  d2cmediachevrolet.push(new Array('Cavalier','Chevrolet','2000','2004','4','Auto',''));
  d2cmediachevrolet.push(new Array('Chevelle','Chevrolet','1972','1972','1','Auto',''));
  d2cmediachevrolet.push(new Array('Cobalt','Chevrolet','2006','2010','17','Auto',''));
  d2cmediachevrolet.push(new Array('Colorado','Chevrolet','2004','2020','117','Camion',''));
  d2cmediachevrolet.push(new Array('Corvette','Chevrolet','1985','2019','65','Auto',''));
  d2cmediachevrolet.push(new Array('Cruze','Chevrolet','2011','2019','437','Auto',''));
  d2cmediachevrolet.push(new Array('C|K 1500','Chevrolet','2016','2016','1','Camion',''));
  d2cmediachevrolet.push(new Array('Epica','Chevrolet','2004','2004','3','Auto',''));
  d2cmediachevrolet.push(new Array('Equinox','Chevrolet','2005','2020','291','VUS',''));
  d2cmediachevrolet.push(new Array('Express','Chevrolet','2005','2020','46','Camion',''));
  d2cmediachevrolet.push(new Array('Express 3500','Chevrolet','2011','2018','6','Camion',''));
  d2cmediachevrolet.push(new Array('G2500','Chevrolet','2018','2018','1','Camion',''));
  d2cmediachevrolet.push(new Array('HHR','Chevrolet','2006','2010','6','Auto',''));
  d2cmediachevrolet.push(new Array('Impala','Chevrolet','2003','2019','48','Auto',''));
  d2cmediachevrolet.push(new Array('K1500 Silverado','Chevrolet','2018','2020','102','Camion',''));
  d2cmediachevrolet.push(new Array('Malibu','Chevrolet','2002','2019','121','Auto',''));
  d2cmediachevrolet.push(new Array('Optra5','Chevrolet','2007','2007','1','Auto',''));
  d2cmediachevrolet.push(new Array('Orlando','Chevrolet','2012','2014','18','Minivan',''));
  d2cmediachevrolet.push(new Array('S-10','Chevrolet','2000','2003','2','Camion',''));
  d2cmediachevrolet.push(new Array('Silverado','Chevrolet','2015','2020','16','Camion',''));
  d2cmediachevrolet.push(new Array('Silverado 1500','Chevrolet','2003','2020','311','Camion',''));
  d2cmediachevrolet.push(new Array('Silverado 2500','Chevrolet','2004','2020','41','Camion',''));
  d2cmediachevrolet.push(new Array('Silverado 3500','Chevrolet','2000','2001','2','Camion',''));
  d2cmediachevrolet.push(new Array('Sonic','Chevrolet','2012','2018','82','Auto',''));
  d2cmediachevrolet.push(new Array('Spark','Chevrolet','2013','2020','272','Auto',''));
  d2cmediachevrolet.push(new Array('Spark','Chevrolet','2014','2016','5','Electrique',''));
  d2cmediachevrolet.push(new Array('Spark EV','Chevrolet','2015','2016','2','Auto',''));
  d2cmediachevrolet.push(new Array('Spark EV','Chevrolet','2014','2016','17','Electrique',''));
  d2cmediachevrolet.push(new Array('Suburban','Chevrolet','2007','2020','16','VUS',''));
  d2cmediachevrolet.push(new Array('Tahoe','Chevrolet','2014','2020','16','VUS',''));
  d2cmediachevrolet.push(new Array('Tracker','Chevrolet','2002','2004','5','VUS',''));
  d2cmediachevrolet.push(new Array('TrailBlazer','Chevrolet','2002','2008','4','VUS',''));
  d2cmediachevrolet.push(new Array('Traverse','Chevrolet','2009','2020','66','VUS',''));
  d2cmediachevrolet.push(new Array('Trax','Chevrolet','2013','2020','140','VUS',''));
  d2cmediachevrolet.push(new Array('Uplander','Chevrolet','2007','2008','3','Minivan',''));
  d2cmediachevrolet.push(new Array('Volt','Chevrolet','2012','2019','74','Auto',''));
  d2cmediachevrolet.push(new Array('Volt','Chevrolet','2012','2019','57','Electrique',''));
  
  export const d2cmediachrysler = new Array();
  d2cmediachrysler.push(new Array('200','Chrysler','2011','2016','86','Auto',''));
  d2cmediachrysler.push(new Array('300','Chrysler','2005','2019','67','Auto',''));
  d2cmediachrysler.push(new Array('300C','Chrysler','2007','2007','1','Auto',''));
  d2cmediachrysler.push(new Array('Aspen','Chrysler','2008','2008','1','VUS',''));
  d2cmediachrysler.push(new Array('Concorde','Chrysler','2003','2004','2','Auto',''));
  d2cmediachrysler.push(new Array('Crossfire','Chrysler','2005','2005','2','Auto',''));
  d2cmediachrysler.push(new Array('LeBarron','Chrysler','1982','1989','2','Auto',''));
  d2cmediachrysler.push(new Array('Neon','Chrysler','2001','2002','2','Auto',''));
  d2cmediachrysler.push(new Array('New Yorker','Chrysler','1974','1979','2','Auto',''));
  d2cmediachrysler.push(new Array('Pacifica','Chrysler','2017','2020','39','Minivan',''));
  d2cmediachrysler.push(new Array('Pacifica Hybride','Chrysler','2018','2018','1','Minivan',''));
  d2cmediachrysler.push(new Array('PT Cruiser','Chrysler','2002','2007','6','Auto',''));
  d2cmediachrysler.push(new Array('Sebring','Chrysler','2004','2010','28','Auto',''));
  d2cmediachrysler.push(new Array('Town & Country','Chrysler','1950','2016','31','Minivan',''));
  
  export const d2cmediadodge = new Array();
  d2cmediadodge.push(new Array('200','Dodge','2004','2004','1','Auto',''));
  d2cmediadodge.push(new Array('Avenger','Dodge','2008','2014','15','Auto',''));
  d2cmediadodge.push(new Array('Caliber','Dodge','2007','2012','15','Auto',''));
  d2cmediadodge.push(new Array('Caravan','Dodge','2010','2015','2','Minivan',''));
  d2cmediadodge.push(new Array('Challenger','Dodge','2008','2019','34','Auto',''));
  d2cmediadodge.push(new Array('Charger','Dodge','2006','2019','51','Auto',''));
  d2cmediadodge.push(new Array('Dakota','Dodge','2001','2010','15','Camion',''));
  d2cmediadodge.push(new Array('Dart','Dodge','2013','2016','30','Auto',''));
  d2cmediadodge.push(new Array('Durango','Dodge','2000','2020','73','VUS',''));
  d2cmediadodge.push(new Array('Grand Caravan','Dodge','2006','2019','557','Minivan',''));
  d2cmediadodge.push(new Array('Intrepid','Dodge','1996','1996','1','Auto',''));
  d2cmediadodge.push(new Array('Journey','Dodge','2009','2019','231','VUS',''));
  d2cmediadodge.push(new Array('Magnum','Dodge','2006','2006','1','Auto',''));
  d2cmediadodge.push(new Array('Nitro','Dodge','2007','2011','7','VUS',''));
  d2cmediadodge.push(new Array('RAM 1500','Dodge','2003','2017','43','Camion',''));
  d2cmediadodge.push(new Array('RAM 2500','Dodge','2006','2017','5','Camion',''));
  d2cmediadodge.push(new Array('RAM 3500','Dodge','1997','1998','2','Camion',''));
  d2cmediadodge.push(new Array('Sprinter','Dodge','2006','2008','3','Camion',''));
  d2cmediadodge.push(new Array('SX 2.0','Dodge','2005','2005','1','Auto',''));
  d2cmediadodge.push(new Array('Viper','Dodge','2000','2005','2','Auto',''));
  
  export const d2cmediaferrari = new Array();
  d2cmediaferrari.push(new Array('F430','Ferrari','2006','2007','2','Auto',''));
  
  export const d2cmediafiat = new Array();
  d2cmediafiat.push(new Array('124 Spider','Fiat','2017','2019','19','Auto',''));
  d2cmediafiat.push(new Array('500','Fiat','2012','2017','91','Auto',''));
  d2cmediafiat.push(new Array('500C','Fiat','2012','2016','16','Auto',''));
  d2cmediafiat.push(new Array('500L','Fiat','2014','2015','27','Auto',''));
  d2cmediafiat.push(new Array('500X','Fiat','2016','2017','12','Auto',''));
  d2cmediafiat.push(new Array('Spider','Fiat','2019','2019','1','Auto',''));
  
  export const d2cmediafisker = new Array();
  d2cmediafisker.push(new Array('Karma','Fisker','2012','2012','1','Auto',''));
  
  var d2cmediaford = new Array();
  d2cmediaford.push(new Array('500','Ford','2017','2019','4','Auto',''));
  d2cmediaford.push(new Array('c-max','Ford','2013','2017','21','Auto',''));
  d2cmediaford.push(new Array('c-max','Ford','2015','2017','3','Electrique',''));
  d2cmediaford.push(new Array('Cube','Ford','2018','2018','2','Camion',''));
  d2cmediaford.push(new Array('E-250','Ford','2010','2018','3','Camion',''));
  d2cmediaford.push(new Array('E-350','Ford','2006','2016','4','Camion',''));
  d2cmediaford.push(new Array('E-450','Ford','1987','2019','9','Camion',''));
  d2cmediaford.push(new Array('E-series','Ford','2019','2019','2','Camion',''));
  d2cmediaford.push(new Array('Econoline','Ford','2006','2018','24','Camion',''));
  d2cmediaford.push(new Array('EcoSport','Ford','2018','2020','121','VUS',''));
  d2cmediaford.push(new Array('Edge','Ford','2007','2019','348','VUS',''));
  d2cmediaford.push(new Array('Escape','Ford','2005','2020','954','VUS',''));
  d2cmediaford.push(new Array('Escape Hybride','Ford','2005','2005','1','VUS',''));
  d2cmediaford.push(new Array('Expedition','Ford','2007','2019','19','VUS',''));
  d2cmediaford.push(new Array('Explorer','Ford','2005','2020','164','VUS',''));
  d2cmediaford.push(new Array('Explorer Sport Trac','Ford','2007','2019','4','Camion',''));
  d2cmediaford.push(new Array('F-150','Ford','1998','2020','1,178','Camion',''));
  d2cmediaford.push(new Array('F-250','Ford','1991','2019','146','Camion',''));
  d2cmediaford.push(new Array('F-350','Ford','1995','2020','37','Camion',''));
  d2cmediaford.push(new Array('F-450','Ford','1999','2019','15','Camion',''));
  d2cmediaford.push(new Array('F-550','Ford','2014','2019','33','Camion',''));
  d2cmediaford.push(new Array('Fiesta','Ford','2011','2018','117','Auto',''));
  d2cmediaford.push(new Array('Five Hundred','Ford','2005','2006','4','Auto',''));
  d2cmediaford.push(new Array('Flex','Ford','2009','2019','31','VUS',''));
  d2cmediaford.push(new Array('Focus','Ford','2005','2018','406','Auto',''));
  d2cmediaford.push(new Array('Focus','Ford','2012','2018','14','Electrique',''));
  d2cmediaford.push(new Array('fourgon','Ford','2002','2020','16','Camion',''));
  d2cmediaford.push(new Array('Freestar','Ford','2006','2006','1','Minivan',''));
  d2cmediaford.push(new Array('Freestyle','Ford','2005','2007','4','Auto',''));
  d2cmediaford.push(new Array('Fusion','Ford','2012','2012','1','Accidente',''));
  d2cmediaford.push(new Array('Fusion','Ford','2006','2020','253','Auto',''));
  d2cmediaford.push(new Array('Fusion','Ford','2014','2018','4','Electrique',''));
  d2cmediaford.push(new Array('Fusion Hybride','Ford','2019','2019','3','Auto',''));
  d2cmediaford.push(new Array('Galaxie 500','Ford','1962','1962','1','Auto',''));
  d2cmediaford.push(new Array('Mustang','Ford','1988','2020','261','Auto',''));
  d2cmediaford.push(new Array('Police Interceptor','Ford','2008','2008','1','Auto',''));
  d2cmediaford.push(new Array('Ranger','Ford','2003','2019','100','Camion',''));
  d2cmediaford.push(new Array('Raptor','Ford','2018','2018','1','Camion',''));
  d2cmediaford.push(new Array('Shelby GT500','Ford','2009','2009','1','Auto',''));
  d2cmediaford.push(new Array('Super Duty','Ford','2015','2015','1','Camion',''));
  d2cmediaford.push(new Array('Taurus','Ford','2001','2019','20','Auto',''));
  d2cmediaford.push(new Array('Thunderbird','Ford','1978','2002','5','Auto',''));
  d2cmediaford.push(new Array('Transit','Ford','2013','2020','221','Camion',''));
  d2cmediaford.push(new Array('Transit Connect','Ford','2010','2020','35','Camion',''));
  
  export const d2cmediagenesis = new Array();
  d2cmediagenesis.push(new Array('G70','Genesis','2019','2019','1','Auto',''));
  d2cmediagenesis.push(new Array('G80','Genesis','2017','2017','2','Auto',''));
  
  export const d2cmediagmc = new Array();
  d2cmediagmc.push(new Array('1500','GMC','2000','2020','13','Camion',''));
  d2cmediagmc.push(new Array('2500','GMC','2008','2019','21','Camion',''));
  d2cmediagmc.push(new Array('3500','GMC','2008','2019','7','Camion',''));
  d2cmediagmc.push(new Array('4500','GMC','2012','2012','1','Auto',''));
  d2cmediagmc.push(new Array('Acadia','GMC','2008','2020','78','VUS',''));
  d2cmediagmc.push(new Array('C3500','GMC','2017','2017','1','Camion',''));
  d2cmediagmc.push(new Array('Canyon','GMC','2007','2020','65','Camion',''));
  d2cmediagmc.push(new Array('Cube','GMC','2015','2018','2','Camion',''));
  d2cmediagmc.push(new Array('Envoy','GMC','2005','2005','1','VUS',''));
  d2cmediagmc.push(new Array('G2500','GMC','2017','2017','1','Camion',''));
  d2cmediagmc.push(new Array('Jimmy','GMC','2005','2005','1','VUS',''));
  d2cmediagmc.push(new Array('K1500 Sierra','GMC','2017','2020','117','Camion',''));
  d2cmediagmc.push(new Array('Savana','GMC','2008','2020','49','Camion',''));
  d2cmediagmc.push(new Array('Savana Cargo','GMC','2003','2019','35','Camion',''));
  d2cmediagmc.push(new Array('Savana Passenger','GMC','2010','2016','2','Camion',''));
  d2cmediagmc.push(new Array('Sierra','GMC','2006','2020','33','Camion',''));
  d2cmediagmc.push(new Array('Sierra 1500','GMC','2004','2020','412','Camion',''));
  d2cmediagmc.push(new Array('Sierra 2500','GMC','2006','2020','66','Camion',''));
  d2cmediagmc.push(new Array('Sierra 3500','GMC','1993','2020','9','Camion',''));
  d2cmediagmc.push(new Array('Terrain','GMC','2010','2020','209','VUS',''));
  d2cmediagmc.push(new Array('Yukon','GMC','2015','2020','35','VUS',''));
  
  export const d2cmediaharley_davidson = new Array();
  d2cmediaharley_davidson.push(new Array('Autre','Harley Davidson','2004','2013','2','Auto',''));
  d2cmediaharley_davidson.push(new Array('Fatboy','Harley Davidson','2010','2014','2','Auto',''));
  d2cmediaharley_davidson.push(new Array('Flhtcu Ultra Classic','Harley Davidson','2005','2013','3','Auto',''));
  d2cmediaharley_davidson.push(new Array('Flhx','Harley Davidson','2007','2017','4','Auto',''));
  d2cmediaharley_davidson.push(new Array('Fltri Road Glide','Harley Davidson','2018','2018','1','Auto',''));
  d2cmediaharley_davidson.push(new Array('Sportster','Harley Davidson','2015','2015','1','Auto',''));
  
  export const d2cmediahino = new Array();
  d2cmediahino.push(new Array('195','Hino','2015','2016','3','Camion',''));
  d2cmediahino.push(new Array('258','Hino','2007','2007','1','Camion',''));
  
  export const d2cmediahonda = new Array();
  d2cmediahonda.push(new Array('Accord','Honda','2001','2019','208','Auto',''));
  d2cmediahonda.push(new Array('Civic','Honda','1997','2020','1,397','Auto',''));
  d2cmediahonda.push(new Array('Clarity','Honda','2018','2018','1','Electrique',''));
  d2cmediahonda.push(new Array('CR-V','Honda','2001','2019','829','VUS',''));
  d2cmediahonda.push(new Array('CR-Z','Honda','2014','2014','1','Auto',''));
  d2cmediahonda.push(new Array('Crosstour','Honda','2010','2012','2','Auto',''));
  d2cmediahonda.push(new Array('Fit','Honda','2007','2019','96','Auto',''));
  d2cmediahonda.push(new Array('Goldwing','Honda','2008','2008','1','Auto',''));
  d2cmediahonda.push(new Array('HR-V','Honda','2016','2019','95','VUS',''));
  d2cmediahonda.push(new Array('Insight','Honda','2019','2019','2','Auto',''));
  d2cmediahonda.push(new Array('Odyssey','Honda','2000','2020','84','Minivan',''));
  d2cmediahonda.push(new Array('Passport','Honda','2019','2019','9','VUS',''));
  d2cmediahonda.push(new Array('Pilot','Honda','2003','2020','81','VUS',''));
  d2cmediahonda.push(new Array('Ridgeline','Honda','2009','2019','34','Camion',''));
  d2cmediahonda.push(new Array('S2000','Honda','2003','2009','3','Auto',''));
  d2cmediahonda.push(new Array('TRX','Honda','2014','2014','1','Auto',''));
  d2cmediahonda.push(new Array('VFR800','Honda','2005','2005','1','Auto',''));
  
  export const d2cmediahummer = new Array();
  d2cmediahummer.push(new Array('H3','Hummer','2007','2007','2','VUS',''));
  
  var d2cmediahyundai = new Array();
  d2cmediahyundai.push(new Array('Accent','Hyundai','2002','2020','352','Auto',''));
  d2cmediahyundai.push(new Array('Elantra','Hyundai','2007','2020','957','Auto',''));
  d2cmediahyundai.push(new Array('Elantra GT','Hyundai','2013','2020','115','Auto',''));
  d2cmediahyundai.push(new Array('Elantra Touring','Hyundai','2009','2012','26','Auto',''));
  d2cmediahyundai.push(new Array('Equus','Hyundai','2011','2011','1','Auto',''));
  d2cmediahyundai.push(new Array('Genesis','Hyundai','2010','2016','59','Auto',''));
  d2cmediahyundai.push(new Array('Ioniq','Hyundai','2017','2019','18','Auto',''));
  d2cmediahyundai.push(new Array('Ioniq','Hyundai','2018','2019','6','Electrique',''));
  d2cmediahyundai.push(new Array('Kona','Hyundai','2019','2019','6','Electrique',''));
  d2cmediahyundai.push(new Array('Kona','Hyundai','2018','2020','74','VUS',''));
  d2cmediahyundai.push(new Array('Palisade','Hyundai','2020','2020','12','Auto',''));
  d2cmediahyundai.push(new Array('Palisade','Hyundai','2020','2020','13','VUS',''));
  d2cmediahyundai.push(new Array('Pony','Hyundai','1986','1986','1','Auto',''));
  d2cmediahyundai.push(new Array('Santa Fe','Hyundai','2006','2020','304','VUS',''));
  d2cmediahyundai.push(new Array('Santa Fe Sport','Hyundai','2010','2019','216','VUS',''));
  d2cmediahyundai.push(new Array('Santa Fe XL','Hyundai','2013','2019','94','VUS',''));
  d2cmediahyundai.push(new Array('Sonata','Hyundai','2003','2019','199','Auto',''));
  d2cmediahyundai.push(new Array('Sonata Hybride','Hyundai','2012','2019','20','Auto',''));
  d2cmediahyundai.push(new Array('Tiburon','Hyundai','2007','2007','1','Auto',''));
  d2cmediahyundai.push(new Array('Tucson','Hyundai','2005','2020','455','VUS',''));
  d2cmediahyundai.push(new Array('Veloster','Hyundai','2012','2020','97','Auto',''));
  d2cmediahyundai.push(new Array('Veracruz','Hyundai','2009','2010','2','VUS',''));
  
  export const d2cmediainfiniti = new Array();
  d2cmediainfiniti.push(new Array('EX35','Infiniti','2008','2012','10','VUS',''));
  d2cmediainfiniti.push(new Array('EX37','Infiniti','2013','2013','2','VUS',''));
  d2cmediainfiniti.push(new Array('FX35','Infiniti','2006','2012','7','VUS',''));
  d2cmediainfiniti.push(new Array('FX37','Infiniti','2013','2013','1','VUS',''));
  d2cmediainfiniti.push(new Array('FX50','Infiniti','2011','2011','1','VUS',''));
  d2cmediainfiniti.push(new Array('G35','Infiniti','2006','2006','1','Auto',''));
  d2cmediainfiniti.push(new Array('G35X','Infiniti','2008','2008','1','Auto',''));
  d2cmediainfiniti.push(new Array('G37','Infiniti','2008','2013','10','Auto',''));
  d2cmediainfiniti.push(new Array('G37X','Infiniti','2010','2012','2','Auto',''));
  d2cmediainfiniti.push(new Array('JX35','Infiniti','2013','2013','11','VUS',''));
  d2cmediainfiniti.push(new Array('Q50','Infiniti','2014','2018','49','Auto',''));
  d2cmediainfiniti.push(new Array('Q60','Infiniti','2014','2018','8','Auto',''));
  d2cmediainfiniti.push(new Array('QX30','Infiniti','2017','2018','5','VUS',''));
  d2cmediainfiniti.push(new Array('QX50','Infiniti','2014','2019','34','VUS',''));
  d2cmediainfiniti.push(new Array('QX60','Infiniti','2014','2019','33','VUS',''));
  d2cmediainfiniti.push(new Array('QX70','Infiniti','2014','2014','1','VUS',''));
  d2cmediainfiniti.push(new Array('QX80','Infiniti','2014','2019','4','VUS',''));
  
  export const d2cmediainternational = new Array();
  d2cmediainternational.push(new Array('9000 Series','International','2014','2014','1','Camion',''));
  d2cmediainternational.push(new Array('Cf 600','International','2007','2009','2','Camion',''));
  
  export const d2cmediajaguar = new Array();
  d2cmediajaguar.push(new Array('F-Pace','Jaguar','2017','2019','15','VUS',''));
  d2cmediajaguar.push(new Array('F-Type','Jaguar','2014','2016','6','Auto',''));
  d2cmediajaguar.push(new Array('XE','Jaguar','2017','2018','26','Auto',''));
  d2cmediajaguar.push(new Array('XF','Jaguar','2009','2018','15','Auto',''));
  d2cmediajaguar.push(new Array('XJ','Jaguar','2003','2016','6','Auto',''));
  d2cmediajaguar.push(new Array('XK','Jaguar','2005','2005','1','Auto',''));
  
  export const d2cmediajeep = new Array();
  d2cmediajeep.push(new Array('Autre','Jeep','2019','2019','2','Auto',''));
  d2cmediajeep.push(new Array('Autre','Jeep','2011','2020','9','VUS',''));
  d2cmediajeep.push(new Array('Cherokee','Jeep','2014','2020','390','VUS',''));
  d2cmediajeep.push(new Array('Commander','Jeep','2006','2010','2','VUS',''));
  d2cmediajeep.push(new Array('Compass','Jeep','2007','2020','126','VUS',''));
  d2cmediajeep.push(new Array('Gladiator','Jeep','2020','2020','5','Auto',''));
  d2cmediajeep.push(new Array('Gladiator','Jeep','2020','2020','30','Camion',''));
  d2cmediajeep.push(new Array('Grand Cherokee','Jeep','2005','2020','224','VUS',''));
  d2cmediajeep.push(new Array('Liberty','Jeep','2002','2008','9','VUS',''));
  d2cmediajeep.push(new Array('Patriot','Jeep','2007','2017','97','VUS',''));
  d2cmediajeep.push(new Array('Renegade','Jeep','2015','2019','29','VUS',''));
  d2cmediajeep.push(new Array('Rubicon','Jeep','2019','2019','1','VUS',''));
  d2cmediajeep.push(new Array('Sahara','Jeep','2016','2016','1','VUS',''));
  d2cmediajeep.push(new Array('TJ','Jeep','2000','2006','4','VUS',''));
  d2cmediajeep.push(new Array('Willys','Jeep','1961','2016','2','VUS',''));
  d2cmediajeep.push(new Array('Wrangler','Jeep','2007','2020','174','VUS',''));
  
  export const d2cmediakawasaki = new Array();
  d2cmediakawasaki.push(new Array('Autre','kawasaki','2016','2016','1','Auto',''));
  d2cmediakawasaki.push(new Array('Ninja','Kawasaki','2018','2018','1','Auto',''));
  
  export const d2cmediakia = new Array();
  d2cmediakia.push(new Array('Amanti','Kia','2009','2009','1','Auto',''));
  d2cmediakia.push(new Array('Borrego','Kia','2009','2009','2','VUS',''));
  d2cmediakia.push(new Array('Cadenza','Kia','2014','2017','5','Auto',''));
  d2cmediakia.push(new Array('Forte','Kia','2010','2020','334','Auto',''));
  d2cmediakia.push(new Array('Forte 5','Kia','2011','2020','52','Auto',''));
  d2cmediakia.push(new Array('Forte Koup','Kia','2010','2016','36','Auto',''));
  d2cmediakia.push(new Array('Magentis','Kia','2009','2010','2','Auto',''));
  d2cmediakia.push(new Array('Niro','Kia','2017','2019','20','VUS',''));
  d2cmediakia.push(new Array('Optima','Kia','2011','2020','181','Auto',''));
  d2cmediakia.push(new Array('Optima Hybride','Kia','2012','2019','5','Auto',''));
  d2cmediakia.push(new Array('Rio','Kia','2006','2020','266','Auto',''));
  d2cmediakia.push(new Array('Rio 4','Kia','2013','2016','4','Auto',''));
  d2cmediakia.push(new Array('Rio5','Kia','2007','2019','53','Auto',''));
  d2cmediakia.push(new Array('Rondo','Kia','2007','2017','113','Auto',''));
  d2cmediakia.push(new Array('Sedona','Kia','2006','2020','59','Minivan',''));
  d2cmediakia.push(new Array('Sorento','Kia','2003','2020','463','VUS',''));
  d2cmediakia.push(new Array('Soul','Kia','2016','2017','4','Electrique',''));
  d2cmediakia.push(new Array('Soul','Kia','2010','2020','283','VUS',''));
  d2cmediakia.push(new Array('Soul 2','Kia','2010','2010','1','VUS',''));
  d2cmediakia.push(new Array('Soul EV','Kia','2016','2017','7','Auto',''));
  d2cmediakia.push(new Array('Soul EV','Kia','2015','2018','20','Electrique',''));
  d2cmediakia.push(new Array('Spectra','Kia','2002','2008','4','Auto',''));
  d2cmediakia.push(new Array('Sportage','Kia','2006','2020','327','VUS',''));
  d2cmediakia.push(new Array('Stinger','Kia','2018','2019','17','Auto',''));
  d2cmediakia.push(new Array('Telluride','Kia','2020','2020','2','Auto',''));
  d2cmediakia.push(new Array('Telluride','Kia','2020','2020','2','VUS',''));
  
  export const d2cmedialamborghini = new Array();
  d2cmedialamborghini.push(new Array('Gallardo','Lamborghini','2008','2008','2','Auto',''));
  d2cmedialamborghini.push(new Array('Huracan','Lamborghini','2015','2015','1','Auto',''));
  d2cmedialamborghini.push(new Array('Murcielago','Lamborghini','2006','2006','1','Auto',''));
  
  export const d2cmedialand_rover = new Array();
  d2cmedialand_rover.push(new Array('Defender','Land Rover','1997','1997','1','Camion',''));
  d2cmedialand_rover.push(new Array('Discovery','Land Rover','2017','2017','3','VUS',''));
  d2cmedialand_rover.push(new Array('Discovery Sport','Land Rover','2016','2018','5','Auto',''));
  d2cmedialand_rover.push(new Array('Discovery Sport','Land Rover','2015','2018','14','VUS',''));
  d2cmedialand_rover.push(new Array('Evoque','Land Rover','2013','2013','1','Auto',''));
  d2cmedialand_rover.push(new Array('LR2','Land Rover','2013','2014','2','Auto',''));
  d2cmedialand_rover.push(new Array('LR2','Land Rover','2008','2013','2','VUS',''));
  d2cmedialand_rover.push(new Array('LR4','Land Rover','2010','2011','2','VUS',''));
  d2cmedialand_rover.push(new Array('Range Rover','Land Rover','1993','2017','8','VUS',''));
  d2cmedialand_rover.push(new Array('Range Rover Evoque','Land Rover','2013','2018','20','VUS',''));
  d2cmedialand_rover.push(new Array('Range Rover Sport','Land Rover','2011','2018','27','VUS',''));
  d2cmedialand_rover.push(new Array('Range Rover Velar','Land Rover','2018','2018','3','VUS',''));
  
  export const d2cmedialexus = new Array();
  d2cmedialexus.push(new Array('Ct 200h','Lexus','2012','2015','9','Auto',''));
  d2cmedialexus.push(new Array('ES','Lexus','2019','2019','2','Auto',''));
  d2cmedialexus.push(new Array('ES 300','Lexus','2013','2018','2','Auto',''));
  d2cmedialexus.push(new Array('ES 350','Lexus','2007','2019','17','Auto',''));
  d2cmedialexus.push(new Array('GS','Lexus','2016','2019','2','Auto',''));
  d2cmedialexus.push(new Array('GS 350','Lexus','2013','2019','4','Auto',''));
  d2cmedialexus.push(new Array('GX','Lexus','2010','2016','2','VUS',''));
  d2cmedialexus.push(new Array('IS','Lexus','2009','2017','5','Auto',''));
  d2cmedialexus.push(new Array('IS 250','Lexus','2007','2015','17','Auto',''));
  d2cmedialexus.push(new Array('IS 300','Lexus','2016','2019','26','Auto',''));
  d2cmedialexus.push(new Array('IS 350','Lexus','2007','2018','10','Auto',''));
  d2cmedialexus.push(new Array('LC','Lexus','2018','2018','2','Auto',''));
  d2cmedialexus.push(new Array('LS 460','Lexus','2009','2013','3','Auto',''));
  d2cmedialexus.push(new Array('LX 570','Lexus','2017','2017','1','VUS',''));
  d2cmedialexus.push(new Array('NX','Lexus','2018','2020','16','VUS',''));
  d2cmedialexus.push(new Array('NX 200t','Lexus','2015','2017','27','VUS',''));
  d2cmedialexus.push(new Array('NX 300h','Lexus','2017','2020','2','VUS',''));
  d2cmedialexus.push(new Array('RC 350','Lexus','2015','2016','4','Auto',''));
  d2cmedialexus.push(new Array('RC F','Lexus','2015','2020','2','Auto',''));
  d2cmedialexus.push(new Array('RX','Lexus','2015','2019','6','VUS',''));
  d2cmedialexus.push(new Array('RX 350','Lexus','2008','2019','58','VUS',''));
  d2cmedialexus.push(new Array('RX 400','Lexus','2008','2008','1','VUS',''));
  d2cmedialexus.push(new Array('RX 450H','Lexus','2013','2016','2','VUS',''));
  d2cmedialexus.push(new Array('SC 430','Lexus','2002','2002','1','Auto',''));
  d2cmedialexus.push(new Array('UX','Lexus','2019','2019','4','Auto',''));
  d2cmedialexus.push(new Array('UX','Lexus','2019','2019','4','VUS',''));
  
  export const d2cmedialincoln = new Array();
  d2cmedialincoln.push(new Array('Aviator','Lincoln','2020','2020','7','VUS',''));
  d2cmedialincoln.push(new Array('Continental','Lincoln','2017','2018','3','Auto',''));
  d2cmedialincoln.push(new Array('Corsair','Lincoln','2020','2020','8','Auto',''));
  d2cmedialincoln.push(new Array('MKC','Lincoln','2015','2019','46','VUS',''));
  d2cmedialincoln.push(new Array('MKS','Lincoln','2011','2016','2','Auto',''));
  d2cmedialincoln.push(new Array('MKT','Lincoln','2011','2012','4','VUS',''));
  d2cmedialincoln.push(new Array('MKX','Lincoln','2008','2018','28','VUS',''));
  d2cmedialincoln.push(new Array('MKZ','Lincoln','2010','2019','27','Auto',''));
  d2cmedialincoln.push(new Array('MKZ','Lincoln','2017','2017','1','Electrique',''));
  d2cmedialincoln.push(new Array('Nautilus','Lincoln','2019','2019','3','Auto',''));
  d2cmedialincoln.push(new Array('Nautilus','Lincoln','2019','2019','8','VUS',''));
  d2cmedialincoln.push(new Array('Navigator','Lincoln','2012','2019','6','VUS',''));
  d2cmedialincoln.push(new Array('Town Car','Lincoln','1998','2000','2','Auto',''));
  
  export const d2cmediamaserati = new Array();
  d2cmediamaserati.push(new Array('Ghibli','Maserati','2014','2015','3','Auto',''));
  d2cmediamaserati.push(new Array('Granturismo','Maserati','2011','2012','2','Auto',''));
  d2cmediamaserati.push(new Array('Quattroporte','Maserati','2008','2008','1','Auto',''));
  
  export const d2cmediamazda = new Array();
  d2cmediamazda.push(new Array('2','Mazda','2009','2014','41','Auto',''));
  d2cmediamazda.push(new Array('3','Mazda','2004','2019','594','Auto',''));
  d2cmediamazda.push(new Array('3 Sport','Mazda','2007','2019','50','Auto',''));
  d2cmediamazda.push(new Array('5','Mazda','2007','2017','49','Minivan',''));
  d2cmediamazda.push(new Array('6','Mazda','2004','2018','80','Auto',''));
  d2cmediamazda.push(new Array('B2300','Mazda','2008','2008','1','Camion',''));
  d2cmediamazda.push(new Array('B3000','Mazda','2004','2008','3','Camion',''));
  d2cmediamazda.push(new Array('B4000','Mazda','2004','2010','6','Camion',''));
  d2cmediamazda.push(new Array('CX-3','Mazda','2016','2019','164','VUS',''));
  d2cmediamazda.push(new Array('CX-5','Mazda','2013','2019','373','VUS',''));
  d2cmediamazda.push(new Array('CX-7','Mazda','2007','2012','20','VUS',''));
  d2cmediamazda.push(new Array('CX-9','Mazda','2007','2019','57','VUS',''));
  d2cmediamazda.push(new Array('MazdaSpeed 3','Mazda','2010','2013','9','Auto',''));
  d2cmediamazda.push(new Array('Miata','Mazda','2003','2019','4','Auto',''));
  d2cmediamazda.push(new Array('MPV','Mazda','2005','2005','1','Minivan',''));
  d2cmediamazda.push(new Array('MX-5','Mazda','1999','2019','46','Auto',''));
  d2cmediamazda.push(new Array('Protege','Mazda','2000','2000','2','Auto',''));
  d2cmediamazda.push(new Array('Rx-8','Mazda','2007','2010','2','Auto',''));
  d2cmediamazda.push(new Array('Tribute','Mazda','2008','2011','26','VUS',''));
  
  export const d2cmediamclaren = new Array();
  d2cmediamclaren.push(new Array('570','Mclaren','2016','2017','2','Auto',''));
  d2cmediamclaren.push(new Array('720s','Mclaren','2018','2018','1','Auto',''));
  
  export const d2cmediamercedes_benz = new Array();
  d2cmediamercedes_benz.push(new Array('400','Mercedes-Benz','2016','2016','1','Auto',''));
  d2cmediamercedes_benz.push(new Array('A220','Mercedes-Benz','2019','2019','5','Auto',''));
  d2cmediamercedes_benz.push(new Array('A250','Mercedes-Benz','2019','2020','28','Auto',''));
  d2cmediamercedes_benz.push(new Array('AMG GT','Mercedes-Benz','2016','2019','4','Auto',''));
  d2cmediamercedes_benz.push(new Array('B-Class','Mercedes-Benz','2008','2016','44','Auto','B-Class'));
  d2cmediamercedes_benz.push(new Array('B200','Mercedes-Benz','2008','2013','5','Auto','B-Class'));
  d2cmediamercedes_benz.push(new Array('B250','Mercedes-Benz','2013','2019','12','Auto','B-Class'));
  d2cmediamercedes_benz.push(new Array('C-Class','Mercedes-Benz','2006','2018','60','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C230','Mercedes-Benz','2005','2005','1','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C250','Mercedes-Benz','2010','2012','6','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C300','Mercedes-Benz','2008','2020','89','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C350','Mercedes-Benz','2008','2009','2','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C350 4MATIC','Mercedes-Benz','2007','2014','3','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C43','Mercedes-Benz','2019','2019','2','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C43 AMG','Mercedes-Benz','2017','2020','10','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('C63 AMG','Mercedes-Benz','2017','2020','5','Auto','C-Class'));
  d2cmediamercedes_benz.push(new Array('CLA-Class','Mercedes-Benz','2014','2018','17','Auto','CLA-Class'));
  d2cmediamercedes_benz.push(new Array('CLA250','Mercedes-Benz','2015','2020','33','Auto','CLA-Class'));
  d2cmediamercedes_benz.push(new Array('CLA45','Mercedes-Benz','2015','2019','2','Auto','CLA-Class'));
  d2cmediamercedes_benz.push(new Array('CLK-Class','Mercedes-Benz','2002','2008','4','Auto','CLK-Class'));
  d2cmediamercedes_benz.push(new Array('CLS-Class','Mercedes-Benz','2007','2016','3','Auto','CLS-Class'));
  d2cmediamercedes_benz.push(new Array('CLS400','Mercedes-Benz','2015','2015','1','Auto','CLS-Class'));
  d2cmediamercedes_benz.push(new Array('CLS450','Mercedes-Benz','2019','2019','1','Auto','CLS-Class'));
  d2cmediamercedes_benz.push(new Array('CLS53 AMG','Mercedes-Benz','2020','2020','1','Auto','CLS-Class'));
  d2cmediamercedes_benz.push(new Array('CLS550','Mercedes-Benz','2012','2017','2','Auto','CLS-Class'));
  d2cmediamercedes_benz.push(new Array('CLS63 AMG','Mercedes-Benz','2008','2008','1','Auto','CLS-Class'));
  d2cmediamercedes_benz.push(new Array('E-Class','Mercedes-Benz','2003','2018','16','Auto','E-Class'));
  d2cmediamercedes_benz.push(new Array('E300','Mercedes-Benz','2018','2019','4','Auto','E-Class'));
  d2cmediamercedes_benz.push(new Array('E350','Mercedes-Benz','2007','2020','8','Auto','E-Class'));
  d2cmediamercedes_benz.push(new Array('E400','Mercedes-Benz','2015','2018','5','Auto','E-Class'));
  d2cmediamercedes_benz.push(new Array('E450','Mercedes-Benz','2019','2020','4','Auto','E-Class'));
  d2cmediamercedes_benz.push(new Array('E53 AMG','Mercedes-Benz','2019','2020','7','Auto',''));
  d2cmediamercedes_benz.push(new Array('E63 AMG','Mercedes-Benz','2007','2019','3','Auto','E-Class'));
  d2cmediamercedes_benz.push(new Array('G-Class','Mercedes-Benz','1986','2018','2','VUS','G-Class'));
  d2cmediamercedes_benz.push(new Array('G550','Mercedes-Benz','2017','2017','1','Auto','G-Class'));
  d2cmediamercedes_benz.push(new Array('G63 AMG','Mercedes-Benz','2018','2018','1','VUS','G-Class'));
  d2cmediamercedes_benz.push(new Array('GL-Class','Mercedes-Benz','2012','2014','2','VUS','GL-Class'));
  d2cmediamercedes_benz.push(new Array('GL350','Mercedes-Benz','2016','2016','1','VUS','GL-Class'));
  d2cmediamercedes_benz.push(new Array('GLA-Class','Mercedes-Benz','2015','2017','41','VUS','GLA-Class'));
  d2cmediamercedes_benz.push(new Array('GLA250','Mercedes-Benz','2015','2020','42','VUS','GLA-Class'));
  d2cmediamercedes_benz.push(new Array('GLA45','Mercedes-Benz','2019','2019','3','VUS','GLA-Class'));
  d2cmediamercedes_benz.push(new Array('GLC-Class','Mercedes-Benz','2016','2019','6','VUS','GLC-Class'));
  d2cmediamercedes_benz.push(new Array('GLC300','Mercedes-Benz','2016','2020','76','VUS','GLC-Class'));
  d2cmediamercedes_benz.push(new Array('GLC350','Mercedes-Benz','2019','2019','7','VUS','GLC-Class'));
  d2cmediamercedes_benz.push(new Array('GLC43 AMG','Mercedes-Benz','2017','2019','3','Auto','GLC-Class'));
  d2cmediamercedes_benz.push(new Array('GLC43 AMG','Mercedes-Benz','2017','2019','7','VUS','GLC-Class'));
  d2cmediamercedes_benz.push(new Array('GLC63','Mercedes-Benz','2019','2019','5','VUS','GLC-Class'));
  d2cmediamercedes_benz.push(new Array('GLE-Class','Mercedes-Benz','2016','2018','3','VUS',''));
  d2cmediamercedes_benz.push(new Array('GLE350','Mercedes-Benz','2016','2016','6','VUS',''));
  d2cmediamercedes_benz.push(new Array('GLE400','Mercedes-Benz','2018','2018','5','VUS',''));
  d2cmediamercedes_benz.push(new Array('GLE43','Mercedes-Benz','2018','2018','1','VUS',''));
  d2cmediamercedes_benz.push(new Array('GLE43 AMG','Mercedes-Benz','2017','2019','2','Auto',''));
  d2cmediamercedes_benz.push(new Array('GLE43 AMG','Mercedes-Benz','2018','2019','3','VUS',''));
  d2cmediamercedes_benz.push(new Array('GLE450','Mercedes-Benz','2019','2019','7','Auto',''));
  d2cmediamercedes_benz.push(new Array('GLE450','Mercedes-Benz','2016','2016','1','VUS',''));
  d2cmediamercedes_benz.push(new Array('GLE63','Mercedes-Benz','2017','2017','1','VUS',''));
  d2cmediamercedes_benz.push(new Array('GLK-Class','Mercedes-Benz','2010','2015','23','VUS','GLK-Class'));
  d2cmediamercedes_benz.push(new Array('GLK250','Mercedes-Benz','2013','2013','1','VUS','GLK-Class'));
  d2cmediamercedes_benz.push(new Array('GLK350','Mercedes-Benz','2010','2013','7','VUS','GLK-Class'));
  d2cmediamercedes_benz.push(new Array('GLS450','Mercedes-Benz','2019','2020','2','Auto','GLS-Class'));
  d2cmediamercedes_benz.push(new Array('M-Class','Mercedes-Benz','2008','2015','14','VUS','M-Class'));
  d2cmediamercedes_benz.push(new Array('Metris','Mercedes-Benz','2016','2020','5','Auto',''));
  d2cmediamercedes_benz.push(new Array('Metris','Mercedes-Benz','2016','2019','12','Minivan',''));
  d2cmediamercedes_benz.push(new Array('ML-Class','Mercedes-Benz','2009','2015','3','VUS','ML-Class'));
  d2cmediamercedes_benz.push(new Array('ML320','Mercedes-Benz','2009','2009','1','VUS','ML-Class'));
  d2cmediamercedes_benz.push(new Array('ML350','Mercedes-Benz','2010','2015','5','VUS','ML-Class'));
  d2cmediamercedes_benz.push(new Array('ML550','Mercedes-Benz','2015','2015','1','VUS','ML-Class'));
  d2cmediamercedes_benz.push(new Array('R-Class','Mercedes-Benz','2010','2010','1','Minivan','R-Class'));
  d2cmediamercedes_benz.push(new Array('S-Class','Mercedes-Benz','2012','2012','1','Auto','S-Class'));
  d2cmediamercedes_benz.push(new Array('S350','Mercedes-Benz','2012','2012','1','Auto','S-Class'));
  d2cmediamercedes_benz.push(new Array('S450','Mercedes-Benz','2020','2020','1','Auto','S-Class'));
  d2cmediamercedes_benz.push(new Array('S450 4Matic','Mercedes-Benz','2008','2008','2','Auto','S-Class'));
  d2cmediamercedes_benz.push(new Array('S550','Mercedes-Benz','2016','2016','1','Auto','S-Class'));
  d2cmediamercedes_benz.push(new Array('S560','Mercedes-Benz','2020','2020','2','Auto','S-Class'));
  d2cmediamercedes_benz.push(new Array('S63 AMG','Mercedes-Benz','2017','2017','1','Auto','S-Class'));
  d2cmediamercedes_benz.push(new Array('SL-Class','Mercedes-Benz','2003','2013','3','Auto','SL-Class'));
  d2cmediamercedes_benz.push(new Array('SL450','Mercedes-Benz','2020','2020','2','Auto','SL-Class'));
  d2cmediamercedes_benz.push(new Array('SL550','Mercedes-Benz','2014','2014','1','Auto','SL-Class'));
  d2cmediamercedes_benz.push(new Array('SL63 AMG','Mercedes-Benz','2014','2016','2','Auto','SL-Class'));
  d2cmediamercedes_benz.push(new Array('SLK-Class','Mercedes-Benz','2007','2013','6','Auto','SLK-Class'));
  d2cmediamercedes_benz.push(new Array('SLK230','Mercedes-Benz','1998','1998','1','Auto','SLK-Class'));
  d2cmediamercedes_benz.push(new Array('SLK280','Mercedes-Benz','2006','2006','1','Auto','SLK-Class'));
  d2cmediamercedes_benz.push(new Array('SLK350','Mercedes-Benz','2012','2014','2','Auto','SLK-Class'));
  d2cmediamercedes_benz.push(new Array('SLS AMG','Mercedes-Benz','2012','2012','1','Auto',''));
  d2cmediamercedes_benz.push(new Array('Sprinter','Mercedes-Benz','2015','2019','57','Camion',''));
  d2cmediamercedes_benz.push(new Array('Sprinter 2500','Mercedes-Benz','2013','2016','8','Camion',''));
  
  export const d2cmediamg = new Array();
  d2cmediamg.push(new Array('Midget','MG','1979','1979','1','Auto',''));
  
  export const d2cmediamini = new Array();
  d2cmediamini.push(new Array('Austin','Mini','2013','2013','1','Auto',''));
  d2cmediamini.push(new Array('Cooper','Mini','2007','2016','72','Auto',''));
  d2cmediamini.push(new Array('Cooper 5 portes','Mini','2015','2019','5','Auto',''));
  d2cmediamini.push(new Array('Cooper Clubman','Mini','2010','2017','7','Auto',''));
  d2cmediamini.push(new Array('Cooper Convertible','Mini','2009','2018','9','Auto',''));
  d2cmediamini.push(new Array('Cooper Countryman','Mini','2011','2019','18','VUS',''));
  d2cmediamini.push(new Array('Cooper Paceman','Mini','2013','2013','2','Auto',''));
  d2cmediamini.push(new Array('Cooper S','Mini','2008','2013','3','Auto',''));
  d2cmediamini.push(new Array('Cooper S Clubman','Mini','2010','2010','1','Auto',''));
  d2cmediamini.push(new Array('Hatch','Mini','2015','2015','2','Auto',''));
  
  export const d2cmediamitsubishi = new Array();
  d2cmediamitsubishi.push(new Array('Eclipse','Mitsubishi','2007','2012','12','Auto',''));
  d2cmediamitsubishi.push(new Array('Eclipse Cross','Mitsubishi','2018','2019','19','VUS',''));
  d2cmediamitsubishi.push(new Array('Eclipse Spyder','Mitsubishi','2008','2009','4','Auto',''));
  d2cmediamitsubishi.push(new Array('Endeavor','Mitsubishi','2006','2009','4','VUS',''));
  d2cmediamitsubishi.push(new Array('FE 180','Mitsubishi','2015','2015','1','Camion',''));
  d2cmediamitsubishi.push(new Array('Galant','Mitsubishi','2007','2007','1','Auto',''));
  d2cmediamitsubishi.push(new Array('I-Miev','Mitsubishi','2017','2017','1','Auto',''));
  d2cmediamitsubishi.push(new Array('I-Miev','Mitsubishi','2017','2017','2','Electrique',''));
  d2cmediamitsubishi.push(new Array('Lancer','Mitsubishi','2008','2017','156','Auto',''));
  d2cmediamitsubishi.push(new Array('Mirage','Mitsubishi','2013','2019','32','Auto',''));
  d2cmediamitsubishi.push(new Array('Outlander','Mitsubishi','2018','2018','2','Electrique',''));
  d2cmediamitsubishi.push(new Array('Outlander','Mitsubishi','2006','2019','187','VUS',''));
  d2cmediamitsubishi.push(new Array('Ralliart','Mitsubishi','2009','2009','1','Auto',''));
  d2cmediamitsubishi.push(new Array('RVR','Mitsubishi','2011','2019','160','VUS',''));
  
  export const d2cmedianissan = new Array();
  d2cmedianissan.push(new Array('300ZX','Nissan','1991','1991','1','Auto',''));
  d2cmedianissan.push(new Array('350Z','Nissan','2004','2007','5','Auto',''));
  d2cmedianissan.push(new Array('370z','Nissan','2010','2020','18','Auto',''));
  d2cmedianissan.push(new Array('Altima','Nissan','2005','2019','123','Auto',''));
  d2cmedianissan.push(new Array('Armada','Nissan','2006','2019','11','VUS',''));
  d2cmedianissan.push(new Array('Cube','Nissan','2009','2009','6','Auto',''));
  d2cmedianissan.push(new Array('Frontier','Nissan','2005','2019','55','Camion',''));
  d2cmedianissan.push(new Array('GT-R','Nissan','2011','2018','3','Auto',''));
  d2cmedianissan.push(new Array('Juke','Nissan','2011','2017','56','VUS',''));
  d2cmedianissan.push(new Array('Kicks','Nissan','2018','2019','6','Auto',''));
  d2cmedianissan.push(new Array('Kicks','Nissan','2018','2019','13','VUS',''));
  d2cmedianissan.push(new Array('Leaf','Nissan','2015','2019','13','Auto',''));
  d2cmedianissan.push(new Array('Leaf','Nissan','2012','2019','99','Electrique',''));
  d2cmedianissan.push(new Array('Maxima','Nissan','2009','2019','25','Auto',''));
  d2cmedianissan.push(new Array('Micra','Nissan','2015','2019','213','Auto',''));
  d2cmedianissan.push(new Array('Murano','Nissan','2004','2019','141','VUS',''));
  d2cmedianissan.push(new Array('NV','Nissan','2012','2019','20','Camion',''));
  d2cmedianissan.push(new Array('Pathfinder','Nissan','2005','2019','128','VUS',''));
  d2cmedianissan.push(new Array('Qashqai','Nissan','2017','2019','78','VUS',''));
  d2cmedianissan.push(new Array('Quest','Nissan','2004','2012','5','Minivan',''));
  d2cmedianissan.push(new Array('Rogue','Nissan','2008','2020','690','VUS',''));
  d2cmedianissan.push(new Array('S?lectionner','Nissan','2018','2018','1','Auto',''));
  d2cmedianissan.push(new Array('Sentra','Nissan','2003','2019','390','Auto',''));
  d2cmedianissan.push(new Array('Titan','Nissan','2011','2019','57','Camion',''));
  d2cmedianissan.push(new Array('Versa','Nissan','2007','2018','150','Auto',''));
  d2cmedianissan.push(new Array('Versa Note','Nissan','2014','2019','131','Auto',''));
  d2cmedianissan.push(new Array('X-Trail','Nissan','2005','2006','5','VUS',''));
  d2cmedianissan.push(new Array('Xterra','Nissan','2006','2015','6','VUS',''));
  
  export const d2cmediaoldsmobile = new Array();
  d2cmediaoldsmobile.push(new Array('98','Oldsmobile','1965','1965','1','Auto',''));
  d2cmediaoldsmobile.push(new Array('Alero','Oldsmobile','2004','2004','1','Auto',''));
  d2cmediaoldsmobile.push(new Array('Cutlass','Oldsmobile','1986','1986','1','Auto',''));
  
  export const d2cmediapeterbilt = new Array();
  d2cmediapeterbilt.push(new Array('389','Peterbilt','2019','2019','1','Camion',''));
  
  export const d2cmediaplymouth = new Array();
  d2cmediaplymouth.push(new Array('Barracuda','Plymouth','1969','1969','1','Auto',''));
  d2cmediaplymouth.push(new Array('Prowler','Plymouth','2000','2001','2','Auto',''));
  
  export const d2cmediapontiac = new Array();
  d2cmediapontiac.push(new Array('2sl26','Pontiac','2009','2009','1','Auto',''));
  d2cmediapontiac.push(new Array('2sl26','Pontiac','2009','2009','1','Minivan',''));
  d2cmediapontiac.push(new Array('Firebird','Pontiac','1995','1999','2','Auto',''));
  d2cmediapontiac.push(new Array('G3','Pontiac','2009','2010','3','Auto',''));
  d2cmediapontiac.push(new Array('G5','Pontiac','2007','2009','12','Auto',''));
  d2cmediapontiac.push(new Array('G6','Pontiac','2005','2008','7','Auto',''));
  d2cmediapontiac.push(new Array('G8','Pontiac','2009','2009','1','Auto',''));
  d2cmediapontiac.push(new Array('Grand Am','Pontiac','2002','2005','3','Auto',''));
  d2cmediapontiac.push(new Array('Grand Prix','Pontiac','2005','2005','1','Auto',''));
  d2cmediapontiac.push(new Array('Montana','Pontiac','2004','2010','4','Minivan',''));
  d2cmediapontiac.push(new Array('Pursuit','Pontiac','2006','2006','2','Auto',''));
  d2cmediapontiac.push(new Array('Solstice','Pontiac','2006','2008','7','Auto',''));
  d2cmediapontiac.push(new Array('Sunfire','Pontiac','2003','2005','4','Auto',''));
  d2cmediapontiac.push(new Array('Torrent','Pontiac','2006','2009','11','VUS',''));
  d2cmediapontiac.push(new Array('Vibe','Pontiac','2003','2010','16','Auto',''));
  d2cmediapontiac.push(new Array('Wave','Pontiac','2005','2009','9','Auto',''));
  
  export const d2cmediaporsche = new Array();
  d2cmediaporsche.push(new Array('718 Boxster','Porsche','2017','2018','3','Auto',''));
  d2cmediaporsche.push(new Array('718 Cayman','Porsche','2018','2018','1','Auto',''));
  d2cmediaporsche.push(new Array('911','Porsche','1970','2019','22','Auto',''));
  d2cmediaporsche.push(new Array('928','Porsche','1988','1988','1','Auto',''));
  d2cmediaporsche.push(new Array('Boxster','Porsche','1999','2015','18','Auto',''));
  d2cmediaporsche.push(new Array('Cayenne','Porsche','2005','2017','18','VUS',''));
  d2cmediaporsche.push(new Array('Cayman','Porsche','2015','2018','2','Auto',''));
  d2cmediaporsche.push(new Array('Macan','Porsche','2015','2018','9','VUS',''));
  d2cmediaporsche.push(new Array('Panamera','Porsche','2010','2012','2','Auto',''));
  
  export const d2cmediaram = new Array();
  d2cmediaram.push(new Array('1500','RAM','2011','2020','1,050','Camion',''));
  d2cmediaram.push(new Array('2500','RAM','2011','2019','97','Camion',''));
  d2cmediaram.push(new Array('3500','RAM','2011','2019','14','Camion',''));
  d2cmediaram.push(new Array('5500','RAM','2019','2019','1','Camion',''));
  d2cmediaram.push(new Array('Cargo Van','RAM','2014','2015','6','Camion',''));
  d2cmediaram.push(new Array('Promaster','RAM','2015','2019','28','Camion',''));
  
  export const d2cmediasaab = new Array();
  d2cmediasaab.push(new Array('9-3','Saab','2000','2011','7','Auto',''));
  d2cmediasaab.push(new Array('9-5','Saab','2008','2008','1','Auto',''));
  
  export const d2cmediasaturn = new Array();
  d2cmediasaturn.push(new Array('Astra','Saturn','2008','2009','5','Auto',''));
  d2cmediasaturn.push(new Array('Aura','Saturn','2007','2008','4','Auto',''));
  d2cmediasaturn.push(new Array('Ion','Saturn','2003','2006','6','Auto',''));
  d2cmediasaturn.push(new Array('Outlook','Saturn','2007','2007','1','VUS',''));
  d2cmediasaturn.push(new Array('Sky','Saturn','2007','2008','5','Auto',''));
  d2cmediasaturn.push(new Array('Vue','Saturn','2006','2009','6','VUS',''));
  
  export const d2cmediascion = new Array();
  d2cmediascion.push(new Array('Fr-s','Scion','2013','2016','26','Auto',''));
  d2cmediascion.push(new Array('IM','Scion','2016','2016','28','Auto',''));
  d2cmediascion.push(new Array('IQ','Scion','2012','2015','8','Auto',''));
  d2cmediascion.push(new Array('tC','Scion','2011','2016','31','Auto',''));
  d2cmediascion.push(new Array('xB','Scion','2010','2015','7','Auto',''));
  d2cmediascion.push(new Array('xD','Scion','2014','2014','2','Auto',''));
  
  export const d2cmediasmart = new Array();
  d2cmediasmart.push(new Array('Fortwo','Smart','2005','2019','48','Auto',''));
  d2cmediasmart.push(new Array('Fortwo','Smart','2013','2018','6','Electrique',''));
  
  export const d2cmediasubaru = new Array();
  d2cmediasubaru.push(new Array('Ascent','Subaru','2020','2020','1','Auto',''));
  d2cmediasubaru.push(new Array('Ascent','Subaru','2019','2020','2','VUS',''));
  d2cmediasubaru.push(new Array('B9 Tribeca','Subaru','2008','2009','2','VUS',''));
  d2cmediasubaru.push(new Array('BRZ','Subaru','2013','2017','14','Auto',''));
  d2cmediasubaru.push(new Array('Crosstrek','Subaru','2016','2019','58','VUS',''));
  d2cmediasubaru.push(new Array('Forester','Subaru','2006','2020','191','VUS',''));
  d2cmediasubaru.push(new Array('Impreza','Subaru','2006','2019','268','Auto',''));
  d2cmediasubaru.push(new Array('Impreza 2.0i','Subaru','2012','2017','4','Auto',''));
  d2cmediasubaru.push(new Array('Impreza Wagon','Subaru','2014','2015','4','Auto',''));
  d2cmediasubaru.push(new Array('Impreza WRX','Subaru','2009','2019','36','Auto',''));
  d2cmediasubaru.push(new Array('Impreza WRX STI','Subaru','2010','2018','9','Auto',''));
  d2cmediasubaru.push(new Array('Legacy','Subaru','2006','2020','90','Auto',''));
  d2cmediasubaru.push(new Array('Outback','Subaru','2005','2020','223','Auto',''));
  d2cmediasubaru.push(new Array('S?lectionner','Subaru','2015','2015','1','Auto',''));
  d2cmediasubaru.push(new Array('Tribeca','Subaru','2009','2012','4','Auto',''));
  d2cmediasubaru.push(new Array('WRX','Subaru','2010','2018','72','Auto',''));
  d2cmediasubaru.push(new Array('WRX STI','Subaru','2014','2019','9','Auto',''));
  d2cmediasubaru.push(new Array('XV Crosstrek','Subaru','2013','2018','54','VUS',''));
  
  export const d2cmediasuzuki = new Array();
  d2cmediasuzuki.push(new Array('Aerio','Suzuki','2006','2007','4','Auto',''));
  d2cmediasuzuki.push(new Array('Dl 650','Suzuki','2007','2007','1','Auto',''));
  d2cmediasuzuki.push(new Array('Grand Vitara','Suzuki','2007','2013','20','VUS',''));
  d2cmediasuzuki.push(new Array('Kizashi','Suzuki','2011','2013','7','Auto',''));
  d2cmediasuzuki.push(new Array('Sidekick','Suzuki','1998','1998','1','VUS',''));
  d2cmediasuzuki.push(new Array('Swift+','Suzuki','2008','2008','1','Auto',''));
  d2cmediasuzuki.push(new Array('Sx4','Suzuki','2007','2011','21','Auto',''));
  d2cmediasuzuki.push(new Array('XL-7','Suzuki','2002','2007','3','VUS',''));
  
  export const d2cmediatesla = new Array();
  d2cmediatesla.push(new Array('S','Tesla','2013','2017','8','Electrique',''));
  d2cmediatesla.push(new Array('X','Tesla','2017','2017','1','Electrique',''));
  
  export const d2cmediatoyota = new Array();
  d2cmediatoyota.push(new Array('4Runner','Toyota','2004','2020','42','VUS',''));
  d2cmediatoyota.push(new Array('86','Toyota','2017','2019','3','Auto',''));
  d2cmediatoyota.push(new Array('Avalon','Toyota','2011','2019','18','Auto',''));
  d2cmediatoyota.push(new Array('C-HR','Toyota','2018','2019','30','VUS',''));
  d2cmediatoyota.push(new Array('Camry','Toyota','2002','2020','187','Auto',''));
  d2cmediatoyota.push(new Array('Camry Hybride','Toyota','2007','2018','8','Auto',''));
  d2cmediatoyota.push(new Array('Celica','Toyota','1993','2003','3','Auto',''));
  d2cmediatoyota.push(new Array('Corolla','Toyota','2001','2020','776','Auto',''));
  d2cmediatoyota.push(new Array('Corolla Hatchback','Toyota','2019','2020','22','Auto',''));
  d2cmediatoyota.push(new Array('Corolla iM','Toyota','2017','2019','12','Auto',''));
  d2cmediatoyota.push(new Array('Echo','Toyota','2003','2005','14','Auto',''));
  d2cmediatoyota.push(new Array('FJ Cruiser','Toyota','2007','2012','5','VUS',''));
  d2cmediatoyota.push(new Array('Highlander','Toyota','2003','2019','101','VUS',''));
  d2cmediatoyota.push(new Array('IQ','Toyota','2012','2012','1','Auto',''));
  d2cmediatoyota.push(new Array('Matrix','Toyota','2006','2014','59','Auto',''));
  d2cmediatoyota.push(new Array('Mirai','Toyota','2019','2019','1','Electrique',''));
  d2cmediatoyota.push(new Array('MR2','Toyota','2003','2003','1','Auto',''));
  d2cmediatoyota.push(new Array('Prius','Toyota','2005','2020','79','Auto',''));
  d2cmediatoyota.push(new Array('Prius','Toyota','2015','2015','1','Electrique',''));
  d2cmediatoyota.push(new Array('Prius C','Toyota','2014','2019','30','Auto',''));
  d2cmediatoyota.push(new Array('Prius Prime','Toyota','2017','2020','13','Auto',''));
  d2cmediatoyota.push(new Array('Prius Prime','Toyota','2017','2018','3','Electrique',''));
  d2cmediatoyota.push(new Array('Prius V','Toyota','2012','2018','16','Auto',''));
  d2cmediatoyota.push(new Array('RAV4','Toyota','2004','2019','428','VUS',''));
  d2cmediatoyota.push(new Array('RAV4 Hybride','Toyota','2016','2017','5','VUS',''));
  d2cmediatoyota.push(new Array('Scion','Toyota','2012','2012','1','Auto',''));
  d2cmediatoyota.push(new Array('Sequoia','Toyota','2011','2017','9','VUS',''));
  d2cmediatoyota.push(new Array('Sienna','Toyota','2001','2020','103','Minivan',''));
  d2cmediatoyota.push(new Array('Solara','Toyota','2005','2007','2','Auto',''));
  d2cmediatoyota.push(new Array('Supra','Toyota','2020','2020','2','Auto',''));
  d2cmediatoyota.push(new Array('Tacoma','Toyota','2005','2020','91','Camion',''));
  d2cmediatoyota.push(new Array('Tundra','Toyota','2006','2020','52','Camion',''));
  d2cmediatoyota.push(new Array('Venza','Toyota','2009','2016','71','VUS',''));
  d2cmediatoyota.push(new Array('Yaris','Toyota','2006','2019','221','Auto',''));
  d2cmediatoyota.push(new Array('Yaris hatchback','Toyota','2008','2019','14','Auto',''));
  
  export const d2cmediatriumph = new Array();
  d2cmediatriumph.push(new Array('TR7','Triumph','1980','1980','1','Auto',''));
  
  export const d2cmediavolkswagen = new Array();
  d2cmediavolkswagen.push(new Array('Arteon','Volkswagen','2019','2019','7','Auto',''));
  d2cmediavolkswagen.push(new Array('Atlas','Volkswagen','2018','2019','93','VUS',''));
  d2cmediavolkswagen.push(new Array('Beetle','Volkswagen','2009','2019','52','Auto',''));
  d2cmediavolkswagen.push(new Array('Beetle cabriolet','Volkswagen','2003','2014','4','Auto',''));
  d2cmediavolkswagen.push(new Array('CC','Volkswagen','2011','2017','8','Auto',''));
  d2cmediavolkswagen.push(new Array('e-Golf','Volkswagen','2011','2016','3','Auto',''));
  d2cmediavolkswagen.push(new Array('e-Golf','Volkswagen','2016','2017','4','Electrique',''));
  d2cmediavolkswagen.push(new Array('EOS','Volkswagen','2007','2016','23','Auto',''));
  d2cmediavolkswagen.push(new Array('GLI','Volkswagen','2012','2016','2','Auto',''));
  d2cmediavolkswagen.push(new Array('Golf','Volkswagen','2003','2019','303','Auto',''));
  d2cmediavolkswagen.push(new Array('Golf City','Volkswagen','2007','2010','11','Auto',''));
  d2cmediavolkswagen.push(new Array('Golf GTI','Volkswagen','2007','2019','49','Auto',''));
  d2cmediavolkswagen.push(new Array('Golf R','Volkswagen','2016','2019','40','Auto',''));
  d2cmediavolkswagen.push(new Array('Golf SportWagen','Volkswagen','2015','2019','56','Auto',''));
  d2cmediavolkswagen.push(new Array('Golf Wagon','Volkswagen','2010','2015','23','Auto',''));
  d2cmediavolkswagen.push(new Array('Jetta','Volkswagen','2004','2019','472','Auto',''));
  d2cmediavolkswagen.push(new Array('Jetta City','Volkswagen','2007','2009','3','Auto',''));
  d2cmediavolkswagen.push(new Array('New Beetle','Volkswagen','2002','2010','10','Auto',''));
  d2cmediavolkswagen.push(new Array('Passat','Volkswagen','2002','2019','156','Auto',''));
  d2cmediavolkswagen.push(new Array('Rabbit','Volkswagen','2007','2009','7','Auto',''));
  d2cmediavolkswagen.push(new Array('Routan','Volkswagen','2009','2010','2','Minivan',''));
  d2cmediavolkswagen.push(new Array('Tiguan','Volkswagen','2009','2019','286','VUS',''));
  d2cmediavolkswagen.push(new Array('Touareg','Volkswagen','2009','2017','29','VUS',''));
  
  export const d2cmediavolvo = new Array();
  d2cmediavolvo.push(new Array('C30','Volvo','2008','2011','5','Auto',''));
  d2cmediavolvo.push(new Array('C70','Volvo','2007','2013','4','Auto',''));
  d2cmediavolvo.push(new Array('S40','Volvo','2006','2010','6','Auto',''));
  d2cmediavolvo.push(new Array('S60','Volvo','2004','2016','32','Auto',''));
  d2cmediavolvo.push(new Array('S80','Volvo','2005','2011','5','Auto',''));
  d2cmediavolvo.push(new Array('S90','Volvo','2017','2017','2','Auto',''));
  d2cmediavolvo.push(new Array('V50','Volvo','2005','2008','2','Auto',''));
  d2cmediavolvo.push(new Array('V60','Volvo','2015','2016','13','Auto',''));
  d2cmediavolvo.push(new Array('V70','Volvo','2007','2007','1','Auto',''));
  d2cmediavolvo.push(new Array('XC60','Volvo','2010','2017','22','VUS',''));
  d2cmediavolvo.push(new Array('XC70','Volvo','2004','2010','4','Auto',''));
  d2cmediavolvo.push(new Array('XC90','Volvo','2004','2016','6','Auto',''));  

  export const vehiculeMarques = [
    "Acura","Alfa romeo","Aston martin","Audi","Bentley","BMW","Buick","Cadillac","Campagna","Chevrolet",
    "Chrysler","Dodge","Ferrari","Fiat","Ford","Genesis","Gmc","Hino","Honda","Hummer","Hyundai","Infiniti",
    "International","Jaguar","Jeep","Kia","Lamborghini","Land Rover","Lexus","Lincoln","Maserati","Mazda",
    "McLaren","Mercedes-Benz","Mini","Mitsubishi","Nissan","Oldsmobile","Plymouth","Pontiac","Porsche",
    "RAM","Saab","Saturn","Scion","Smart","Subaru","Suzuki","Tesla","Toyota","Volkswagen","Volvo"
  ]
    
  export const marquesModeles = [
    { marque: "Acura", modeles: d2cmediaacura },
    { marque: "Alfa romeo", modeles: d2cmediaalfa_romeo },
    { marque: "Aston martin", modeles: d2cmediaaston_martin },
    { marque: "Audi", modeles: d2cmediaaudi },
    { marque: "Bentley", modeles: d2cmediabentley },
    { marque: "BMW", modeles: d2cmediabmw },
    { marque: "Buick", modeles: d2cmediabuick },
    { marque: "Cadillac", modeles: d2cmediacadillac },
    { marque: "Campagna", modeles: d2cmediacampagna },
    { marque: "Chevrolet", modeles: d2cmediachevrolet },
    { marque: "Chrysler", modeles: d2cmediachrysler },
    { marque: "Dodge", modeles: d2cmediadodge },
    { marque: "Ferrari", modeles: d2cmediaferrari },
    { marque: "Fiat", modeles: d2cmediafiat },
    { marque: "Ford", modeles: d2cmediaford },
    { marque: "Genesis", modeles: d2cmediagenesis },
    { marque: "Gmc", modeles: d2cmediagmc },
    { marque: "Hino", modeles: d2cmediahino },
    { marque: "Honda", modeles: d2cmediahonda },
    { marque: "Hummer", modeles: d2cmediahummer },
    { marque: "Hyundai", modeles: d2cmediahyundai },
    { marque: "Infiniti", modeles: d2cmediainfiniti },
    { marque: "International", modeles: d2cmediainternational },
    { marque: "Jaguar", modeles: d2cmediajaguar },
    { marque: "Jeep", modeles: d2cmediajeep },
    { marque: "Kia", modeles: d2cmediakia },
    { marque: "Lamborghini", modeles: d2cmedialamborghini },
    { marque: "Land Rover", modeles: d2cmedialand_rover },
    { marque: "Lexus", modeles: d2cmedialexus },
    { marque: "Lincoln", modeles: d2cmedialincoln },
    { marque: "Maserati", modeles: d2cmediamaserati },
    { marque: "Mazda", modeles: d2cmediamazda },
    { marque: "McLaren", modeles: d2cmediamclaren },
    { marque: "Mercedes-Benz", modeles: d2cmediamercedes_benz },
    { marque: "Mini", modeles: d2cmediamini },
    { marque: "Mitsubishi", modeles: d2cmediamitsubishi },
    { marque: "Nissan", modeles: d2cmedianissan },
    { marque: "Oldsmobile", modeles: d2cmediaoldsmobile },
    { marque: "Plymouth", modeles: d2cmediaplymouth },
    { marque: "Pontiac", modeles: d2cmediapontiac },
    { marque: "Porsche", modeles: d2cmediaporsche },
    { marque: "RAM", modeles: d2cmediaram },
    { marque: "Saab", modeles: d2cmediasaab },
    { marque: "Saturn", modeles: d2cmediasaturn },
    { marque: "Scion", modeles: d2cmediascion },
    { marque: "Smart", modeles: d2cmediasmart },
    { marque: "Subaru", modeles: d2cmediasubaru },
    { marque: "Suzuki", modeles: d2cmediasuzuki },
    { marque: "Tesla", modeles: d2cmediatesla },
    { marque: "Toyota", modeles: d2cmediatoyota },
    { marque: "Volkswagen", modeles: d2cmediavolkswagen },
    { marque: "Volvo", modeles: d2cmediavolvo }
  ];  

  export const colors = [
    "Argent",
    "Beige",
    "Blanc",
    "Bleu",
    "Bleu fonçé",
    "Bleu pâle",
    "Bourgogne",
    "Bourguogne",
    "Bronze",
    "Brun",
    "Charbon",
    "Crème",
    "Cuivre",
    "Étain",
    "Gris",
    "Gris fonçé",
    "Gris pâle",
    "Jaune",
    "Maroon",
    "Mauve",
    "Noir",
    "Or",
    "Orange",
    "Rouge",
    "Tan",
    "Taupe",
    "Vert",
    "Vert fonçé",
    "Vert pâle",
    "Violet"
  ];