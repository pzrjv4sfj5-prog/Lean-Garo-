# Check F Allowlist — Structural Gap Report (Claude B, 2026-08-13)

## Purpose

`repository-intelligence.js` Check F allowlists 302 pre-existing mismatches between
`corrections.json`/`phrase_maps.js` (runtime-cascade steps 1/1.5, which win) and
`compiled_dict.json` (step 2, includes `grammarOverrides`). The allowlist stops the build
failing on them, but nothing tracks whether each one is a legitimate register/variant
difference or a silent shadowing bug (the `phrase_maps.js`-invisible-to-`lookupGaro()` and
`grammarOverrides`-invisible-to-verified-precedence bug classes, generalized).

This report buckets all 302 by surface similarity only — **it makes zero claims about
which are bugs**, and proposes zero fixes.

## Cautionary precedent — read before acting on any single item

Investigating `"wait"` (`corrections`=`"Damo"` vs `compiled_dict`=`"Damo/Sengbo"`) looked
like a clear shadowing bug from the data alone. It wasn't: `tests/unit/translationEngine.test.js`
documents RC-CANDIDATE-015 (2026-07-25) — `"Damo / Sengbo"` was itself a literal unresolved
OCR placeholder, already investigated and superseded by native-confirmed values (`"Damo"` for
bare imperative, `"senga"` root for declarative). `corrections.json` was right;
`grammarOverrides` in `prepare-data.js` is the actual stale leftover.

**Lesson: check test files and prior migration docs for each key before treating either
side as authoritative.** The data alone doesn't tell you which value is current.

## Category 1 — No shared root (171 items)

Source value and compiled_dict value share no common word-root after stripping punctuation.
Highest concentration of likely genuine bugs, but also includes deliberate register/sense
splits (imperative vs statement, common vs formal register) — cannot be distinguished
without native review or prior-decision history, per the `wait` lesson above.

