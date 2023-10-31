const predefinedUsernames = [
    "Monika",
    "Paweł",
    "Patryk",
    "Szymon",
    "Test"
];

const predefinedPhrases = [
    "Ala ma kota",
    "Tak, tak, krowa to piękny ptak, tylko jej skrzydeł brak.",
    "Nie wiadomo, dlaczego wszyscy mówią do kotów „ty”, choć jako żywo żaden kot nigdy z nikim nie pił bruderszaftu.",
    "Na pohybel skurwysynom!",
    "Kiedy myślisz, że gorzej już być nie może, zacznij się walić deską po nodze. Zobaczysz jaką poczujesz ulgę gdy przestaniesz.",
    "Nie ma powodów by bać się trupów, bać się należy raczej żywych.",
    "Kto szuka, ten najczęściej coś znajduje, niestety czasem zgoła nie to, czego mu potrzeba.",
    "Tak to już bywa, że kiedy człowiek ucieka przed swoim strachem, może się przekonać, że zdąża jedynie skrótem na jego spotkanie.",
]

function getPredefinedUsernames(){
    return predefinedUsernames;
}

function getPredefinedPhrases(){
    return predefinedPhrases;
}

export default {getPredefinedPhrases, getPredefinedUsernames};