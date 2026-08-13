const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const GAMES = [
  {
    title: "Catan",
    shortDescription:
      "Bouw nederzettingen, steden en wegen\nen verzamel als eerste 10 punten.",
    description:
      "In Catan bouw je als kolonist nederzettingen, steden en wegen op het eiland Catan. Bij het begin van elke beurt bepaalt een dobbelsteenworp welke grondstoffen er die ronde beschikbaar komen: hout, leem, koren, wol en erts. Met deze grondstoffen breid je je wegennetwerk uit, sticht je nieuwe nederzettingen of bouw je ze uit tot steden. Omdat grondstoffen ongelijk verdeeld zijn, moet je vaak onderhandelen en ruilen met andere spelers om aan wat je nodig hebt te komen. Wie als eerste tien overwinningspunten behaalt met nederzettingen, steden, de langste handelsroute of het grootste leger, wint het spel.",
    category: "Strategie",
    theme: "Kolonisatie",
    complexity: 2.3,
    minAge: 10,
    minPlayers: 3,
    maxPlayers: 4,
    playTime: 120,
    totalCopies: 2,
    imageUrl:
      "https://cf.geekdo-images.com/0XODRpReiZBFUffEcqT5-Q__opengraph/img/ARkyerUcE8vdJx0U5S0eVM0RTzY=/0x0:1000x525/fit-in/1200x630/filters:strip_icc()/pic9156909.png",
    productImageUrl: "https://media.s-bol.com/3n2QVp1KOz2n/mZmwlAR/550x582.jpg",
    images: [
      "https://media.s-bol.com/qqAQxKoO6BWr/XDlYG68/124x69.jpg",
      "https://media.s-bol.com/m4Qo6NPN28qn/r0mvr6E/124x120.jpg",
    ],
  },
  {
    title: "Ticket to Ride",
    shortDescription:
      "Claim treinroutes en verzamel kaarten\nom je geheime bestemmingen te voltooien.",
    description:
      "In Ticket to Ride verzamel je treinkaarten in bijpassende kleuren om spoorverbindingen tussen steden op de kaart te claimen. Hoe langer de route, hoe meer punten die oplevert, maar andere spelers kunnen je voor zijn als je te lang wacht. Daarnaast houd je geheime bestemmingskaarten bij, die aangeven welke steden je uiteindelijk met elkaar verbonden moet hebben; lukt dat niet, dan kost het juist punten. Door slim te plannen welke routes je claimt en wanneer je nieuwe bestemmingen aanneemt, bouw je gaandeweg je eigen spoornetwerk door het hele land.",
    category: "Familie",
    theme: "Treinen",
    complexity: 1.8,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 5,
    playTime: 60,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/kdWYkW-7AqG63HhqPL6ekA__opengraph/img/dQRVo1f0UIX-QxlmItn6syEn1a4=/0x0:1500x788/fit-in/1200x630/filters:strip_icc()/pic8937637.jpg",
    productImageUrl: "https://media.s-bol.com/gzyNjVg02M7r/81oBXpr/550x541.jpg",
    images: [
      "https://media.s-bol.com/R9M43MA9x7jL/3Q1RxAr/124x155.jpg",
      "https://media.s-bol.com/gLE2ByJ1GQAj/124x93.jpg",
    ],
  },
  {
    title: "Splendor",
    shortDescription:
      "Verzamel edelstenen en koop kaarten\nom als eerste 15 prestigepunten te halen.",
    description:
      "In Splendor bouw je als edelstenenhandelaar tijdens de Renaissance een eigen koopmansimperium op. Door grondstofjetons te verzamelen, koop je ontwikkelingskaarten die op hun beurt weer permanente kortingen geven op toekomstige aankopen. Zo kun je steeds krachtigere kaarten aanschaffen en trek je bovendien de aandacht van edellieden, die extra punten opleveren zodra je aan hun voorwaarden voldoet. Het spel is snel te leren, maar vraagt om een scherpe blik op wat je tegenstanders aan het opbouwen zijn, want de beste kaarten zijn er maar één keer.",
    category: "Familie",
    theme: "Handel",
    complexity: 1.8,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 30,
    totalCopies: 3,
    imageUrl:
      "https://cf.geekdo-images.com/vNFe4JkhKAERzi4T0Ntwpw__opengraph/img/XUU2V5E1OJxRo6h99cheCycsDLA=/0x0:2536x1331/fit-in/1200x630/filters:strip_icc()/pic8234167.png",
    productImageUrl: "https://media.s-bol.com/E4Z2vJmyLvO4/3QRMnGn/534x840.jpg",
    images: [],
  },
  {
    title: "Codenames",
    shortDescription:
      "Raad als team zoveel mogelijk woorden\nvia aanwijzingen van de spymaster.",
    description:
      "Bij Codenames proberen twee teams zo snel mogelijk hun eigen geheime agenten te vinden tussen een raster van woordkaarten. Elke ronde geeft de spymaster van een team één woord en een getal als aanwijzing, waarmee de rest van het team moet raden welke woorden bij hun agenten horen. Kies je verkeerd, dan loop je het risico de agent van de tegenstander te raken, een onschuldige omstander te raken, of erger nog, de dodelijke moordenaar. Het spel draait volledig om creatieve associaties bedenken én ze door je team laten doorgronden.",
    category: "Party",
    theme: "Spionage",
    complexity: 1.3,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 8,
    playTime: 15,
    totalCopies: 2,
    imageUrl:
      "https://cf.geekdo-images.com/nC6ifPCDnAItwoKSKXVrnw__opengraph/img/a-o7v0YkRyRVid6iCqqsA5CwIsY=/0x0:1906x1001/fit-in/1200x630/filters:strip_icc()/pic8907965.jpg",
    productImageUrl: "https://media.s-bol.com/m2DMNKooVj00/M87YVWG/550x656.jpg",
    images: [],
  },
  {
    title: "Dixit",
    shortDescription:
      "Geef een aanwijzing bij een kaart,\nniet te makkelijk en niet te moeilijk.",
    description:
      "In Dixit vertel je bij een van je kaarten een woord, zin of geluid dat de sfeer van de afbeelding vangt. De andere spelers kiezen daarna stiekem een van hun eigen kaarten die ook bij die aanwijzing zou kunnen passen, waarna alle gekozen kaarten door elkaar worden gelegd. Iedereen probeert vervolgens te raden welke kaart origineel van de verteller was. Het venijn zit in het spel met kaarten van de andere spelers: is de aanwijzing te duidelijk, dan raadt iedereen het meteen en scoor je niks. Is hij te vaag, dan raadt niemand het en misluk je ook. De kunst is om precies de juiste balans te vinden.",
    category: "Party",
    theme: "Fantasie",
    complexity: 1.2,
    minAge: 8,
    minPlayers: 3,
    maxPlayers: 6,
    playTime: 30,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/J0PlHArkZDJ57H-brXW2Fw__opengraph/img/WDuER7xqK418ih7wBPlaXzS8lhg=/0x0:3271x1717/fit-in/1200x630/filters:strip_icc()/pic6738336.jpg",
    productImageUrl: "https://media.s-bol.com/gzxGMgZMQQMr/k8RQWQ6/550x550.jpg",
    images: [],
  },
  {
    title: "Sushi Go Party",
    shortDescription:
      "Stel je menu samen uit heerlijke sushigerechten\nen scoor de slimste combinaties.",
    description:
      "Sushi Go Party is de uitgebreide versie van het populaire kaartspel Sushi Go. Voorafgaand aan elke ronde stel je een menu samen uit meer dan twintig verschillende gerechten, van maki tot sashimi en toetjes. Tijdens het spel kies je steeds één kaart uit je hand en geef je de rest door aan je buurman. Elk gerecht scoort op een eigen manier, dus je moet steeds opnieuw inschatten welke combinaties het meest opleveren. Met plek voor tot acht spelers en telkens een ander menu is geen enkele partij hetzelfde.",
    category: "Party",
    theme: "Overig",
    complexity: 1.4,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 8,
    playTime: 30,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/VDzMjl6vmv99/YEnKBmW/550x574.jpg",
    productImageUrl: "https://media.s-bol.com/VDzMjl6vmv99/YEnKBmW/550x574.jpg",
    images: [],
  },
  {
    title: "Machiavelli Deluxe",
    shortDescription:
      "Kies elke ronde een geheim personage met een eigen kracht\nen bouw de mooiste wijken van de stad.",
    description:
      "In Machiavelli probeer je de machtigste stad te bouwen door gebouwen neer te zetten met munten die je verdient. Aan het begin van elke ronde kies je in het geheim een personage, zoals de Koning, de Moordenares of de Koopvrouw, elk met een eigen speciale actie. Omdat je nooit precies weet welk personage je tegenstanders hebben gekozen, draait het spel om goed inschatten, bluffen en op het juiste moment toeslaan. Elke ronde worden de personages opnieuw verdeeld, waardoor de machtsverhoudingen steeds verschuiven.",
    category: "Strategie",
    theme: "Geschiedenis",
    complexity: 2.3,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 7,
    playTime: 30,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/Jw4DpgwY1xky/48Wqny1/550x749.jpg",
    productImageUrl: "https://media.s-bol.com/Jw4DpgwY1xky/48Wqny1/550x749.jpg",
    images: [],
  },
  {
    title: "Dominion",
    shortDescription:
      "Bouw je eigen kaartendek uit tot een machtig koninkrijk\nen verzamel de meeste overwinningspunten.",
    description:
      "Dominion is de deckbuilder die het genre heeft gedefinieerd. Je begint met een bescheiden setje kaarten en koopt daarmee steeds betere kaarten uit een gedeelde marktplaats om je eigen dek te versterken. Elke partij ligt er een andere selectie van tien koninkrijkkaarten klaar, waardoor er telkens nieuwe strategieën en combinaties mogelijk zijn. Ondanks de eenvoudige regels zit er verrassend veel diepgang in: investeer je in extra acties, meer geld, of ga je direct voor overwinningspunten? Wie zijn dek het slimst opbouwt, wint de partij.",
    category: "Strategie",
    theme: "Geschiedenis",
    complexity: 2.35,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 30,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/7wA5w5wWPJZj/Gpk9yy/550x572.jpg",
    productImageUrl: "https://media.s-bol.com/7wA5w5wWPJZj/Gpk9yy/550x572.jpg",
    images: [],
  },
  {
    title: "Skull King",
    shortDescription:
      "Voorspel exact hoeveel slagen je gaat winnen\nen laat piraten en de Skull King je plannen dwarsbomen.",
    description:
      "Skull King is een piratenkaartspel waarin je aan het begin van elke ronde voorspelt hoeveel slagen je denkt te winnen. Een juiste voorspelling levert flink wat punten op, maar mis je de inschatting dan kost het je juist punten. Speciale kaarten zoals zeemeerminnen, piraten en de gevreesde Skull King zelf kunnen de slagen op het laatste moment nog omgooien, waardoor je nooit helemaal zeker bent van je zaak. Naarmate het spel vordert worden de rondes langer en de risico's groter.",
    category: "Kaartspel",
    theme: "Avontuur",
    complexity: 1.9,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 6,
    playTime: 45,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/mg5BzW62gkJ9/v22r5rM/550x704.jpg",
    productImageUrl: "https://media.s-bol.com/mg5BzW62gkJ9/v22r5rM/550x704.jpg",
    images: [],
  },
  {
    title: "Coup",
    shortDescription:
      "Bluf je een weg naar de macht met geheime invloedkaarten\nen schakel de invloed van je tegenstanders uit.",
    description:
      "In Coup vecht je in een klein stadstaatje om macht en invloed. Iedere speler heeft twee geheime kaarten met bijzondere krachten, zoals de Hertog, de Moordenaar of de Gravin, maar niemand weet welke kaarten de anderen daadwerkelijk hebben. Je kunt acties claimen die je eigenlijk niet mag uitvoeren en hopen dat niemand je durft uit te dagen. Word je betrapt op bluffen, dan verlies je een van je kaarten, en daarmee een deel van je invloed. Ben je de laatste met invloed over, dan win je.",
    category: "Party",
    theme: "Spionage",
    complexity: 1.42,
    minAge: 13,
    minPlayers: 2,
    maxPlayers: 6,
    playTime: 15,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/MWhSY_GOe2-bmlQ2rntSVg__itemrep/img/QRw3T5XGsrRs-QKCSpzwE7nFqOg=/fit-in/246x300/filters:strip_icc()/pic2016054.jpg",
    productImageUrl:
      "https://cf.geekdo-images.com/MWhSY_GOe2-bmlQ2rntSVg__itemrep/img/QRw3T5XGsrRs-QKCSpzwE7nFqOg=/fit-in/246x300/filters:strip_icc()/pic2016054.jpg",
    images: [],
  },
  {
    title: "Parade",
    shortDescription:
      "Speel een kaart in de parade en reken uit welke je moet nemen.\nEindig met zo min mogelijk punten om te winnen.",
    description:
      "Parade speelt zich af in Wonderland, waar je om de beurt een kaart in de parade legt. Afhankelijk van de waarde en kleur van je kaart moet je soms kaarten uit de parade oprapen en aan je eigen verzameling toevoegen. Dat klinkt eenvoudig, maar iedere kaart die je opraapt telt aan het einde mee als strafpunten, tenzij je er genoeg van dezelfde kleur hebt verzameld. Het spel draait om vooruitdenken: soms is een kaart die je juist niet wilt spelen de beste zet.",
    category: "Kaartspel",
    theme: "Fantasie",
    complexity: 1.46,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 6,
    playTime: 45,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/lmRNihICb4mklj0ec1vj6g__itemrep/img/NaSN5LslCQcpOCBu2ixeZ7nymPI=/fit-in/246x300/filters:strip_icc()/pic2239001.jpg",
    productImageUrl:
      "https://cf.geekdo-images.com/lmRNihICb4mklj0ec1vj6g__itemrep/img/NaSN5LslCQcpOCBu2ixeZ7nymPI=/fit-in/246x300/filters:strip_icc()/pic2239001.jpg",
    images: [],
  },
  {
    title: "Tichu",
    shortDescription:
      "Speel samen met je partner je kaarten zo snel mogelijk weg\nen waag een gedurfde Tichu-gok voor bonuspunten.",
    description:
      "Tichu is een snel kaartspel voor twee vaste teams van elk twee spelers, die tegenover elkaar aan tafel zitten. Doel is om als eerste van je team alle kaarten kwijt te raken door steeds sterkere combinaties op tafel te leggen. Wie durft, kan aan het begin van een ronde een Tichu aankondigen: een gok dat je als allereerste al je kaarten wegspeelt, wat een flinke bonus oplevert als het lukt, maar juist puntenverlies als het misgaat. Door de samenwerking met je partner en de spanning van de aankondigingen blijft elke ronde spannend tot de laatste kaart.",
    category: "Kaartspel",
    theme: "Overig",
    complexity: 2.35,
    minAge: 10,
    minPlayers: 4,
    maxPlayers: 4,
    playTime: 60,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/gz8_8iYP2SSGVAxpp7CwLg__itemrep/img/lnzwJvF8Ez8vuV_QBKXuvqiWcK8=/fit-in/246x300/filters:strip_icc()/pic5854968.png",
    productImageUrl:
      "https://cf.geekdo-images.com/gz8_8iYP2SSGVAxpp7CwLg__itemrep/img/lnzwJvF8Ez8vuV_QBKXuvqiWcK8=/fit-in/246x300/filters:strip_icc()/pic5854968.png",
    images: [],
  },
  {
    title: "Dungeon Mayhem",
    shortDescription:
      "Kies een held en bestook je tegenstanders met actiekaarten\nom als laatste avonturier overeind te blijven.",
    description:
      "In Dungeon Mayhem kies je een van de vier avonturiers, zoals de barbaar, de paladijn, de schurk of de tovenaar, elk met een eigen kaartenstapel vol speciale acties. Je speelt razendsnel kaarten om schade toe te brengen aan je tegenstanders, jezelf te genezen of je te verdedigen tegen aanvallen. Doordat een partij maar enkele minuten duurt, speel je al snel een revanche. Het felle, chaotische spelverloop maakt Dungeon Mayhem een ideaal spel om tussendoor te spelen.",
    category: "Kaartspel",
    theme: "Fantasie",
    complexity: 1.15,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 10,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/faJfKYz6tG8JvDYqYHBjHg__itemrep/img/KHoxN3JiwDTqAibJdkagE4T7n_M=/fit-in/246x300/filters:strip_icc()/pic5322689.jpg",
    productImageUrl:
      "https://cf.geekdo-images.com/faJfKYz6tG8JvDYqYHBjHg__itemrep/img/KHoxN3JiwDTqAibJdkagE4T7n_M=/fit-in/246x300/filters:strip_icc()/pic5322689.jpg",
    images: [],
  },
  {
    title: "Power Hungry Pets",
    shortDescription:
      "Zet de speciale kracht van jouw dier in\nom als laatste speler nog mee te doen.",
    description:
      "Power Hungry Pets is een hervertelling van het populaire Love Letter, waarbij je met dierlijke krachten probeert de andere spelers uit te schakelen. Elke ronde speel je één kaart uit je hand, telkens met een eigen, vaak hilarische manier om medespelers te dwarsbomen, te ontmaskeren of uit het spel te gooien. Doordat elke ronde razendsnel voorbij is en de kaarten heel direct op elkaar inspelen, is het een luidruchtig en toegankelijk spel voor jong en oud.",
    category: "Party",
    theme: "Overig",
    complexity: 1.15,
    minAge: 7,
    minPlayers: 2,
    maxPlayers: 6,
    playTime: 15,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/L3Ag19WXRFKjKmRSCMI9UQ__itemrep/img/9lVfL1LHR-zSnrn8BhNHkhdJjKk=/fit-in/246x300/filters:strip_icc()/pic7959893.png",
    productImageUrl:
      "https://cf.geekdo-images.com/L3Ag19WXRFKjKmRSCMI9UQ__itemrep/img/9lVfL1LHR-zSnrn8BhNHkhdJjKk=/fit-in/246x300/filters:strip_icc()/pic7959893.png",
    images: [],
  },
  {
    title: "Kingdomino",
    shortDescription:
      "Trek tegels om je koninkrijk vorm te geven\nen scoor punten met de mooiste gebieden.",
    description:
      "In Kingdomino trek je per beurt een dominotegel met twee landschapstypes en leg je die aan je eigen koninkrijk vast. Elke tegel toont ook een waarde, en hoe hoger die waarde, hoe later je aan de beurt bent om een nieuwe tegel te kiezen - een mooie balans tussen sterke tegels pakken en op tijd aan de beurt blijven. Aan het einde van het spel scoor je per aaneengesloten gebied het aantal tegels vermenigvuldigd met het aantal kronen erop. Simpele regels, maar genoeg keuzestress om iedere partij spannend te houden.",
    category: "Familie",
    theme: "Geschiedenis",
    complexity: 1.2,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 20,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/RNYqQ62jXyoq/1jkVY2G/550x589.jpg",
    productImageUrl: "https://media.s-bol.com/RNYqQ62jXyoq/1jkVY2G/550x589.jpg",
    images: [],
  },
  {
    title: "Unlock!: Star Wars Escape Game",
    shortDescription:
      "Los samen puzzels op tegen de klok\nin dit coöperatieve escape-kaartspel.",
    description:
      "Unlock! is een coöperatief escape-room-kaartspel waarbij je met een stapel kaarten en een gratis app tegen de klok raadsels oplost. In deze Star Wars-editie doorzoek je scènes uit het bekende universum op zoek naar aanwijzingen, combineer je voorwerpen en ontcijfer je codes om steeds dichter bij de uitgang te komen. Er is geen bord nodig: alles gebeurt via de kaarten en de app, die ook geluidseffecten en hints toevoegt. Werk goed samen en let op de tijd, want je hebt maar een beperkt aantal pogingen.",
    category: "Party",
    theme: "Ruimte & Sci-fi",
    complexity: 1.7,
    minAge: 10,
    minPlayers: 1,
    maxPlayers: 6,
    playTime: 60,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/rDw638QR589p/GZoVqXL/532x840.jpg",
    productImageUrl: "https://media.s-bol.com/rDw638QR589p/GZoVqXL/532x840.jpg",
    images: [],
  },
  {
    title: "De Legenden van Andor",
    shortDescription:
      "Verdedig als held het land Andor tegen monsters\nen voltooi samen het verhaal van de legende.",
    description:
      "In De Legenden van Andor kruip je met je medespelers in de huid van helden die het fantasieland Andor moeten beschermen tegen trollen, draken en andere gevaren. Het spel bouwt stap voor stap op: je begint met een eenvoudige legende en leert de regels al spelend, terwijl latere legendes steeds complexere uitdagingen met zich meebrengen. Omdat het bord telkens anders wordt opgebouwd en de gebeurtenissen per potje verschillen, is elk avontuur weer anders. Werk samen, verdeel de taken slim en probeer de legende te voltooien voordat de duisternis toeslaat.",
    category: "Strategie",
    theme: "Fantasie",
    complexity: 2.4,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 75,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/gGrw3NEXGmor/Kg77EJ/550x583.jpg",
    productImageUrl: "https://media.s-bol.com/gGrw3NEXGmor/Kg77EJ/550x583.jpg",
    images: [],
  },
  {
    title: "CuBirds",
    shortDescription:
      "Leg vogels aan bij rijtjes op tafel\nen verzamel als eerste 7 verschillende soorten.",
    description:
      "In CuBirds speel je telkens al je kaarten van dezelfde vogelsoort bij een van de vier rijtjes op tafel. Sluit je daarmee vogels van dezelfde soort in aan weerskanten, dan mag je die opnemen als bewijs dat je die soort hebt verzameld. Wie als eerste zeven verschillende vogelsoorten heeft gespot, wint. De kleurrijke kaarten en simpele regels maken het een luchtig kaartspel dat razendsnel te leren is, met net genoeg tactiek om het interessant te houden.",
    category: "Kaartspel",
    theme: "Natuur",
    complexity: 1.1,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 5,
    playTime: 20,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/g3yzk4o5k7WG/nZv4WEE/550x568.jpg",
    productImageUrl: "https://media.s-bol.com/g3yzk4o5k7WG/nZv4WEE/550x568.jpg",
    images: [],
  },
  {
    title: "Cascadia",
    shortDescription:
      "Leg landschapstegels en dierenpionnen\nom het mooiste natuurgebied van Cascadia te bouwen.",
    description:
      "In Cascadia bouw je een eigen stukje wildernis in het noordwesten van Amerika. Elke beurt kies je een combinatie van een landschapstegel en een diersteen, waarmee je jouw gebied verder uitbreidt. Bossen, rivieren en bergen moet je slim naast elkaar leggen, terwijl dieren zoals zalmen, beren en adelaars elk hun eigen scoreregels hebben. Omdat andere spelers ook uit dezelfde opties kunnen kiezen, is timing minstens zo belangrijk als een goed doordacht landschap.",
    category: "Familie",
    theme: "Natuur",
    complexity: 1.8,
    minAge: 10,
    minPlayers: 1,
    maxPlayers: 4,
    playTime: 45,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/PL7YnOxxz24W/76qNX8r/550x550.jpg",
    productImageUrl: "https://media.s-bol.com/PL7YnOxxz24W/76qNX8r/550x550.jpg",
    images: [],
  },
  {
    title: "Jaipur",
    shortDescription:
      "Handel in kruiden, zijde en edelstenen op de markt van Jaipur\nen word de rijkste handelaar van de stad.",
    description:
      "Jaipur is een snel kaartspel voor precies twee spelers, waarin jullie als rivaliserende handelaren goederen verzamelen en verkopen op de markt van Jaipur. Elke beurt neem je kaarten van de markt of ruil je een aantal van je eigen kaarten om, waarna je verzamelde waren kunt verkopen voor beloningskaarten. Hoe meer je in één keer verkoopt, hoe hoger de beloning, maar wachten is riskant omdat de waarde van goederen daalt naarmate er meer van verkocht wordt. Compact, snel en met net genoeg spanning om steeds een revanche te willen.",
    category: "Kaartspel",
    theme: "Handel",
    complexity: 1.5,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 2,
    playTime: 30,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/7KV42M744lVA/vg0L12V/550x760.jpg",
    productImageUrl: "https://media.s-bol.com/7KV42M744lVA/vg0L12V/550x760.jpg",
    images: [],
  },
  {
    title: "Port Royal",
    shortDescription:
      "Waag een gokje op zee en verzamel scheepskaarten\nzonder dat de piraten je fortuin inpikken.",
    description:
      "In Port Royal draai je steeds kaarten om van een gemeenschappelijke stapel, met de kans op muitende matrozen of juist waardevolle schepen en persoonskaarten. Hoe langer je doorgaat, hoe meer je kunt verdienen, maar bij twee gelijke gevarenkaarten loop je alles mis wat je die beurt nog niet veilig hebt gesteld. Met het verdiende geld koop je schepen en huur je bemanningsleden in die aan het eind van het spel punten opleveren. Het is een spel van goed inschatten wanneer je moet stoppen met pushen.",
    category: "Kaartspel",
    theme: "Avontuur",
    complexity: 1.6,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 5,
    playTime: 30,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/3pDjNJRxZXEp/RQmyx0/550x765.jpg",
    productImageUrl: "https://media.s-bol.com/3pDjNJRxZXEp/RQmyx0/550x765.jpg",
    images: [],
  },
  {
    title: "Harmonies",
    shortDescription:
      "Bouw een kleurrijk landschap met natuurstenen\nen lok de juiste dieren naar jouw leefgebied.",
    description:
      "In Harmonies plaats je gekleurde natuurstenen op je eigen bordje om een gevarieerd landschap te vormen: bergen, water, bos en meer. Zodra bepaalde combinaties van landschappen ontstaan, mag je daar dieren aan toevoegen, die elk weer eigen voorkeuren hebben voor het soort omgeving waarin ze willen leven. Omdat je steeds moet kiezen uit een beperkt aanbod stenen, draait het spel om vooruitdenken en het beste maken van wat er beschikbaar is. Het resultaat is een klein kunstwerkje van een landschap, uniek bij elke partij.",
    category: "Familie",
    theme: "Natuur",
    complexity: 1.8,
    minAge: 10,
    minPlayers: 1,
    maxPlayers: 4,
    playTime: 30,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/qn8k6RLVZoB2/DkqKoRB/550x583.jpg",
    productImageUrl: "https://media.s-bol.com/qn8k6RLVZoB2/DkqKoRB/550x583.jpg",
    images: [],
  },
  {
    title: "De Kwakzalvers van Kakelenburg",
    shortDescription:
      "Brouw de krachtigste drank door ingrediënten uit je zakje te trekken\nzonder dat je drankje ontploft.",
    description:
      "In De Kwakzalvers van Kakelenburg brouw je als kwakzalver je eigen wonderdrankje door blindelings chips uit je stoffen zakje te trekken en op je persoonlijke brouwpad te leggen. Elk ingrediënt heeft een eigen effect, maar te veel rode kersen-chips laten je drankje ontploffen en kost je punten. Naarmate het spel vordert koop je steeds krachtigere ingrediënten bij, waardoor je zakje groeit en de risico's toenemen. Het spannende afwegen tussen doorgaan en stoppen maakt elke ronde weer een gokje waard.",
    category: "Familie",
    theme: "Overig",
    complexity: 2,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 45,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/qVVAXxkg6367/9rLZWOx/550x580.jpg",
    productImageUrl: "https://media.s-bol.com/qVVAXxkg6367/9rLZWOx/550x580.jpg",
    images: [],
  },
  {
    title: "Stuffed Fables",
    shortDescription:
      "Speel als knuffelbeest en bescherm het kind tegen monsters onder het bed\nin dit coöperatieve verhaalspel.",
    description:
      "Stuffed Fables vertelt het verhaal van een groepje knuffeldieren dat 's nachts tot leven komt om hun kind te beschermen tegen de monsters die zich onder het bed en in de kast verschuilen. Samen doorloop je een reeks hoofdstukken die elk hun eigen kaart, gebeurtenissen en gevechten hebben, waarbij keuzes uit eerdere hoofdstukken invloed kunnen hebben op wat er later gebeurt. Het is een coöperatief avontuur waarbij samenwerking en een beetje geluk met de dobbelstenen bepalen of jullie het einde van het verhaal halen.",
    category: "Strategie",
    theme: "Fantasie",
    complexity: 2.5,
    minAge: 7,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 75,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/CS83e1WOA5WMc4izRw6zwg__itemrep/img/c0tknkGbz4yq8wb2Abysj6hKd_k=/fit-in/246x300/filters:strip_icc()/pic3708878.jpg",
    productImageUrl:
      "https://cf.geekdo-images.com/CS83e1WOA5WMc4izRw6zwg__itemrep/img/c0tknkGbz4yq8wb2Abysj6hKd_k=/fit-in/246x300/filters:strip_icc()/pic3708878.jpg",
    images: [],
  },
  {
    title: "7 Wonders",
    shortDescription:
      "Bouw je beschaving uit met gebouwen en wonderen van de wereld\nen word de machtigste stad van de oudheid.",
    description:
      "In 7 Wonders leid je een van de grote steden van de oudheid en bouw je die uit tot een bloeiende beschaving. Elke ronde kies je een kaart uit je hand om te spelen en geef je de rest door aan je buurman, waardoor je voortdurend moet inspelen op wat er beschikbaar is. Met kaarten bouw je grondstoffen, wetenschap, militaire macht of handel op, en kun je zelfs een van de zeven wereldwonderen laten verrijzen. Aan het einde van drie tijdperken scoor je punten op meerdere vlakken tegelijk, waardoor verschillende strategieën tot een overwinning kunnen leiden.",
    category: "Strategie",
    theme: "Geschiedenis",
    complexity: 2.3,
    minAge: 10,
    minPlayers: 3,
    maxPlayers: 7,
    playTime: 30,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/nKYoX2B87EEP/mORrpPA/550x532.jpg",
    productImageUrl: "https://media.s-bol.com/nKYoX2B87EEP/mORrpPA/550x532.jpg",
    images: [],
  },
  {
    title: "Arkham Horror: The Card Game",
    shortDescription:
      "Onderzoek griezelige mysteries in Lovecrafts wereld\nen bouw je eigen kaartendek om het kwaad te bestrijden.",
    description:
      "In Arkham Horror: The Card Game kruip je in de huid van een onderzoeker die zich mengt in bovennatuurlijke mysteries geïnspireerd op het werk van H.P. Lovecraft. Je bouwt een eigen kaartendek met vaardigheden, wapens en bondgenoten, waarmee je aanwijzingen verzamelt, tegen monsters vecht en de campagne door meerdere scenario's heen speelt. Keuzes die je in het ene scenario maakt, hebben gevolgen voor de volgende, waardoor je verhaal echt van jou wordt. Het is een diepgaand, verhalend kaartspel dat het best tot zijn recht komt over een langere campagne.",
    category: "Strategie",
    theme: "Fantasie",
    complexity: 3.2,
    minAge: 14,
    minPlayers: 1,
    maxPlayers: 2,
    playTime: 90,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/j3omnLR4QONv/JqZQvEo/550x726.jpg",
    productImageUrl: "https://media.s-bol.com/j3omnLR4QONv/JqZQvEo/550x726.jpg",
    images: [],
  },
  {
    title: "One Night Ultimate Werewolf",
    shortDescription:
      "Ontdek in één nacht wie de weerwolven zijn\nvoordat het dorp de verkeerde persoon verbant.",
    description:
      "In One Night Ultimate Werewolf krijgt iedereen in het geheim een rol, van onschuldig dorpeling tot sluwe weerwolf. Tijdens de ene nachtfase voeren spelers met speciale rollen in stilte hun acties uit, waarna iedereen wakker wordt en er hardop gediscussieerd wordt over wie er verdacht is. Na een korte, chaotische discussie stemt iedereen tegelijk op wie er verbannen wordt. Omdat een hele ronde maar enkele minuten duurt, speel je binnen een kwartier al een paar potjes achter elkaar.",
    category: "Party",
    theme: "Fantasie",
    complexity: 1.3,
    minAge: 8,
    minPlayers: 3,
    maxPlayers: 10,
    playTime: 10,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/xMDm3wmgzklz/KOvVx2R/550x473.jpg",
    productImageUrl: "https://media.s-bol.com/xMDm3wmgzklz/KOvVx2R/550x473.jpg",
    images: [],
  },
  {
    title: "Keltis",
    shortDescription:
      "Speel kaarten in oplopende of aflopende volgorde\nen zet je stenen zo ver mogelijk op de Keltische paden.",
    description:
      "In Keltis speel je kaarten in stijgende of dalende volgorde op vijf verschillende gekleurde paden om je stenen daarop steeds verder vooruit te zetten. Hoe verder een steen op een pad staat, hoe meer punten die aan het einde oplevert, maar een verkeerde kaart kan een pad juist blokkeren. Bonusstenen langs de paden geven extra beloningen als je er als eerste voorbij komt. De simpele regels in combinatie met de spanning van op tijd stoppen of doorzetten maken Keltis toegankelijk voor het hele gezin.",
    category: "Familie",
    theme: "Geschiedenis",
    complexity: 1.6,
    minAge: 10,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 30,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/GnKS0zE-EkuYfCrEUIlfzA__itemrep/img/DyayUfNRjWzAQWJYztn8FAL6H04=/fit-in/246x300/filters:strip_icc()/pic382457.jpg",
    productImageUrl:
      "https://cf.geekdo-images.com/GnKS0zE-EkuYfCrEUIlfzA__itemrep/img/DyayUfNRjWzAQWJYztn8FAL6H04=/fit-in/246x300/filters:strip_icc()/pic382457.jpg",
    images: [],
  },
  {
    title: "Wingspan",
    shortDescription:
      "Bouw een prachtig vogelreservaat op\nen lok steeds nieuwe vogelsoorten naar je habitats.",
    description:
      "In Wingspan bouw je als vogelliefhebber een eigen netwerk van vogelreservaten in bos, grasland en waterrijk gebied. Elke vogel die je speelt heeft een unieke kracht die je activeert door voedsel, eieren of extra kaarten te verzamelen, waardoor je engine steeds krachtiger wordt naarmate het spel vordert. Met prachtig geïllustreerde kaarten van échte vogelsoorten en meerdere manieren om punten te scoren, kun je op verschillende strategieën inzetten. Het is een rustig, opbouwend spel dat zowel beginners als ervaren spelers weet te boeien.",
    category: "Strategie",
    theme: "Natuur",
    complexity: 2.4,
    minAge: 10,
    minPlayers: 1,
    maxPlayers: 5,
    playTime: 60,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/ZjwovnlZ5XZE/lx5k1Rl/550x583.jpg",
    productImageUrl: "https://media.s-bol.com/ZjwovnlZ5XZE/lx5k1Rl/550x583.jpg",
    images: [],
  },
  {
    title: "Paleo",
    shortDescription:
      "Overleef samen als steentijdstam door te jagen, te verzamelen en te ontdekken\nin dit coöperatieve avontuur.",
    description:
      "In Paleo werk je samen met je stam om te overleven in de prehistorie. Door kaarten in stilte te kiezen en tegelijk om te draaien, verken je de omgeving, jaag je op dieren of ontdek je nieuwe technologieën, zonder van tevoren te weten wat de anderen kiezen. Elke sessie bestaat uit meerdere korte scenario's die samen een groter verhaal vertellen, met eigen doelen en verrassingen. Doordat het spel zonder voorleeswerk speelt via afbeeldingen op de kaarten, ontdek je gaandeweg spelend de regels en de wereld van Paleo.",
    category: "Strategie",
    theme: "Overig",
    complexity: 1.9,
    minAge: 10,
    minPlayers: 1,
    maxPlayers: 4,
    playTime: 40,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/wxJjA9zQGqQX/MAKk71/550x583.jpg",
    productImageUrl: "https://media.s-bol.com/wxJjA9zQGqQX/MAKk71/550x583.jpg",
    images: [],
  },
  {
    title: "Heat: Pedal to the Metal",
    shortDescription:
      "Beheer je snelheid en motorwarmte op het circuit\nen finish als eerste over de streep.",
    description:
      "In Heat: Pedal to the Metal race je met kaarten in de hand over een van de circuits, waarbij je steeds moet afwegen hoeveel snelheidskaarten je speelt en hoeveel hittekaarten je daarvoor terugneemt. Slipstream achter andere auto's, kies slim je route in de bochten en zorg dat je motor niet oververhit raakt op het verkeerde moment. Met verschillende circuits en optionele kampioenschapsregels biedt het spel genoeg variatie voor herhaald spelplezier. Het combineert het gevoel van een echte race met overzichtelijke kaartspelmechanismen.",
    category: "Familie",
    theme: "Overig",
    complexity: 2.1,
    minAge: 10,
    minPlayers: 1,
    maxPlayers: 6,
    playTime: 60,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/ozqPqk2ZOGjN/Z4N9QxE/550x550.jpg",
    productImageUrl: "https://media.s-bol.com/ozqPqk2ZOGjN/Z4N9QxE/550x550.jpg",
    images: [],
  },
  {
    title: "Bohnanza",
    shortDescription:
      "Plant bonen op je bonenvelden en onderhandel handig met andere spelers\nom je oogst zo winstgevend mogelijk te verkopen.",
    description:
      "In Bohnanza plant je verschillende soorten bonen op je beperkte aantal bonenvelden en verkoop je je oogst voor geld zodra je genoeg van dezelfde soort hebt. Het lastige is dat je je kaarten niet mag herschikken en dus vaak bonen kwijt wil die je net getrokken hebt, wat de onderhandelingen met andere spelers tot de kern van het spel maakt. Door slim te ruilen en te schenken probeer je zoveel mogelijk waarde uit je bonen te halen voordat je ze moet planten. Het luchtige thema en de constante interactie maken Bohnanza een tijdloze klassieker aan de speeltafel.",
    category: "Kaartspel",
    theme: "Natuur",
    complexity: 1.9,
    minAge: 12,
    minPlayers: 3,
    maxPlayers: 5,
    playTime: 45,
    totalCopies: 1,
    imageUrl: "https://media.s-bol.com/7AOrV920N9jy/550x720.jpg",
    productImageUrl: "https://media.s-bol.com/7AOrV920N9jy/550x720.jpg",
    images: [],
  },
  {
    title: "Dice Throne: Season One",
    shortDescription:
      "Kies een held, gooi met speciale dobbelstenen\nen versla je tegenstanders met unieke vaardigheden.",
    description:
      "In Dice Throne kies je een van de unieke helden, elk met een eigen setje dobbelstenen, vaardigheidskaarten en speciale krachten. Door slim te gooien en herwerpen probeer je combinaties te vinden die schade toebrengen, jezelf genezen of speciale effecten activeren tegen je tegenstanders. Elke held speelt compleet anders, waardoor de duels steeds weer een andere aanpak vragen. Het is een toegankelijk maar tactisch dobbelspel dat het best tot zijn recht komt in een één-op-één duel of kleine groep.",
    category: "Strategie",
    theme: "Fantasie",
    complexity: 2.1,
    minAge: 8,
    minPlayers: 2,
    maxPlayers: 6,
    playTime: 30,
    totalCopies: 1,
    imageUrl:
      "https://cf.geekdo-images.com/crZpafHHxItU5EWPCgNbPA__itemrep/img/iU41KJmhBxq_w0yCK9-IYC1N-hw=/fit-in/246x300/filters:strip_icc()/pic3962955.jpg",
    productImageUrl:
      "https://cf.geekdo-images.com/crZpafHHxItU5EWPCgNbPA__itemrep/img/iU41KJmhBxq_w0yCK9-IYC1N-hw=/fit-in/246x300/filters:strip_icc()/pic3962955.jpg",
    images: [],
  },
];

async function main() {
  const adminEmail = "admin@bordspellen.nl";
  const adminPassword = "admin1234";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Beheerder",
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: "ADMIN",
      },
    });
    console.log(`Admin aangemaakt: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin bestaat al, overgeslagen.");
  }

  for (const { images, ...game } of GAMES) {
    const existing = await prisma.game.findFirst({
      where: { title: game.title },
    });

    const gameId = existing
      ? existing.id
      : (await prisma.game.create({ data: game })).id;

    if (existing) {
      await prisma.game.update({ where: { id: existing.id }, data: game });
    }

    await prisma.gameImage.deleteMany({ where: { gameId } });
    if (images && images.length > 0) {
      await prisma.gameImage.createMany({
        data: images.map((url, order) => ({ gameId, url, order })),
      });
    }
  }
  console.log(`${GAMES.length} spellen bijgewerkt in de catalogus.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