| Key | Source | Runtime value (wins) | compiled_dict value |
|---|---|---|---|
| a dog bit me | corrections | Achak Angko chikaha | An·tangko achik chanjok |
| angry | corrections | ka·o·nang·a | bika ding'a |
| apple | corrections | apal | Apple |
| backbone | corrections | kangkare | jangil bolgro |
| bear | phrase_maps | Matmak | Champenga |
| beautiful | corrections | Sila | Ka·danga |
| beautiful | phrase_maps | Sila | Ka·danga |
| begin | corrections | a'ba·cheng·na | a·ba·cheng·a |
| big | phrase_maps | Dal·a | rong·dal·a |
| black | phrase_maps | Gisim | gi·sim |
| bland | phrase_maps | Chibroka | ·brok· |
| blood | phrase_maps | An·chi | ma·rang |
| blue | phrase_maps | Tang·sim | niil |
| boil | phrase_maps | Rita | bi·rot |
| bored | corrections | Arata | a·rat·a |
| boy | phrase_maps | Pante | ko·ka |
| bring | corrections | ra·babo | rim·a |
| buffalo | phrase_maps | Matma | mo·si |
| build | phrase_maps | Rika | gat·a |
| chameleon | corrections | gara | a·ga·tek |
| choose | corrections | basea | ba·si·a |
| church | phrase_maps | Gilja·nok | giil·ja·nok |
| clever | corrections | seng·a | Chalang |
| climb | corrections | maldoa | ga·kata |
| climb | phrase_maps | Maldoa / Gadoa | ga·kata |
| close | phrase_maps | Chip·a | grip·a |
| coins | corrections | tangka bisil | pil· |
| cold | phrase_maps | Sin·a | sol·di |
| cooked | corrections | Song·aha | min·a |
| cough | phrase_maps | Gusua | bu·su·a |
| cow | phrase_maps | Matchu | ma·su |
| crow | phrase_maps | Do·ka | gi·sik·a |
| current | corrections | karen | Dongenggipa |
| curry | corrections | bi·jak | ja·ba |
| cut | phrase_maps | Den·a | rat·a |
| daily | corrections | Salanti | jring·jring |
| dance | corrections | Chroka | Grika |
| dead | corrections | Manggisi | bi·ba bon·chot·a |
| deceive | corrections | Tol·napa | bo·a |
| dirty | phrase_maps | Mitchia | ma·bak·a |
| doctor | phrase_maps | Sam·on·gipa | Doctor / Sam·on·gipa |
| down | corrections | Ka·ma | A·bri ja·pa |
| down | phrase_maps | Ka·ma | A·bri ja·pa |
| dried | corrections | tipjok | gran |
| duck | phrase_maps | Do·gep | ga·gak |
| eagle | phrase_maps | Do·reng | ku·ru·ak |
| ear | phrase_maps | Nachil | na·chil |
| elephant | corrections | buring·o | Mong |
| empty | phrase_maps | Bangbang | bal·ang·ga |
| evening | phrase_maps | Attam | An·tam, Attam |
| expensive | phrase_maps | Dam·raka | rak·a |
| father | phrase_maps | Pa / Apa | pa·a |
| fever | phrase_maps | Sin··ding··a | jom·a |
| few | phrase_maps | On·titi | kom |
| fire | phrase_maps | Wa·al | wal· |
| fly | phrase_maps | Bila | Tampi |
| food | phrase_maps | Mi | al·a |
| forest | corrections | mongma | bring |
| forget | phrase_maps | Guala | gu·al·a |
| girl | phrase_maps | Me·tra | ko·ki |
| give | phrase_maps | On·a | ron·a |
| goat | corrections | dobok | Do·bok |
| gossip | corrections | a·gan·jo·jo·na | Gopo ka·a |
| grandmother | corrections | ambi | am·bi |
| grandmother | phrase_maps | Ambichang | am·bi |
| half | phrase_maps | Jatchi | Brongrik |
| happy | corrections | kusi | han·seng·a |
| he has eaten | corrections | Ua cha·jok | Bia chamanjok. |
| healthy | phrase_maps | An·senga | mang·rak·a |
| help | phrase_maps | Betoi | chak·a |
| help me | phrase_maps | Angko dakchakbo | Dak·chak·bo! |
| horse | phrase_maps | Gure | go·ra |
| hot | phrase_maps | Ding·a | jroa |
| how many | phrase_maps | Baitarong | Badita |
| how much | phrase_maps | Baita? | Badita |
| how much is this | corrections | Iako baita dam? | Baita? |
| hurry up | corrections | Tarkbo | Gong·raka |
| hurry up | phrase_maps | Tarkbo! | Gong·raka |
| jump | phrase_maps | Bildoa | chrok·a |
| know | phrase_maps | Uia | hai·a |
| knowledge | corrections | Uiani ba ma·siani | Gni / Ma·siani |
| land | corrections | a'a | ha·ga |
| language | corrections | ku·sik | ba·sa |
| lead | corrections | dila | si·sa |
| learn | phrase_maps | Sikia | ski·a |
| life | phrase_maps | Janggi | ji·bon |
| live | corrections | donga | tang·a |
| living | corrections | dongenga | git·tang·a |
| log | corrections | dot | bol·tong |
| look | corrections | Nibo | Ni·bo |
| love | corrections | ka·saa | mik·cha·a |
| love | phrase_maps | Ka·saa | mik·cha·a |
| luck | corrections | rasong | a·si |
| money | phrase_maps | Tangka | dang·ga |
| monkey | corrections | Makrew | a·mak |
| monkey | phrase_maps | Makre | a·mak |
| moon | phrase_maps | Jajong | ja·jong |
| morning | phrase_maps | Pring | wal·ni |
| mother | phrase_maps | Ma / Ama | na·gi·pa |
| mountain | corrections | A'bri | ha·chik |
| mouth | phrase_maps | Ku·sik | Cha·mikepa, (Cha·mik·gepa) |
| never | phrase_maps | Pangnan·ba (ja) | ba·sik·o·ba |
| newspaper | corrections | janera | Songbat |
| no | corrections | Ihing | Gri |
| no | phrase_maps | Ong·ja | Gri |
| north | phrase_maps | Salgro | ut·tor |
| old | phrase_maps | Gitcham | o·chol |
| only | corrections | saksakosan | ma·mang |
| open | phrase_maps | Oa | king·tal·a |
| orange | corrections | Narang | a·mnk |
| outside | phrase_maps | A·pal | a'palo |
| plant | corrections | Songna | go·a |
| rabbit | phrase_maps | Sapau | pui·ta |
| rain | corrections | mikka | wa·a |
| rain | phrase_maps | Mikka | wa·a |
| rat | phrase_maps | Mese | me·se |
| read | phrase_maps | Pora | po·ri·a |
| really | phrase_maps | Bebema? | chek·chek |
| really? | phrase_maps | Bebema? | chek·chek |
| remember | phrase_maps | Ku·rachaka | gi·sik ra·a |
| river | phrase_maps | Chibima | no·di |
| road | phrase_maps | Rama | so·rok |
| roam | corrections | rorama | re·am·a |
| room | corrections | kuturi | Room |
| see | corrections | Nika | Gronga |
| see | phrase_maps | Nia | Gronga |
| see you tomorrow | phrase_maps | Knalo nikgen | Atam nikgen |
| sit | phrase_maps | Asong·a | Ba·a |
| skin | corrections | bigi | sol·a |
| skin | phrase_maps | Bigil | sol·a |
| sleep | corrections | Tusia | tu·si·a |
| sleep | phrase_maps | Tusia | tu·si·a |
| smell | corrections | biba | sim·il·ot·a |
| smelly | corrections | senga | kal·ting·a |
| smelly | phrase_maps | Senga | kal·ting·a |
| soft | phrase_maps | Nom·a | min·ek·a |
| some | phrase_maps | mit·am | Badiaba |
| someone | corrections | Saoba | Saksa |
| sorry | phrase_maps | Kema·bi·a. | Kracha·a. |
| soul | corrections | Gisik | jang·gi |
| sour | phrase_maps | Mesenga | me·seng·a |
| spicy | phrase_maps | Jal·ik saa | jroa |
| spider | corrections | guang | gu·ang |
| stomach | phrase_maps | Ok | bik·ma |
| stop | corrections | Sengbo | Champenga |
| stop | phrase_maps | Sengbo | Champenga |
| strong | corrections | bilak | Gong·raka |
| strong | phrase_maps | Bilaka | Gong·raka |
| take | phrase_maps | Ra·a | rim·a |
| take care | corrections | An·tangko simsakbo | Ong·bo dakbo |
| take care | phrase_maps | An·tangko simsakbo | Ong·bo dakbo |
| take revenge | corrections | a·jak soka | a'jak sok·na |
| tall | corrections | changroa | chu·ak·a |
| tasteless | phrase_maps | Chibroka | ·brok· |
| teach | phrase_maps | Sikie on·a | Skia |
| teacher | phrase_maps | Skigipa | ti·char |
| tell | corrections | agana | in·a |
| think | phrase_maps | Gisik·o nanga | chan·chi·a |
| to see | corrections | nika | Gronga |
| to spread | corrections | barama | Badalata |
| to throw | corrections | goata | Gotata |
| today | phrase_maps | Da·alo | Da.alo |
| very | corrections | namen | indakpile |
| well | corrections | chiakol | ku·a |
| what is your name | corrections | Nang·ni bimung mai? | Na·a ni bimungara maia? |
| what is your name | phrase_maps | Nang·ni bimungara maia? | Na·a ni bimungara maia? |
| window | corrections | Kelki | ja·na·la |
| work | corrections | Daka | Kam |
| work | phrase_maps | Dak·a | Kam |
| yes | corrections | Am | Oe |
| you | phrase_maps | Na·a | Nang |

