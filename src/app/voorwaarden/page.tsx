import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene voorwaarden | Level5 Lease & Play",
  description: "Algemene voorwaarden voor het huren van bordspellen.",
};

const DAMAGE_TABLE = [
  {
    situation: "Normale gebruikssporen (lichte sleet op de doos, verkleuring)",
    fee: "Geen kosten",
  },
  {
    situation:
      "Lichte schade (gekreukte/gescheurde doos, vlekken op kaarten of onderdelen)",
    fee: "10% van de aanschafprijs",
  },
  {
    situation: "Ontbrekend klein onderdeel (kaart, fiche, dobbelsteen, pion)",
    fee: "€ 2,50 per onderdeel, tot max. 25% van de aanschafprijs",
  },
  {
    situation: "Ontbrekend essentieel onderdeel (spelbord, handleiding, doos)",
    fee: "25% van de aanschafprijs",
  },
  {
    situation: "Onbruikbaar, onherstelbaar beschadigd, vermist of gestolen",
    fee: "100% van de aanschafprijs",
  },
];

function Article({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 py-6 first:border-t-0 first:pt-0 dark:border-cream/10">
      <h2 className="mb-2 font-display text-xl font-semibold">
        {number}. {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  );
}

export default function VoorwaardenPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 font-display text-3xl font-semibold">
        Algemene voorwaarden
      </h1>
      <p className="mb-6 text-sm text-foreground/60">
        Laatst bijgewerkt: 10 augustus 2026. Deze voorwaarden zijn van
        toepassing op elke aanvraag en verhuring via Level5 Lease & Play.
      </p>

      <Article number={1} title="Definities">
        <ul className="list-inside list-disc">
          <li>
            <strong>Verhuurder</strong>: Level5 Lease & Play, aanbieder van de
            spellen op deze website.
          </li>
          <li>
            <strong>Huurder</strong>: de klant die via de website een spel
            aanvraagt.
          </li>
          <li>
            <strong>Aanschafprijs</strong>: het volledige bedrag dat de
            huurder vooraf betaalt, gelijk aan de winkelwaarde van het spel.
          </li>
          <li>
            <strong>Huurbedrag</strong>: het deel van de aanschafprijs dat de
            huurder verschuldigd is, afhankelijk van het aantal dagen dat het
            spel in bezit is.
          </li>
          <li>
            <strong>Restitutie</strong>: aanschafprijs minus het huurbedrag,
            terugbetaald bij het terugbrengen van het spel.
          </li>
        </ul>
      </Article>

      <Article number={2} title="Hoe het huurmodel werkt">
        <p>
          Level5 Lease & Play werkt niet met een vaste prijs per dag, maar met
          een leasemodel: de huurder betaalt vooraf de volledige
          aanschafprijs van het spel. Bij het terugbrengen wordt het
          huurbedrag berekend op basis van het werkelijke aantal dagen dat het
          spel in bezit is geweest, volgens een aflopende staffel (de eerste
          dagen wegen zwaarder mee dan latere dagen). Het verschil tussen de
          aanschafprijs en het huurbedrag wordt aan de huurder terugbetaald.
        </p>
        <p>
          Na 56 dagen (8 weken) is de aanschafprijs volledig verbruikt. Het
          spel is dan definitief eigendom van de huurder en er vindt geen
          restitutie meer plaats, ongeacht of het spel wordt teruggebracht.
        </p>
        <p>
          De bij de aanvraag opgegeven begin- en einddatum zijn indicatief.
          Voor de berekening van het huurbedrag telt de datum waarop het spel
          daadwerkelijk is opgehaald tot de datum waarop het daadwerkelijk is
          teruggebracht.
        </p>
      </Article>

      <Article number={3} title="Totstandkoming van de overeenkomst">
        <p>
          Een aanvraag via de website is een verzoek, geen bevestigde boeking.
          De overeenkomst komt tot stand op het moment dat Bordspellen
          Verhuur de aanvraag bevestigt. De huurder ontvangt hiervan bericht
          via de status bij &quot;Mijn aanvragen&quot;.
        </p>
        <p>
          De aanschafprijs dient te zijn voldaan voordat het spel wordt
          meegegeven. Zolang de betaling niet is ontvangen, kan Bordspellen
          Verhuur de afgifte van het spel opschorten.
        </p>
      </Article>

      <Article number={4} title="Zorgplicht van de huurder">
        <p>
          De huurder gaat zorgvuldig met het gehuurde spel om en gebruikt het
          uitsluitend voor normaal, huishoudelijk speelgebruik. Het spel mag
          niet worden onderverhuurd of aan derden worden uitgeleend zonder
          toestemming van Level5 Lease & Play.
        </p>
        <p>
          Het spel dient compleet en in dezelfde staat te worden
          teruggebracht als waarin het is ontvangen, met inachtneming van
          normale gebruikssporen.
        </p>
      </Article>

      <Article number={5} title="Schade en ontbrekende onderdelen">
        <p>
          Bij het terugbrengen wordt het spel gecontroleerd op volledigheid
          en staat. Is er sprake van schade of ontbreken er onderdelen, dan
          wordt hiervoor een bedrag in rekening gebracht volgens onderstaande
          staffel. Dit bedrag wordt eerst verrekend met de restitutie; is de
          restitutie lager dan het aangerekende bedrag (of al € 0, omdat het
          spel langer dan 8 weken in bezit was), dan ontvangt de huurder
          hiervoor een aparte factuur.
        </p>
        <div className="overflow-x-auto rounded-lg border border-ink/10 dark:border-cream/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-cream-muted dark:bg-ink-muted">
                <th className="px-3 py-2 font-medium">Situatie</th>
                <th className="px-3 py-2 font-medium">Bedrag</th>
              </tr>
            </thead>
            <tbody>
              {DAMAGE_TABLE.map((row, i) => (
                <tr
                  key={row.situation}
                  className={i % 2 === 0 ? "bg-cream-muted/50 dark:bg-ink-muted/50" : ""}
                >
                  <td className="px-3 py-2">{row.situation}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-medium">
                    {row.fee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-foreground/60">
          De genoemde bedragen zijn richtbedragen. Bij twijfel of bij schade
          die niet in bovenstaande staffel past, bepaalt Level5 Lease & Play
          in redelijkheid het verschuldigde bedrag, waarbij rekening wordt
          gehouden met de daadwerkelijke reparatie- of vervangingskosten.
        </p>
      </Article>

      <Article number={6} title="Annuleren">
        <p>
          Een aanvraag die nog &quot;In afwachting&quot; is, kan de huurder
          kosteloos annuleren via &quot;Mijn aanvragen&quot;. Na bevestiging
          door Level5 Lease & Play is annuleren alleen mogelijk in overleg.
        </p>
      </Article>

      <Article number={7} title="Herroepingsrecht">
        <p>
          Omdat het gaat om een dienst met een vooraf overeengekomen periode
          voor vrijetijdsbesteding, is het wettelijke herroepingsrecht van 14
          dagen dat normaal voor online aankopen geldt hierop niet van
          toepassing (art. 6:230p sub e Burgerlijk Wetboek).
        </p>
      </Article>

      <Article number={8} title="Aansprakelijkheid">
        <p>
          Level5 Lease & Play is niet aansprakelijk voor schade die ontstaat
          door onjuist gebruik van het gehuurde spel. De aansprakelijkheid
          van Level5 Lease & Play is in alle gevallen beperkt tot het bedrag
          van de aanschafprijs van het betreffende spel.
        </p>
      </Article>

      <Article number={9} title="Klachten">
        <p>
          Klachten over een spel of de afhandeling van een aanvraag kunnen
          worden gemeld via de contactgegevens op deze website. Bordspellen
          Verhuur streeft ernaar binnen 14 dagen te reageren.
        </p>
      </Article>

      <Article number={10} title="Toepasselijk recht">
        <p>
          Op deze voorwaarden en alle overeenkomsten met Level5 Lease & Play
          is Nederlands recht van toepassing.
        </p>
      </Article>

      <Article number={11} title="Wijzigingen">
        <p>
          Level5 Lease & Play kan deze voorwaarden aanpassen. De meest
          actuele versie is steeds op deze pagina te vinden en geldt voor
          nieuwe aanvragen vanaf het moment van publicatie.
        </p>
      </Article>
    </div>
  );
}