## Category 2 — Shared root, differing form (130 items)

Same word-root, different inflection/suffix/spelling. Likely mostly legitimate
(purposive vs imperative vs bare form is a known, intentional pattern per Check B2's own
design comment) but not verified per-item.

| Key | Source | Runtime value (wins) | compiled_dict value |
|---|---|---|---|
| a tree | corrections | Bol pangsa | Bol |
| always | phrase_maps | Pangnan | pang·na |
| answer | corrections | Aganchaka | Aganchakani |
| answer | phrase_maps | Aganchaka | Aganchakani |
| are you sleeping | corrections | Na·a Tusienga ma? | Na·a tuengama? |
| at school | corrections | skul·o | skulo |
| axe | corrections | rua | Rua (⚠ also means 'to pour' as verb) |
| back | corrections | janggil | jang·gil |
| bamboo | corrections | wa·a | wa· |
| basically | corrections | chong·motan | Chong.motan |
| be happy | corrections | kusi ong·bo | Kusi ong.bo |
| cat | phrase_maps | Menggo | meng·gong |
| catch | phrase_maps | Rim·a | rim·chak·a |
| clean | phrase_maps | Rongtala | Rongtal·ata |
| coin | corrections | tangka bisil | Tangka·bisil |
| come | phrase_maps | Re·ba·a | Re·ba·bo! |
| coming | corrections | re·baenga | Re·baengjok |
| cook | corrections | Song·a | Song·timgipa |
| cook | phrase_maps | Song·a | Song·timgipa |
| dangerous | corrections | Namen kenbegnigipa | Namen kena nanggnigipa |
| darkness | corrections | Andalani | Andala |
| did you eat | corrections | Na·a Cha·aha ma? | Na·a cha·ama? |
| did you go to market | corrections | Na·a Bajal Re·anga ma? | Na·a bajalchi re·angama? |
| did you have lunch | corrections | Na·a mi cha·jok ma? | Na·a mi chajokma? |
| don't eat | corrections | cha·nabe | Cha·ja |
| don't go | corrections | re·angnabe | Re·angbo ong·ja |
| drink | corrections | Ringa | ring·a |
| drink | phrase_maps | Ringa | ring·a |
| east | phrase_maps | Salaram | sal·a·ram |
| eat | corrections | Cha·a | Cha·bo! |
| eat | phrase_maps | Cha·a | Cha·bo! |
| eaten | corrections | cha·jok | cha·man·aha |
| eye | phrase_maps | Mikron | mik·on |
| give me water | phrase_maps | Angna chi on·bo | Ang·na chi on·bo |
| go | phrase_maps | Re·anga | Re·ang·bo |
| green | corrections | tangsek | tang·sik·a |
| green | phrase_maps | Tangsek | tang·sik·a |
| hard | phrase_maps | Rak·a | Raka |
| have you eaten | corrections | Na·a Cha·jok ma? | Na·a cha·ama? |
| hen | phrase_maps | Do·bit | do·obi·ma |
| home | corrections | Nok | nokchi |
| how | corrections | maidake | Maikai |
| how | phrase_maps | Maidake | Maikai |
| i am eating | corrections | Anga cha·enga | Anga cha·oenga |
| i am happy | corrections | Anga kusi ong·a | Anga kusionga |
| i am hungry | phrase_maps | Anga okkria | Anga okkrienga |
| i am sad | corrections | Anga duk ong·a | Anga dukonga |
| i am sick | corrections | Anga sakamenga | Anga kene dongka |
| i am sick | phrase_maps | Anga sakama | Anga kene dongka |
| i am tired | corrections | Anga nenga | Anga jangchakka |
| i am tired | phrase_maps | Anga neng·a | Anga jangchakka |
| i ate | corrections | Anga cha·aha | Anga cha·a |
| i ate rice | corrections | Anga mi cha·aha | Anga mi cha·a |
| i don't have | phrase_maps | Anga dong·ja | Anga dongja / Dongja |
| i don't understand | phrase_maps | Anga ma·sija | Anga man·ja |
| i drank | corrections | Anga ringaha | Anga ringa·a |
| i have a pen | corrections | Ango pen donga | Anga kolom donga |
| i understand | phrase_maps | Anga ma·sia | Anga uia |
| i want to come | corrections | Anga re·ba·na ska | Anga re·ba·na sikenga |
| i want to drink | corrections | Anga ringna ska | Anga ring·na sikenga |
| i want to eat | corrections | Anga cha·na ska | Anga cha·na sikenga |
| i want to go | corrections | Anga re·ang·na ska | Anga re·ang·na sikenga |
| i want to pray | corrections | Anga bi·a·na ska | Anga bi·a·na sikenga |
| i want to sleep | corrections | Anga tusina ska | Anga tusia·na sikenga |
| i want to study | corrections | Anga porana ska | Anga pora·na sikenga |
| i want to work | corrections | Anga dakna ska | Anga dakna sikenga |
| if | corrections | Ode | Ode /·ode |
| it is not good | corrections | nama·gija | Nama ong·ja |
| it is raining | corrections | Mikka waenga | Mikka wabenga |
| left | phrase_maps | Jak·asi | jak·a·si |
| leg | phrase_maps | Ja·a | ja· |
| let's drink | corrections | Hai ringna | Hai ringaha |
| let's eat | corrections | Hai cha·na | Hai cha·ha. |
| let's go to the market | corrections | Hai bajalchi re·na | Hai bajalchi re'na |
| let's play | corrections | Hai kalna | Hai kalaha |
| let's sit | corrections | Hai asongna | Hai asongha |
| let's work | corrections | Hai dakna | Hai dakha |
| long | corrections | ro·a | ro·rek·a |
| long | phrase_maps | Ro·a | ro·rek·a |
| must | corrections | nang·a | Nangchongmotgen |
| my dog | corrections | ang·ni achak | angni mang |
| my father | corrections | ang·ni baba | angni papa |
| my house | corrections | ang·ni nok | angni rang |
| my mother | corrections | ang·ni aai | angni mama |
| new | phrase_maps | Gital | git·al |
| nipple | corrections | Sok kute | sok·kit·e |
| nose | phrase_maps | Gingting | ging |
| pencil | corrections | kolom | kol·om |
| person | corrections | mande | man·de |
| playing | corrections | kal·enga | Kala·enga |
| pray | corrections | Bi·abo | bi·ap·a |
| red | phrase_maps | Gitchak | git·chak |
| roof | corrections | nokking | nok·king |
| run | phrase_maps | Kat·a | Kata |
| search | corrections | Sandia | san·di·a |
| sell | phrase_maps | Pala | pal·a |
| sitting | corrections | asongenga | Asong·enga |
| smoke | corrections | wal·ku | wal·ku·a |
| snake | corrections | chipu | chip·pu |
| snake | phrase_maps | Chipu | chip·pu |
| song | corrections | git | giit |
| south | phrase_maps | Salgipeng | sal·gip·eng |
| stand | phrase_maps | Chadenga | Chakata |
| stay | corrections | donga | dongdang·a |
| studying | corrections | poraenga | Poraienga |
| telling | corrections | aganeng | Aganenga |
| they are working | corrections | Uamang dakenga | Uamang dakoenga |
| thief | corrections | cha·u | Cha·ugipa |
| tiger | phrase_maps | Matcha | mat·cha |
| tired | corrections | nenga | neng·a |
| to pluck | corrections | aka | ak·na |
| tomorrow | phrase_maps | Knalo | Knal |
| wait | phrase_maps | Damo / Sengbo | Damo. |
| walk | phrase_maps | Re·a | re·am·a |
| walking | corrections | re·enga | Re·ang·enga |
| wash | phrase_maps | Su·srong·a | Su·gala |
| west | phrase_maps | Saliram | sal·i·ram |
| what job do you do | corrections | Na·a mai kamko ka·a? | Na·ara mai kamko ka·a? |
| when | corrections | Basaku | Basako |
| where | phrase_maps | Bano | Bao |
| where are you from | phrase_maps | Na·a bano·ni? | Na·a banoni? |
| where is the market | corrections | Bajal bano? | Bajal banoa? |
| why | corrections | Maina | Maini·gimin |
| why | phrase_maps | Maina | Maini·gimin |
| why did you come | corrections | Na·a maini gimin re·baa | Na·a maina reba·a? |
| wrist | corrections | jak gito | jak·git·ok |
| write | phrase_maps | Sea | se·a |
| yellow | phrase_maps | Rimit | rim·it |
| yesterday | phrase_maps | Meja | Mejal |
| you did well | phrase_maps | Na·a nama dak·a | Na·a nama daka |

## Category 3 — Punctuation-only difference (1 item)

| Key | Source | Runtime value (wins) | compiled_dict value |
|---|---|---|---|
| how are you | corrections | Na·a namenga ma? | Na·a namengama? |

## Recommended process (not prescriptive)

1. Claude A triages Category 1 first (highest bug density).
2. For each key kept as a real fix: check `tests/unit/*.test.js` and `docs/CLAUDE_A_*`/`docs/CLAUDE_B_*`
   migration docs for prior decisions before changing anything — per the `wait` lesson.
3. Where `corrections.json`/`phrase_maps.js` should change: edit directly, no engineering
   change needed (Check F will re-verify going forward once removed from the allowlist).
4. Where `grammarOverrides`/`compiled_dict.json` should change: that's a `prepare-data.js`
   edit + rebuild — flag it and I'll do the mechanical part once the correct value is confirmed.
5. Categories 2/3 are lower priority — spot-check only unless time permits full review.
